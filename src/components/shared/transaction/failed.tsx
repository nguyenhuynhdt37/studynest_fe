"use client";

import { HiXCircle } from "react-icons/hi";

const Failed = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 via-red-50 to-orange-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Glass card */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-2xl border border-white/40 bg-white/80 backdrop-blur-xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <HiXCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-1">
              Đã xảy ra lỗi trong quá trình thanh toán
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ
            </p>
          </div>

          {/* Redirect indicator */}
          <div className="flex items-center justify-center space-x-2 text-red-600 pt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Đang chuyển hướng...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Failed;

