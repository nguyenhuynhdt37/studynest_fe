"use client";

import ContextMenu from "@/components/shared/context-menu";
import React from "react";
import {
  HiAcademicCap,
  HiBookOpen,
  HiCalendar,
  HiChat,
  HiClock,
  HiCurrencyDollar,
  HiDotsHorizontal,
  HiDownload,
  HiEye,
  HiTrendingDown,
  HiTrendingUp,
  HiUsers,
} from "react-icons/hi";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ElementType;
  color: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors duration-300">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {changeType === "increase" ? (
              <HiTrendingUp className="w-4 h-4 text-green-500 mr-1 animate-pulse" />
            ) : (
              <HiTrendingDown className="w-4 h-4 text-red-500 mr-1 animate-pulse" />
            )}
            <span
              className={`text-sm font-medium ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}
            </span>
            <span className="text-gray-500 text-sm ml-1">
              so với tháng trước
            </span>
          </div>
        </div>
        <div
          className={`p-4 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartProps {
  title: string;
  data: ChartData[];
}

function Chart({ title, data }: ChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onEsc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("contextmenu", close);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("contextmenu", close);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <div
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500"
      onContextMenu={openMenu}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Độ phổ biến khóa học
        </h3>
        <button
          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 sm:hidden"
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setMenuPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
            setMenuOpen(true);
          }}
          title="Thao tác"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 4a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 20a2 2 0 110-4 2 2 0 010 4z" /></svg>
        </button>
      </div>

      <div className="space-y-6">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div
              key={index}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full ${item.color} shadow-lg group-hover:scale-125 transition-transform duration-300`}
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${item.color.replace(
                      "bg-",
                      "bg-gradient-to-r from-"
                    )} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right group-hover:text-green-600 transition-colors duration-300">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {menuOpen && (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          onClose={() => setMenuOpen(false)}
          items={[
            { label: "Xem chi tiết", onClick: () => setMenuOpen(false) },
            { label: "Xuất dữ liệu", onClick: () => setMenuOpen(false) },
          ]}
        />
      )}
    </div>
  );
}

interface RecentActivityProps {
  activities: Array<{
    id: number;
    user: string;
    action: string;
    time: string;
    avatar: string;
  }>;
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Hoạt động gần đây
        </h3>
        <button className="text-green-600 hover:text-green-700 text-sm font-semibold transition-all duration-300 hover:scale-105">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-semibold text-sm">
                {activity.user.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                <span className="font-bold">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "12,543",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: HiUsers,
      color: "bg-green-500",
    },
    {
      title: "Khóa học hoạt động",
      value: "89",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: HiBookOpen,
      color: "bg-emerald-500",
    },
    {
      title: "Doanh thu",
      value: "$45,231",
      change: "-2.4%",
      changeType: "decrease" as const,
      icon: HiCurrencyDollar,
      color: "bg-teal-500",
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: "87.3%",
      change: "+5.1%",
      changeType: "increase" as const,
      icon: HiAcademicCap,
      color: "bg-green-600",
    },
  ];

  const courseData = [
    { name: "React Fundamentals", value: 245, color: "bg-green-500" },
    { name: "JavaScript Advanced", value: 189, color: "bg-emerald-500" },
    { name: "Node.js Backend", value: 156, color: "bg-teal-500" },
    { name: "Python Data Science", value: 134, color: "bg-green-600" },
    { name: "UI/UX Design", value: 98, color: "bg-emerald-600" },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "đã hoàn thành khóa học React Fundamentals",
      time: "2 phút trước",
      avatar: "JD",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      action: "đã đăng ký khóa học JavaScript Advanced",
      time: "15 phút trước",
      avatar: "SW",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "đã nộp bài tập cho khóa học Node.js Backend",
      time: "1 giờ trước",
      avatar: "MJ",
    },
    {
      id: 4,
      user: "Emily Davis",
      action: "đã nhận được chứng chỉ Python Data Science",
      time: "2 giờ trước",
      avatar: "ED",
    },
    {
      id: 5,
      user: "Alex Brown",
      action: "đã bắt đầu khóa học UI/UX Design",
      time: "3 giờ trước",
      avatar: "AB",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-green-500/25">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Chào mừng trở lại, Admin! 👋
            </h1>
            <p className="text-green-100 text-lg">
              Đây là những gì đang diễn ra trên nền tảng của bạn hôm nay.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group">
              <HiDownload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Xuất báo cáo</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group">
              <HiCalendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Lên lịch cuộc họp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Popularity Chart */}
        <div className="lg:col-span-2">
          <Chart title="Course Popularity" data={courseData} />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-8 hover:shadow-xl hover:shadow-black/10 transition-all duration-500">
        <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            {
              icon: HiUsers,
              label: "Thêm người dùng",
              color: "bg-gradient-to-r from-green-500 to-green-600",
            },
            {
              icon: HiBookOpen,
              label: "Tạo khóa học",
              color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
            },
            {
              icon: HiChat,
              label: "Gửi tin nhắn",
              color: "bg-gradient-to-r from-teal-500 to-teal-600",
            },
            {
              icon: HiAcademicCap,
              label: "Cấp chứng chỉ",
              color: "bg-gradient-to-r from-green-600 to-emerald-600",
            },
            {
              icon: HiEye,
              label: "Xem báo cáo",
              color: "bg-gradient-to-r from-emerald-600 to-teal-600",
            },
            {
              icon: HiClock,
              label: "Lên lịch sự kiện",
              color: "bg-gradient-to-r from-teal-600 to-green-600",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center space-y-3 p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 group hover:scale-105"
              onContextMenu={(e) => {
                e.preventDefault();
                // simple context for quick actions
                const el = e.currentTarget as HTMLElement;
                const rect = el.getBoundingClientRect();
                const evt = new CustomEvent("open-qa-menu", {
                  detail: { x: rect.left + rect.width / 2, y: rect.bottom + 8, label: action.label },
                });
                window.dispatchEvent(evt);
              }}
            >
              <div
                className={`p-4 rounded-2xl ${action.color} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Lightweight global QA menu for quick actions */}
      <DashboardQAMenu />
    </div>
  );
}

function DashboardQAMenu() {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [label, setLabel] = React.useState<string>("");
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { x: number; y: number; label: string };
      setLabel(detail.label);
      setPos({ x: detail.x, y: detail.y });
      setOpen(true);
    };
    window.addEventListener("open-qa-menu" as any, handler);
    return () => window.removeEventListener("open-qa-menu" as any, handler);
  }, []);
  if (!open) return null;
  return (
    <ContextMenu
      x={pos.x}
      y={pos.y}
      onClose={() => setOpen(false)}
      items={[
        { label: `Thực hiện: ${label}`, onClick: () => setOpen(false) },
      ]}
    />
  );
}
