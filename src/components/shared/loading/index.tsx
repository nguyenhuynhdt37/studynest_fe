"use client";
import React, { useEffect, useState } from "react";
import { HiAcademicCap } from "react-icons/hi";

const tips = [
  "🌱 Mỗi ngày học một chút, bạn sẽ xây được cả một kho tri thức lớn",
  "💡 Thất bại chỉ là bước đệm để bạn hiểu sâu hơn và tiến xa hơn",
  "🔑 Kiên nhẫn là chiếc chìa khóa mở ra mọi cánh cửa thành công",
  "🤝 Chia sẻ kiến thức giúp bạn ghi nhớ lâu và học nhanh hơn",
  "🎯 Học đa dạng kỹ năng sẽ giúp bạn thích ứng tốt với mọi thay đổi",
  "⭐ Đặt mục tiêu nhỏ và kiên trì sẽ tạo nên những bước tiến lớn",
  "🧠 Không ngừng tò mò và đặt câu hỏi, đó là cách bạn trưởng thành",
  "📚 Tri thức là sức mạnh, học tập là chìa khóa thành công",
  "🚀 Hành trình nghìn dặm bắt đầu từ một bước chân",
  "💪 Mỗi thử thách là cơ hội để bạn trở nên mạnh mẽ hơn",
];
const StudyNestLoading = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const loadingSteps = [
    "Đang khởi tạo môi trường học tập...",
    "Đang tải nội dung khóa học...",
    "Đang chuẩn bị giao diện...",
    "Sắp hoàn thành...",
  ];

  useEffect(() => {
    setMounted(true);

    // Progress animation with realistic steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 8 + 2;
        const nextProgress = prev + increment;

        // Update loading steps based on progress
        if (nextProgress > 25 && currentStep === 0) setCurrentStep(1);
        if (nextProgress > 50 && currentStep === 1) setCurrentStep(2);
        if (nextProgress > 75 && currentStep === 2) setCurrentStep(3);
        if (nextProgress > 90 && !isCompleting) {
          setIsCompleting(true);
          return 92;
        }

        return nextProgress > 92 ? 92 : nextProgress;
      });
    }, 300);

    // Tip rotation
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [currentStep, isCompleting]);

  // Complete loading after realistic time
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 studynest-loading">
      {/* StudyNest Branded Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-95">
        {/* Floating Knowledge Icons */}
        <div className="floating-icons">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-icon"
              style={
                {
                  "--index": i,
                  "--x": `${Math.random() * 100}%`,
                  "--y": `${Math.random() * 100}%`,
                  "--delay": `${Math.random() * 3}s`,
                  "--duration": `${4 + Math.random() * 2}s`,
                } as React.CSSProperties
              }
            >
              {["📚", "🎓", "💡", "🚀", "⭐", "🌟"][i % 6]}
            </div>
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="grid-pattern" />
        </div>
      </div>

      <div
        className={`transform transition-all duration-1000 ${
          mounted
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <div className="relative flex flex-col items-center max-w-lg px-12 py-16 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          {/* StudyNest Logo Section - Trọng tâm */}
          <div className="relative mb-8">
            {/* Orbiting Elements */}
            <div className="relative h-40 w-40">
              {/* Rotating rings with StudyNest colors - Larger */}
              <div className="absolute inset-0 rounded-full border-[3px] border-green-300 animate-spin-slow opacity-50" />
              <div className="absolute inset-3 rounded-full border-2 border-emerald-300 animate-spin-reverse opacity-40" />
              <div className="absolute inset-6 rounded-full border-2 border-teal-400 animate-pulse opacity-60" />

              {/* Orbiting dots - More prominent */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full orbit-dot shadow-lg shadow-green-500/50"
                  style={
                    {
                      "--orbit-angle": `${i * 120}deg`,
                      "--orbit-delay": `${i * 0.8}s`,
                    } as React.CSSProperties
                  }
                />
              ))}

              {/* Main logo container - Bigger & More prominent */}
              <div className="absolute inset-8 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 shadow-2xl shadow-green-500/50">
                <div className="relative">
                  {/* Glowing effect behind logo */}
                  <div className="absolute inset-0 bg-white rounded-xl blur-xl opacity-50 animate-pulse" />
                  {/* StudyNest Icon */}
                  <div className="relative z-10 logo-float">
                    <HiAcademicCap className="text-white text-6xl drop-shadow-2xl" />
                  </div>
                </div>
              </div>

              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-2xl animate-pulse-slow" />
            </div>
          </div>

          {/* StudyNest Branding */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-2 tracking-wide">
              STUDYNEST
            </h1>
            <p className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Nền tảng học trực tuyến
            </p>
          </div>

          {/* Loading Status */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {loadingSteps[currentStep]}
            </h2>
            <div className="flex items-center justify-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-80 mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="absolute h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full progress-glow transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute h-full w-16 bg-white/30 animate-shimmer-progress rounded-full" />
            </div>
          </div>

          {/* Learning Tips Carousel */}
          <div className="h-20 text-center overflow-hidden relative w-full px-4">
            <div
              className="transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateY(-${tipIndex * 100}%)`,
              }}
            >
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="h-20 flex items-center justify-center text-gray-600 text-base leading-relaxed px-2"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* StudyNest Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-xs text-gray-400 font-mono">
              <span className="animate-pulse mr-2 text-green-500">●</span>
              <span>Powered by StudyNest Learning Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* StudyNest Loading Styles */}
      <style jsx>{`
        .studynest-loading {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float-up {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes shimmer-progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }

        @keyframes logo-float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        :global(.animate-spin-slow) {
          animation: spin-slow 3s linear infinite;
        }

        :global(.animate-spin-reverse) {
          animation: spin-reverse 4s linear infinite;
        }

        :global(.animate-shimmer-progress) {
          animation: shimmer-progress 2s linear infinite;
        }

        :global(.logo-float) {
          animation: logo-float 3s ease-in-out infinite;
        }

        .floating-icons .floating-icon {
          position: absolute;
          font-size: 1.5rem;
          left: var(--x);
          top: var(--y);
          animation: float-up var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          pointer-events: none;
          user-select: none;
        }

        .orbit-dot {
          top: 50%;
          left: 50%;
          transform-origin: center;
          animation: orbit 4s linear infinite;
          animation-delay: var(--orbit-delay);
          transform: rotate(var(--orbit-angle)) translateX(50px)
            rotate(calc(-1 * var(--orbit-angle)));
        }

        .progress-glow {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .grid-pattern {
          background-image: linear-gradient(
              rgba(34, 197, 94, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          width: 100%;
          height: 100%;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
};

export default StudyNestLoading;
