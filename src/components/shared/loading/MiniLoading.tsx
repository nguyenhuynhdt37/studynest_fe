"use client";

import { HiAcademicCap } from "react-icons/hi";

interface MiniLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function MiniLoading({
  text = "Đang tải...",
  size = "md",
}: MiniLoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-2xl",
    md: "w-12 h-12 text-3xl",
    lg: "w-16 h-16 text-4xl",
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Logo with Animation */}
      <div className="relative">
        {/* Spinning ring */}
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 border-r-emerald-400 animate-spin" />

          {/* Logo container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce-subtle`}
            >
              <HiAcademicCap className="text-white animate-wiggle-subtle" />
            </div>
          </div>
        </div>
      </div>

      {/* Text with dots */}
      {text && (
        <div className="flex items-center gap-1">
          <span className={`${textSizes[size]} font-medium text-gray-600`}>
            {text}
          </span>
          <div className="flex gap-1">
            <span
              className={`${dotSizes[size]} bg-green-500 rounded-full animate-bounce-dot`}
              style={{ animationDelay: "0s" }}
            />
            <span
              className={`${dotSizes[size]} bg-emerald-500 rounded-full animate-bounce-dot`}
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className={`${dotSizes[size]} bg-teal-500 rounded-full animate-bounce-dot`}
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes wiggle-subtle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }

        @keyframes bounce-dot {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        :global(.animate-bounce-subtle) {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }

        :global(.animate-wiggle-subtle) {
          animation: wiggle-subtle 2s ease-in-out infinite;
        }

        :global(.animate-bounce-dot) {
          animation: bounce-dot 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
