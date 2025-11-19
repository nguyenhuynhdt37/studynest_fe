"use client";

import { Notification } from "@/types/user/notification";
import Link from "next/link";
import { HiCheckCircle, HiClock } from "react-icons/hi";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
}: NotificationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wallet: "Ví",
      course: "Khóa học",
      system: "Hệ thống",
      learning: "Học tập",
    };
    return labels[type] || type;
  };

  const cardContent = (
    <div
      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
        notification.is_read
          ? "border-green-200 bg-white hover:border-green-300"
          : "border-green-300 bg-green-50/50 hover:border-green-400 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 flex-shrink-0 ${
            notification.is_read ? "text-gray-400" : "text-green-600"
          }`}
        >
          {notification.is_read ? (
            <HiCheckCircle className="h-5 w-5" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-green-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${
                  notification.is_read ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {notification.title}
              </h3>
              <p
                className={`mt-1 text-sm line-clamp-2 ${
                  notification.is_read ? "text-gray-500" : "text-gray-700"
                }`}
              >
                {notification.content}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <HiClock className="h-3 w-3" />
              {formatDate(notification.created_at)}
            </span>
            <span className="rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-green-700 font-medium">
              {getTypeLabel(notification.type)}
            </span>
          </div>
        </div>
      </div>

      {!notification.is_read && (
        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-green-600" />
      )}
    </div>
  );

  if (notification.url && notification.action === "open_url") {
    return (
      <Link
        href={notification.url}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 rounded-xl"
        onClick={() => {
          if (!notification.is_read && onMarkAsRead) {
            onMarkAsRead(notification.id);
          }
        }}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

