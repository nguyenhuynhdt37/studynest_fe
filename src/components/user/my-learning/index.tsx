"use client";

import type { CoursesMeSortOption } from "@/types/user/courses-me";
import { CourseListPanel } from "./course-list-panel";
import type { EmptyStateContent } from "./empty-states";

const sortOptions: CoursesMeSortOption[] = [
  { value: "enrolled_at", label: "Thời gian thanh toán" },
  { value: "created_at", label: "Thời gian tạo khóa học" },
  { value: "title", label: "Tên khóa học" },
  { value: "rating_avg", label: "Đánh giá" },
  { value: "views", label: "Lượt xem" },
  { value: "progress", label: "Tiến độ" },
];

const emptyState: EmptyStateContent = {
  title: "Bạn chưa mua khóa học nào",
  description:
    "Khám phá thư viện khóa học và bắt đầu hành trình học tập ngay hôm nay.",
  actionHref: "/courses",
  actionLabel: "Khám phá khóa học",
};

export default function CoursesMeSection() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Khóa học của tôi</h1>
        <p className="text-sm text-gray-600">
          Theo dõi và tiếp tục những khóa học bạn đã sở hữu.
        </p>
      </header>

      <CourseListPanel
        heading="Khóa học đã mua"
        description="Danh sách tất cả khóa học bạn đã mua và đang học."
        basePath="purchases/courses"
        variant="purchased"
        empty={emptyState}
        sortOptions={sortOptions}
      />
    </div>
  );
}
