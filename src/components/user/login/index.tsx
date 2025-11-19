"use client";

import api from "@/lib/utils/fetcher/client/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";

// Validation functions
const validateEmail = (
  email: string
): { isValid: boolean; message: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "Email không được để trống" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không hợp lệ" };
  }

  return { isValid: true, message: "" };
};

const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (!password.trim()) {
    return { isValid: false, message: "Mật khẩu không được để trống" };
  }

  if (password.length < 6) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  return { isValid: true, message: "" };
};

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  // Validation handlers
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const validation = validateEmail(value);
      setErrors((prev) => ({
        ...prev,
        email: validation.isValid ? "" : validation.message,
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const validation = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: validation.isValid ? "" : validation.message,
      }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "email") {
      const validation = validateEmail(email);
      setErrors((prev) => ({
        ...prev,
        email: validation.isValid ? "" : validation.message,
      }));
    } else if (field === "password") {
      const { isValid, message } = validatePassword(password);
      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          password: message,
        }));
      }
    }
  };

  const validateForm = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors: typeof errors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return emailValidation.isValid && passwordValidation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Clear previous general error
    setErrors((prev) => ({ ...prev, general: "" }));

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      // Redirect về URL được chỉ định hoặc về trang chủ
      router.push(redirectUrl);
      router.refresh();
    } catch (error: any) {
      if (error?.status === 401) {
        const redirectParam =
          redirectUrl !== "/"
            ? `&redirect=${encodeURIComponent(redirectUrl)}`
            : "";
        router.push(
          "/email_authentication?email=" +
            encodeURIComponent(email) +
            redirectParam
        );
      } else if (error?.status === 404) {
        setErrors((prev) => ({
          ...prev,
          general: "Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backend =
      process.env.NEXT_PUBLIC_URL_BACKEND || "http://127.0.0.1:8000";
    const redirectParam = redirectUrl
      ? `?redirect=${encodeURIComponent(redirectUrl)}`
      : "";
    if (typeof window !== "undefined") {
      window.location.href = `${backend}/api/v1/auth/google/login${redirectParam}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-sm border-2 border-gray-200 bg-white p-6 space-y-6">
          <div className="text-center space-y-1">
            <img
              src="/logo/studynest-logo.svg"
              alt="StudyNest"
              className="w-10 h-10 mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
            <p className="text-sm text-gray-600">
              Sử dụng email và mật khẩu của bạn
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-800 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            Đăng nhập với Google
          </button>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`block w-full px-3 py-2 border-2 rounded-lg text-sm transition-colors ${
                  errors.email && touched.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && touched.email && (
                <div className="text-red-600 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <a
                  href="#"
                  className="text-xs text-green-700 hover:text-green-800"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`block w-full px-3 py-2 pr-10 border-2 rounded-lg text-sm transition-colors ${
                    errors.password && touched.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                  }`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-green-700 hover:text-green-800 font-semibold"
            >
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
