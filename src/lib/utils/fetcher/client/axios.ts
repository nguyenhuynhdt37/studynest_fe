import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { queryClient } from "@/provider/QueryProvider";

const backendUrl =
  process.env.NEXT_PUBLIC_URL_BACKEND || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Refresh Token State ───────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
}> = [];

// ── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Chỉ xử lý 401 khi CÓ response từ server (không phải network error)
    const is401 = error.response?.status === 401;
    if (!is401) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) return Promise.reject(error);

    // Skip nếu đây chính là request refresh
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Skip nếu đã retry rồi (tránh infinite loop)
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Gọi API refresh (Dùng axios gốc để tránh interceptor này tạo vòng lặp vô tận)
      // Web dùng withCredentials: true để backend tự lấy refresh_token từ cookie
      await axios.post(
        `${backendUrl}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );

      // Invalidate tất cả queries để force refetch với session mới
      await queryClient.invalidateQueries();

      // Resolve tất cả các request đang đợi trong queue
      failedQueue.forEach((p) => p.resolve(null));
      failedQueue = [];

      return api(originalRequest);
    } catch (refreshError) {
      // Reject tất cả các request đang đợi
      failedQueue.forEach((p) => p.reject(refreshError));
      failedQueue = [];

      // Xử lý logout nếu refresh thất bại
      if (typeof window !== "undefined") {
        try {
          const { useUserStore } = await import("@/stores/user");
          useUserStore.getState().clearUser();
        } catch (e) {
          console.error("Failed to clear user store:", e);
        }
        
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
