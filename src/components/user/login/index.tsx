"use client";

import { validateEmail, validatePassword } from "@/lib/function/rules";
import api from "@/lib/utils/ fetcher/client/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import {
  HiAcademicCap,
  HiCheckCircle,
  HiEye,
  HiEyeOff,
  HiUsers,
} from "react-icons/hi";

const Login = () => {
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
  const router = useRouter();
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
      setErrors((prev) => ({
        ...prev,
        password: value.length < 6 ? "Mật khẩu phải có ít nhất 6 ký tự" : "",
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
    const passwordValid = password.length >= 6;

    const newErrors: typeof errors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    if (!passwordValid) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return emailValidation.isValid && passwordValid;
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
      router.push("/dashboard");
    } catch (error: any) {
      if (error?.status === 401) {
        router.push("/email_authentication?email=" + encodeURIComponent(email));
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng nhập vào tài khoản của bạn
            </h2>
            <p className="text-gray-600">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
              <a href="#" className="text-teal-600 hover:underline">
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="#" className="text-teal-600 hover:underline">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
              Tiếp tục với Google
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FaGithub className="w-5 h-5 mr-3 text-gray-900" />
              Tiếp tục với GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-800 text-sm">{errors.general}</div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
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
                className={`relative block w-full px-3 py-4 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm ${
                  errors.email && touched.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="Email"
              />
              {errors.email && touched.email && (
                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`relative block w-full px-3 py-4 pr-12 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm ${
                    errors.password && touched.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <a
                href="#"
                className="text-sm text-teal-600 hover:text-teal-500 hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
              >
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <img
                src="/logo/studynest-logo-white-64.svg"
                alt="StudyNest Logo"
                className="w-20 h-20 mx-auto mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">
                Chào mừng trở lại StudyNest
              </h1>
              <p className="text-xl text-teal-100 mb-8">
                Tiếp tục hành trình học tập của bạn
              </p>
            </div>

            {/* Illustration or Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiCheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Học tập linh hoạt</h3>
                  <p className="text-teal-100 text-sm">Học mọi lúc, mọi nơi</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiAcademicCap className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Chứng chỉ chất lượng</h3>
                  <p className="text-teal-100 text-sm">
                    Được công nhận bởi ngành
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiUsers className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Cộng đồng học tập</h3>
                  <p className="text-teal-100 text-sm">
                    Kết nối với learners khác
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
