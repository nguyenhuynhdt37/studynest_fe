"use client";

import {
  HiCamera,
  HiChartBar,
  HiCode,
  HiCurrencyDollar,
  HiHeart,
  HiLightningBolt,
  HiMusicNote,
} from "react-icons/hi";

const categories = [
  {
    id: "development",
    name: "Phát triển",
    icon: HiCode,
    color: "bg-blue-500",
  },
  {
    id: "business",
    name: "Kinh doanh",
    icon: HiChartBar,
    color: "bg-green-500",
  },
  {
    id: "design",
    name: "Thiết kế",
    icon: HiCamera,
    color: "bg-purple-500",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: HiLightningBolt,
    color: "bg-yellow-500",
  },
  { id: "music", name: "Âm nhạc", icon: HiMusicNote, color: "bg-pink-500" },
  {
    id: "photography",
    name: "Nhiếp ảnh",
    icon: HiCamera,
    color: "bg-indigo-500",
  },
  { id: "health", name: "Sức khỏe", icon: HiHeart, color: "bg-red-500" },
  {
    id: "finance",
    name: "Tài chính",
    icon: HiCurrencyDollar,
    color: "bg-emerald-500",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
            Khám phá theo danh mục
          </h2>
          <p className="text-emerald-600 font-medium">
            Tìm khóa học phù hợp với sở thích và mục tiêu của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group bg-white rounded-xl p-5 text-center hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

