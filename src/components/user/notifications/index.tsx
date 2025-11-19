"use client";

import Pagination from "@/components/shared/pagination";
import api from "@/lib/utils/fetcher/client/axios";
import {
  NotificationsQueryParams,
  NotificationsResponse,
} from "@/types/user/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { HiBell, HiExclamationCircle } from "react-icons/hi";
import { NotificationCard } from "./notification-card";
import { NotificationsToolbar } from "./notifications-toolbar";

export default function Notifications() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  const queryClient = useQueryClient();

  const buildQueryParams = (): NotificationsQueryParams => {
    const params: NotificationsQueryParams = {
      page,
      limit,
      sort_by: sortBy,
      order_dir: orderDir,
    };

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    if (typeFilter) {
      params.type = typeFilter;
    }

    if (readFilter !== "") {
      params.is_read = readFilter === "true";
    }

    return params;
  };

  const queryParams = buildQueryParams();

  const { data, error, isLoading, isFetching } =
    useQuery<NotificationsResponse>({
      queryKey: ["notifications", queryParams],
      queryFn: async () => {
        const response = await api.get("/notifications/user", {
          params: queryParams,
        });
        return response.data;
      },
      staleTime: 2000,
      placeholderData: (previousData) => previousData,
    });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, typeFilter, readFilter, sortBy, orderDir]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const unreadCount = data?.unread || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
              <p className="text-sm text-gray-600 mt-2">
                Xem và quản lý tất cả thông báo của bạn
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                <HiBell className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  {unreadCount} chưa đọc
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Toolbar */}
        <div className="mb-6">
          <NotificationsToolbar
            searchQuery={searchInput}
            onSearchChange={setSearchInput}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            readFilter={readFilter}
            onReadFilterChange={setReadFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            orderDir={orderDir}
            onOrderDirChange={setOrderDir}
          />
        </div>

        {/* Content */}
        {isLoading && !data && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-gray-200 border border-gray-200"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-6">
            Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.
          </div>
        )}

        {data && (
          <div className="relative">
            {isFetching && data && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              </div>
            )}

            {data.items.length === 0 ? (
              <div className="rounded-xl border border-green-200 bg-white p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <HiExclamationCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không có thông báo nào
                </h3>
                <p className="text-gray-600">
                  Hiện tại bạn chưa có thông báo nào.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            )}

            {data.total > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={data.total}
                  pageSize={limit}
                  onPageChange={setPage}
                  onPageSizeChange={setLimit}
                  showPageSizeSelector={true}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
