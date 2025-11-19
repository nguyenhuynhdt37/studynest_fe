"use client";

import { playSound, triggerPerfectConfetti } from "@/lib/utils/helpers/effects";
import { useEffect } from "react";
import { HiCheckCircle } from "react-icons/hi";

const Success = () => {
  useEffect(() => {
    triggerPerfectConfetti();
    playSound("perfect");
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-r from-teal-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Glass card */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-2xl border border-white/40 bg-white/80 backdrop-blur-xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <HiCheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </p>
          </div>

          {/* Redirect indicator */}
          <div className="flex items-center justify-center space-x-2 text-green-600 pt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Đang chuyển hướng...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
