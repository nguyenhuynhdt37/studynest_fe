"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiAcademicCap,
  HiArrowLeft,
  HiBookOpen,
  HiHome,
  HiSearch,
} from "react-icons/hi";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate effect for redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div
          className="absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-float"
          style={{
            top: "10%",
            left: "10%",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-float"
          style={{
            top: "60%",
            right: "15%",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-float"
          style={{
            bottom: "10%",
            left: "50%",
            animationDelay: "4s",
          }}
        />

        {/* Parallax effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <HiBookOpen
            className="absolute text-green-300"
            style={{
              top: "20%",
              left: "15%",
              fontSize: "4rem",
            }}
          />
          <HiAcademicCap
            className="absolute text-emerald-300"
            style={{
              top: "70%",
              right: "20%",
              fontSize: "5rem",
            }}
          />
          <HiSearch
            className="absolute text-teal-300"
            style={{
              bottom: "15%",
              left: "25%",
              fontSize: "3.5rem",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 leading-none animate-pulse-slow select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-green-200/30 blur-2xl leading-none select-none">
            404
          </div>
        </div>

        {/* StudyNest Logo/Brand */}
        <div className="mb-6 flex items-center gap-3 animate-fade-in-up">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50 transform hover:scale-110 transition-transform duration-300">
              <HiAcademicCap className="text-white text-4xl" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full animate-ping" />
          </div>
          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            StudyNest
          </span>
        </div>

        {/* Message */}
        <div
          className="text-center max-w-2xl mb-12 space-y-4 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Ối! Trang không tồn tại
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Có vẻ như bạn đã lạc đường rồi. Trang bạn đang tìm kiếm không tồn
            tại hoặc đã được chuyển đi nơi khác.
          </p>
          <p className="text-md text-emerald-600 font-medium">
            Đừng lo! Chúng tôi sẽ đưa bạn về trang chủ trong{" "}
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-lg shadow-lg shadow-green-500/50 animate-bounce">
              {countdown}
            </span>{" "}
            giây
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-wrap gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 text-lg">
              <HiHome className="text-2xl" />
              Về Trang Chủ
            </span>
          </Link>

          <button
            onClick={() => router.back()}
            className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300"
          >
            <span className="flex items-center gap-2 text-lg">
              <HiArrowLeft className="text-2xl text-green-600 group-hover:-translate-x-1 transition-transform duration-300" />
              Quay Lại
            </span>
          </button>
        </div>

        {/* Quick Links */}
        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/"
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                <HiHome />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Trang Chủ
                </h3>
                <p className="text-sm text-gray-600">Khám phá khóa học</p>
              </div>
            </div>
          </Link>

          <Link
            href="/course"
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                <HiBookOpen />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Khóa Học
                </h3>
                <p className="text-sm text-gray-600">Danh sách khóa học</p>
              </div>
            </div>
          </Link>

          <Link
            href="/course"
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                <HiSearch />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Tìm Kiếm
                </h3>
                <p className="text-sm text-gray-600">Tìm nội dung học</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Message */}
        <p
          className="mt-12 text-gray-500 text-sm animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          Nếu bạn cho rằng đây là lỗi, vui lòng{" "}
          <Link
            href="/"
            className="text-green-600 hover:text-green-700 font-medium underline"
          >
            liên hệ với chúng tôi
          </Link>
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-30px) translateX(20px);
          }
          66% {
            transform: translateY(30px) translateX(-20px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
