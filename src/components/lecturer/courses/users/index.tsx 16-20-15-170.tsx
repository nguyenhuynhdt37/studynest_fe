"use client";

import Pagination from "@/components/shared/pagination";
import DataTable, { Column } from "@/components/shared/data-table";
import api from "@/lib/utils/fetcher/client/axios";
import {
  CourseStudentsQueryParams,
  CourseStudentsResponse,
  CourseStudentItem,
  CourseStudentStatus,
} from "@/types/lecturer/course-students";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { UsersFilters } from "./users-filters";
import { UsersSkeleton } from "./users-skeleton";
import { UsersEmpty } from "./users-empty";
import { UsersTable } from "./users-table";

const DEFAULT_LIMIT = 20;

export default function CourseUsersPage({ courseId }: { courseId: string }) {
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minProgress, setMinProgress] = useState<number | undefined>(undefined);
  const [maxProgress, setMaxProgress] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<CourseStudentStatus | "">("");
  const [sortBy, setSortBy] = useState<"progress" | "price" | "enrolled_at" | "last_activity">("enrolled_at");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [minProgress, maxProgress, status, sortBy, orderDir]);

  const buildQueryParams = useCallback((): CourseStudentsQueryParams => {
    const params: CourseStudentsQueryParams = {
      page: pagination.page,
      limit: pagination.limit,
      sort_by: sortBy,
      order_dir: orderDir,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (typeof minProgress === "number") params.min_progress = minProgress;
    if (typeof maxProgress === "number") params.max_progress = maxProgress;
    if (status) params.status = status as CourseStudentStatus;
    return params;
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    minProgress,
    maxProgress,
    status,
    sortBy,
    orderDir,
  ]);

  const { data, isLoading } = useSWR<CourseStudentsResponse>(
    [`/lecturer/courses/${courseId}/students`, buildQueryParams()],
    async ([url, params]: [string, CourseStudentsQueryParams]) => {
      const res = await api.get(url, { params });
      return res.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
      dedupingInterval: 1000,
    }
  );

  const totalPages = useMemo(() => {
    if (!data) return 0;
    return Math.ceil((data.total || 0) / pagination.limit);
  }, [data, pagination.limit]);

  const handlePageChange = (page: number) => setPagination((p) => ({ ...p, page }));
  const handleLimitChange = (limit: number) => setPagination({ page: 1, limit });

  const handleSort = (column: string) => {
    const col = column as "progress" | "price" | "enrolled_at" | "last_activity";
    if (sortBy === col) {
      setOrderDir(orderDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setOrderDir("asc");
    }
  };

  const tableData: CourseStudentItem[] = (data?.students || []).map((s) => s);
  const isInitialLoading = isLoading && !data;
  const isEmpty = !isInitialLoading && tableData.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Học viên đăng ký</h1>
          {data?.title && (
            <p className="text-gray-600 mt-1">
              Khóa học: <span className="font-semibold text-emerald-700">{data.title}</span>
            </p>
          )}
        </div>

        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          minProgress={minProgress}
          onMinProgressChange={setMinProgress}
          maxProgress={maxProgress}
          onMaxProgressChange={setMaxProgress}
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortByChange={(v) => setSortBy(v)}
          orderDir={orderDir}
          onOrderDirChange={setOrderDir}
          onReset={() => {
            setSearch("");
            setDebouncedSearch("");
            setMinProgress(undefined);
            setMaxProgress(undefined);
            setStatus("");
            setSortBy("enrolled_at");
            setOrderDir("desc");
            setPagination({ page: 1, limit: DEFAULT_LIMIT });
          }}
          total={data?.total || 0}
        />

        {isInitialLoading ? (
          <UsersSkeleton />
        ) : isEmpty ? (
          <UsersEmpty />
        ) : (
          <>
            <UsersTable
              data={tableData}
              sortBy={sortBy}
              orderDir={orderDir}
              onSort={handleSort}
              loading={isLoading}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={data?.total || 0}
              pageSize={pagination.limit}
              onPageChange={handlePageChange}
              onPageSizeChange={handleLimitChange}
              showPageSizeSelector={true}
              pageSizeOptions={[10, 20, 50]}
              className="bg-white rounded-b-2xl border border-t-0 border-gray-200"
            />
          </>
        )}
      </div>
    </div>
  );
}


