"use client";

import {
  getPasswordStrength,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
} from "@/lib/function/rules";
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

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [touched, setTouched] = useState({
    email: false,
    fullName: false,
    password: false,
    confirmPassword: false,
  });

  // Validation handlers
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const validation = validateEmail(value);
      setEmailError(validation.isValid ? "" : validation.message);
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (touched.fullName) {
      const validation = validateFullName(value);
      setFullNameError(validation.isValid ? "" : validation.message);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const validation = validatePassword(value);
      setPasswordError(validation.isValid ? "" : validation.message);
    }

    // Also validate confirm password if it exists
    if (confirmPassword && touched.confirmPassword) {
      const confirmValidation = validatePasswordConfirmation(
        value,
        confirmPassword
      );
      setConfirmPasswordError(
        confirmValidation.isValid ? "" : confirmValidation.message
      );
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      const validation = validatePasswordConfirmation(password, value);
      setConfirmPasswordError(validation.isValid ? "" : validation.message);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });

    // Validate on blur
    switch (field) {
      case "email":
        const emailValidation = validateEmail(email);
        setEmailError(emailValidation.isValid ? "" : emailValidation.message);
        break;
      case "fullName":
        const nameValidation = validateFullName(fullName);
        setFullNameError(nameValidation.isValid ? "" : nameValidation.message);
        break;
      case "password":
        const passwordValidation = validatePassword(password);
        setPasswordError(
          passwordValidation.isValid ? "" : passwordValidation.message
        );
        break;
      case "confirmPassword":
        const confirmValidation = validatePasswordConfirmation(
          password,
          confirmPassword
        );
        setConfirmPasswordError(
          confirmValidation.isValid ? "" : confirmValidation.message
        );
        break;
    }
  };

  const isFormValid = () => {
    const emailValidation = validateEmail(email);
    const nameValidation = validateFullName(fullName);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordConfirmation(
      password,
      confirmPassword
    );

    return (
      emailValidation.isValid &&
      nameValidation.isValid &&
      passwordValidation.isValid &&
      confirmValidation.isValid
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      fullName: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const emailValidation = validateEmail(email);
    const nameValidation = validateFullName(fullName);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordConfirmation(
      password,
      confirmPassword
    );

    setEmailError(emailValidation.isValid ? "" : emailValidation.message);
    setFullNameError(nameValidation.isValid ? "" : nameValidation.message);
    setPasswordError(
      passwordValidation.isValid ? "" : passwordValidation.message
    );
    setConfirmPasswordError(
      confirmValidation.isValid ? "" : confirmValidation.message
    );

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        email,
        full_name: fullName,
        password,
      });
      router.push(
        "/email_authentication?registered=true&email=" +
          encodeURIComponent(email)
      );
    } catch (e: any) {
      if (e?.status === 409) {
        setEmailError("Email đã được sử dụng. Vui lòng thử email khác.");
      }
      console.log("====================================");
      console.log(e);
      console.log("====================================");
    } finally {
      setIsLoading(false);
    }
  };

  // Get password strength for display
  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản StudyNest của bạn
            </h2>
            <p className="text-gray-600">
              Bằng cách đăng ký, bạn đồng ý với{" "}
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
              Đăng ký với Google
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FaGithub className="w-5 h-5 mr-3 text-gray-900" />
              Đăng ký với GitHub
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

          {/* Register Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="sr-only">
                Họ và tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={`relative block w-full px-3 py-4 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm ${
                  fullNameError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="Họ và tên"
              />
              {fullNameError && (
                <div className="text-red-600 text-sm mt-1">{fullNameError}</div>
              )}
            </div>

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
                  emailError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="Email"
              />
              {emailError && (
                <div className="text-red-600 text-sm mt-1">{emailError}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`relative block w-full px-3 py-4 pr-12 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm ${
                  passwordError
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

              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.level === "weak"
                            ? "bg-red-500 w-1/4"
                            : passwordStrength.level === "medium"
                            ? "bg-yellow-500 w-2/4"
                            : passwordStrength.level === "strong"
                            ? "bg-green-500 w-3/4"
                            : "bg-green-600 w-full"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.level === "weak"
                        ? "Yếu"
                        : passwordStrength.level === "medium"
                        ? "Trung bình"
                        : passwordStrength.level === "strong"
                        ? "Mạnh"
                        : "Rất mạnh"}
                    </span>
                  </div>
                </div>
              )}

              {passwordError && (
                <div className="text-red-600 text-sm mt-1">{passwordError}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className={`relative block w-full px-3 py-4 pr-12 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 text-sm ${
                  confirmPasswordError && touched.confirmPassword
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="Xác nhận mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>

            {/* Confirm Password Error */}
            {confirmPasswordError && touched.confirmPassword && (
              <div className="text-red-600 text-sm">{confirmPasswordError}</div>
            )}

            {/* Register Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
              >
                Đăng nhập
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
                Tham gia StudyNest ngay hôm nay
              </h1>
              <p className="text-xl text-teal-100 mb-8">
                Bắt đầu hành trình học tập của bạn
              </p>
            </div>

            {/* Illustration or Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiCheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Miễn phí đăng ký</h3>
                  <p className="text-teal-100 text-sm">Không mất phí bất kỳ</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiAcademicCap className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Hàng nghìn khóa học</h3>
                  <p className="text-teal-100 text-sm">
                    Từ cơ bản đến nâng cao
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <HiUsers className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Cộng đồng hỗ trợ</h3>
                  <p className="text-teal-100 text-sm">
                    Học cùng hàng triệu người
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

export default Register;
