import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🟢 quan trọng: gửi cookie kèm request
});

// Response interceptor: trả luôn data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ Phiên đăng nhập hết hạn hoặc cookie không hợp lệ");
      // 👉 có thể redirect /login hoặc gọi refresh_token API ở đây
    }
    return Promise.reject(error);
  }
);

export default api;
