import { FavoritesPanel } from "./favorites-panel";

const emptyState = {
  title: "Bạn chưa yêu thích khóa học nào",
  description:
    "Khám phá kho khóa học phong phú và nhấn trái tim để lưu những khóa học bạn thích.",
  actionHref: "/courses",
  actionLabel: "Khám phá khóa học",
};

export default function FavoritesSection() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Khóa học yêu thích
        </h1>
        <p className="text-sm text-slate-500">
          Theo dõi những khóa học bạn đã lưu để dễ dàng quay lại và đăng ký khi
          sẵn sàng.
        </p>
      </header>

      <FavoritesPanel
        heading="Danh sách yêu thích"
        description="Sắp xếp và lọc khóa học yêu thích để tìm lại nội dung bạn quan tâm."
        empty={emptyState}
      />
    </div>
  );
}
