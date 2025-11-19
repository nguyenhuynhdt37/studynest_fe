"use client";

import api from "@/lib/utils/fetcher/client/axios";
import type {
  AdminLecturerOption,
  AdminWithdrawResponse,
} from "@/types/admin/withdraw";
import { useState } from "react";
import useSWR from "swr";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(val);

const formatDateTime = (val?: string | null) => {
  if (!val) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: false,
    }).format(new Date(val));
  } catch {
    return "—";
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Đang chờ",
    approved: "Đã duyệt",
    rejected: "Đã từ chối",
    paid: "Đã thanh toán",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    paid: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return classes[status] || "bg-gray-100 text-gray-700 border-gray-200";
};

export default function AdminWithdraws() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [lecturerId, setLecturerId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("requested_at");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [lecturerSearch, setLecturerSearch] = useState("");

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("order_by", orderBy);
    params.set("order_dir", orderDir);
    if (status !== "all") params.set("status", status);
    if (lecturerId) params.set("lecturer_id", lecturerId);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  };

  const { data, error, isLoading } = useSWR<AdminWithdrawResponse>(
    `/admin/withdraw?${buildQuery()}`,
    async (url) => {
      const res = await api.get(url);
      return res.data;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const { data: lecturerOptions } = useSWR<AdminLecturerOption[]>(
    lecturerSearch.trim()
      ? `/admin/withdraw/withdraw/lecturers/search?q=${encodeURIComponent(
          lecturerSearch.trim()
        )}`
      : null,
    async (url) => {
      const res = await api.get(url);
      return res.data;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.total / limit)) : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý yêu cầu rút tiền
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý và xử lý các yêu cầu rút tiền từ giảng viên
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            Không thể tải danh sách yêu cầu. Vui lòng thử lại
          </div>
        )}

        <div className="bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm kiếm theo tên/email..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 min-w-[200px]"
              />

              <div className="relative">
                <input
                  type="text"
                  value={lecturerSearch}
                  onChange={(e) => {
                    setLecturerSearch(e.target.value);
                    if (!e.target.value) setLecturerId("");
                  }}
                  placeholder="Tìm giảng viên..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                />
                {lecturerOptions && lecturerOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {lecturerOptions.map((lecturer) => (
                      <button
                        key={lecturer.id}
                        onClick={() => {
                          setLecturerId(lecturer.id);
                          setLecturerSearch(lecturer.fullname);
                          setPage(1);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {lecturer.fullname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lecturer.email}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã từ chối</option>
                <option value="paid">Đã thanh toán</option>
              </select>

              <select
                value={orderBy}
                onChange={(e) => {
                  setOrderBy(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="requested_at">Sắp xếp theo thời gian</option>
                <option value="amount">Sắp xếp theo số tiền</option>
                <option value="status">Sắp xếp theo trạng thái</option>
              </select>

              <button
                onClick={() => setOrderDir(orderDir === "asc" ? "desc" : "asc")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                {orderDir === "asc" ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 19V5m0 0-5 5m5-5 5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Tăng dần
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14m0 0-5-5m5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Giảm dần
                  </>
                )}
              </button>
            </div>

            {(lecturerId || search) && (
              <div className="flex items-center gap-2 flex-wrap">
                {lecturerId && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    Giảng viên: {lecturerSearch || "Đã chọn"}
                    <button
                      onClick={() => {
                        setLecturerId("");
                        setLecturerSearch("");
                        setPage(1);
                      }}
                      className="ml-2 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {search && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    Tìm kiếm: {search}
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="ml-2 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2">Đang tải...</p>
            </div>
          ) : data && data.items.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>Chưa có yêu cầu rút tiền nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Giảng viên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Thời gian yêu cầu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {data?.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.avatar && (
                              <img
                                src={item.avatar}
                                alt={item.fullname}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {item.fullname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(item.amount)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(item.requested_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Hiển thị {(page - 1) * limit + 1}-
                      {Math.min(page * limit, data?.total || 0)} trên tổng số{" "}
                      {data?.total || 0} yêu cầu
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Mỗi trang</span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setPage(1);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      «
                    </button>
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            pageNum === page
                              ? "bg-green-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ›
                    </button>
                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
