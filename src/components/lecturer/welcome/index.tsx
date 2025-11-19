"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiAcademicCap,
  HiCurrencyDollar,
  HiPlay,
  HiSparkles,
  HiUsers,
  HiVideoCamera,
} from "react-icons/hi";

const LecturerWelcome = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div
              className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "4s" }}
            ></div>
            <div
              className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "6s" }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-[90vh]">
            <div className="w-full">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-sm border border-green-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-semibold text-green-700">
                    Trở thành giảng viên ngay hôm nay
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="text-gray-900">Trở thành giảng viên</span>
                    <br />
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Chia sẻ kiến thức và kiếm thu nhập
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Tham gia cộng đồng giảng viên hàng đầu tại StudyNest. Tạo
                    khóa học, chia sẻ kiến thức và kiếm thu nhập từ đam mê của
                    bạn.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <button
                    onClick={() => router.push("/lecturer/courses/create")}
                    className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center"
                  >
                    <HiPlay className="mr-2 h-5 w-5" />
                    Bắt đầu ngay
                  </button>

                  <button className="group border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center">
                    <HiSparkles className="mr-2 h-5 w-5" />
                    Tìm hiểu thêm
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      10K+
                    </div>
                    <div className="text-sm font-medium text-gray-600 mt-1">
                      Giảng viên
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      50K+
                    </div>
                    <div className="text-sm font-medium text-gray-600 mt-1">
                      Khóa học
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      70%
                    </div>
                    <div className="text-sm font-medium text-gray-600 mt-1">
                      Hoa hồng
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HiVideoCamera className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Tạo khóa học dễ dàng
                  </h3>
                  <p className="text-sm text-gray-600">
                    Công cụ tạo nội dung trực quan, hỗ trợ video, quiz, tài liệu
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HiCurrencyDollar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Thu nhập hấp dẫn
                  </h3>
                  <p className="text-sm text-gray-600">
                    Nhận 70% hoa hồng từ mỗi khóa học, thanh toán nhanh chóng
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HiUsers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Cộng đồng lớn mạnh
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tham gia cộng đồng 10,000+ giảng viên đang phát triển
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LecturerWelcome;
