// Middleware chạy mặc định trên edge runtime trong Next.js

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const backendUrl =
  process.env.NEXT_PUBLIC_URL_BACKEND || "http://127.0.0.1:8000";

async function getUser(token: string) {
  try {
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        Cookie: `access_token=${token}; Path=/; HttpOnly`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function refreshSession(refreshToken: string) {
  try {
    const res = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        device_type: "WEB",
      }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function withSessionCookies(req: NextRequest, session: any) {
  const requestHeaders = new Headers(req.headers);
  const existingCookie = requestHeaders.get("cookie") || "";
  const cookieParts = existingCookie
    .split(";")
    .map((part) => part.trim())
    .filter(
      (part) =>
        part &&
        !part.startsWith("access_token=") &&
        !part.startsWith("refresh_token=")
    );

  cookieParts.push(`access_token=${session.access_token}`);
  cookieParts.push(`refresh_token=${session.refresh_token}`);
  requestHeaders.set("cookie", cookieParts.join("; "));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const secure = req.nextUrl.protocol === "https:";
  response.cookies.set("access_token", session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });
  response.cookies.set("refresh_token", session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}

const ADMIN_PREFIX = "/admin";
const LECTURER_PREFIX = "/lecturer";
const USER_PREFIXES = [
  "/profile",
  "/my-learning",
  "/favorites",
  "/notifications",
  "/wallets",
  "/refunds",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Lấy origin từ headers để giữ nguyên host thực tế (127.0.0.1 hoặc localhost)
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  let token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const isAdmin = path.startsWith(ADMIN_PREFIX);
  const isLecturer = path.startsWith(LECTURER_PREFIX);
  const isUserRoute = USER_PREFIXES.some((r) => path.startsWith(r));

  // PUBLIC
  if (!isAdmin && !isLecturer && !isUserRoute) {
    return NextResponse.next();
  }

  // No token and no refresh token -> Redirect to login
  if (!token && !refreshToken) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(path)}`, origin)
    );
  }

  if (!token && refreshToken) {
    const session = await refreshSession(refreshToken);
    if (!session?.access_token || !session?.refresh_token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(path)}`, origin)
      );
    }

    token = session.access_token;
    const user = await getUser(session.access_token);
    if (!user) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(path)}`, origin)
      );
    }

    if (user.is_banned) {
      return NextResponse.redirect(new URL("/banned", origin));
    }

    if (isAdmin && !user.roles?.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/", origin));
    }

    if (
      isLecturer &&
      !path.startsWith("/lecturer/welcome") &&
      !user.roles?.includes("LECTURER")
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }

    if (
      isUserRoute &&
      !user.roles?.includes("USER") &&
      !user.roles?.includes("LECTURER") &&
      !user.roles?.includes("ADMIN")
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }

    return withSessionCookies(req, session);
  }

  const user = await getUser(token!);
  if (!user) {
    if (refreshToken) {
      const session = await refreshSession(refreshToken);
      if (session?.access_token && session?.refresh_token) {
        const refreshedUser = await getUser(session.access_token);
        if (!refreshedUser) {
          return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(path)}`, origin)
          );
        }

        if (refreshedUser.is_banned) {
          return NextResponse.redirect(new URL("/banned", origin));
        }

        if (isAdmin && !refreshedUser.roles?.includes("ADMIN")) {
          return NextResponse.redirect(new URL("/", origin));
        }

        if (
          isLecturer &&
          !path.startsWith("/lecturer/welcome") &&
          !refreshedUser.roles?.includes("LECTURER")
        ) {
          return NextResponse.redirect(new URL("/", origin));
        }

        if (
          isUserRoute &&
          !refreshedUser.roles?.includes("USER") &&
          !refreshedUser.roles?.includes("LECTURER") &&
          !refreshedUser.roles?.includes("ADMIN")
        ) {
          return NextResponse.redirect(new URL("/", origin));
        }

        return withSessionCookies(req, session);
      }
    }
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(path)}`, origin)
    );
  }

  if (user.is_banned) {
    return NextResponse.redirect(new URL("/banned", origin));
  }

  // ADMIN
  if (isAdmin) {
    if (!user.roles?.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/", origin));
    }
    return NextResponse.next();
  }

  // LECTURER
  if (isLecturer) {
    if (!path.startsWith("/lecturer/welcome")) {
      if (!user.roles?.includes("LECTURER")) {
        return NextResponse.redirect(new URL("/", origin));
      }
    }
    return NextResponse.next();
  }

  // USER
  if (isUserRoute) {
    if (
      !user.roles?.includes("USER") &&
      !user.roles?.includes("LECTURER") &&
      !user.roles?.includes("ADMIN")
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/lecturer",
    "/lecturer/:path*",
    "/profile/:path*",
    "/my-learning/:path*",
    "/favorites/:path*",
    "/notifications/:path*",
    "/wallets/:path*",
    "/refunds/:path*",
  ],
};
