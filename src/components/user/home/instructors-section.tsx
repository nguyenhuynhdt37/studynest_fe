"use client";

import { getGoogleDriveImageUrl } from "@/lib/utils/helpers/image";
import {
  HiBadgeCheck,
  HiBookOpen,
  HiUsers,
} from "react-icons/hi";

const instructors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    title: "Senior Full-Stack Developer tại Google",
    students: 125000,
    courses: 15,
    rating: 4.9,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialties: ["JavaScript", "React", "Node.js"],
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    title: "Lead UI/UX Designer tại Facebook",
    students: 89000,
    courses: 12,
    rating: 4.8,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    specialties: ["Figma", "Adobe XD", "Sketch"],
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    title: "Data Scientist tại Microsoft",
    students: 156000,
    courses: 18,
    rating: 4.9,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialties: ["Python", "Machine Learning", "TensorFlow"],
    verified: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    title: "Digital Marketing Expert tại Amazon",
    students: 112000,
    courses: 14,
    rating: 4.7,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialties: ["Google Ads", "Facebook Ads", "SEO"],
    verified: true,
  },
];

const InstructorsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
            Giảng viên hàng đầu
          </h2>
          <p className="text-emerald-600 font-medium flex items-center justify-center gap-2">
            <span className="text-green-500">👨‍🏫</span>
            Học từ những chuyên gia có kinh nghiệm thực tế
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group bg-white rounded-xl p-6 text-center hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-2"
            >
              <div className="relative mb-4 inline-block">
                <div className="w-20 h-20 rounded-full ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-300 overflow-hidden">
                  <img
                    src={getGoogleDriveImageUrl(instructor.avatar)}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {instructor.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <HiBadgeCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                {instructor.name}
              </h3>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                {instructor.title}
              </p>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex items-center justify-center gap-1">
                  <HiUsers className="h-4 w-4 text-green-500" />
                  <span className="font-semibold" suppressHydrationWarning>
                    {instructor.students.toLocaleString("en-US")}
                  </span>{" "}
                  học viên
                </div>
                <div className="flex items-center justify-center gap-1">
                  <HiBookOpen className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold">{instructor.courses}</span>{" "}
                  khóa học
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {instructor.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold border border-green-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer">
                Xem khóa học
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;

