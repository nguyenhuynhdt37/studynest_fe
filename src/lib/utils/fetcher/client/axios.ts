import axios from "axios";

const backendUrl =
  process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";
const api = axios.create({
  baseURL: `${backendUrl}/api/v1`, // 👈 gọi relative URL, nhờ rewrites sẽ proxy tới backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⚡ cookie sẽ tự đi kèm
});

// Response interceptor: trả luôn data
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ Phiên đăng nhập hết hạn hoặc cookie không hợp lệ");
      // 👉 có thể redirect /login hoặc refresh token ở đây
    }
    return Promise.reject(error);
  }
);

export default api;
