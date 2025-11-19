"use client";

import api from "@/lib/utils/fetcher/client/axios";
import type {
  CoursesMeCategory,
  CoursesMeResponse,
  CoursesMeSortField,
  CoursesMeSortOption,
  CoursesMeVariant,
} from "@/types/user/courses-me";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import useSWR from "swr";

import { CourseCard } from "./course-card";
import { CourseSkeletonGrid } from "./course-skeleton-grid";
import {
  CourseEmptyState,
  CourseErrorState,
  type EmptyStateContent,
} from "./empty-states";
import { PaginationControls } from "./pagination-controls";
import { CoursesToolbar } from "./toolbar";

const fetchCourses = async (url: string) => {
  const response = await api.get<CoursesMeResponse>(url);
  return response.data;
};

const fetchCategories = async () => {
  const response = await api.get<CoursesMeCategory[]>("categories/all");
  return response.data;
};

type CourseListPanelProps = {
  heading: string;
  description: string;
  basePath: string;
  variant: CoursesMeVariant;
  empty: EmptyStateContent;
  sortOptions: CoursesMeSortOption[];
};

type LevelKey = "beginner" | "intermediate" | "advanced";

type CategorySelectOption = {
  value: string;
  label: string;
};

const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

const LEVEL_OPTIONS: { value: "" | LevelKey; label: string }[] = [
  { value: "", label: "Tất cả cấp độ" },
  { value: "beginner", label: "Cơ bản" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
];

const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả ngôn ngữ" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export const CourseListPanel = ({
  heading,
  description,
  basePath,
  variant,
  empty,
  sortOptions,
}: CourseListPanelProps) => {
  const defaultSort = useMemo<CoursesMeSortField>(() => {
    return sortOptions[0]?.value ?? "enrolled_at";
  }, [sortOptions]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [sortBy, setSortBy] = useState<CoursesMeSortField>(defaultSort);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [levelFilter, setLevelFilter] = useState<"" | LevelKey>("");
  const [languageFilter, setLanguageFilter] = useState("");

  const { data: categoriesData, isLoading: isLoadingCategories } = useSWR<
    CoursesMeCategory[]
  >("categories/all", fetchCategories, {
    revalidateOnFocus: false,
  });

  const categoryOptions = useMemo<CategorySelectOption[]>(() => {
    if (!categoriesData || categoriesData.length === 0) {
      return [];
    }
    return categoriesData.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categoriesData]);

  useEffect(() => {
    setSortBy(defaultSort);
  }, [defaultSort]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedKeyword,
    sortBy,
    sortOrder,
    size,
    categoryId,
    levelFilter,
    languageFilter,
  ]);

  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    params.set("sort_by", sortBy);
    params.set("order", sortOrder);
    if (debouncedKeyword) {
      params.set("keyword", debouncedKeyword);
    }
    if (categoryId) {
      params.set("category_id", categoryId);
    }
    if (levelFilter) {
      params.set("level", levelFilter);
    }
    if (languageFilter) {
      params.set("language", languageFilter);
    }
    return `${basePath}?${params.toString()}`;
  }, [
    basePath,
    page,
    size,
    sortBy,
    sortOrder,
    debouncedKeyword,
    categoryId,
    levelFilter,
    languageFilter,
  ]);

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<CoursesMeResponse>(swrKey, fetchCourses, {
      keepPreviousData: true,
      revalidateOnFocus: false,
    });

  const courses = data?.courses ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    if (!total) return;
    const computedTotalPages = Math.max(1, Math.ceil(total / size));
    if (page > computedTotalPages) {
      setPage(computedTotalPages);
    }
  }, [total, size, page]);

  const isInitialLoading = isLoading && !data;
  const isBusy = isLoading || isValidating;

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    const maybeResponse = (
      error as {
        response?: { data?: { message?: string } };
      }
    ).response?.data?.message;
    if (typeof maybeResponse === "string") return maybeResponse;
    return null;
  }, [error]);

  const totalPages = useMemo(() => {
    if (!total || !size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }, [total, size]);

  const visibleRangeLabel = useMemo(() => {
    if (!total) return "Không có dữ liệu";
    const start = (page - 1) * size + 1;
    const end = Math.min(total, page * size);
    return `Hiển thị ${start}-${end} / ${total}`;
  }, [page, size, total]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const handleRetry = useCallback(() => {
    void mutate(undefined, { revalidate: true });
  }, [mutate]);

  const goPrev = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleClearFilters = useCallback(() => {
    setCategoryId("");
    setLevelFilter("");
    setLanguageFilter("");
  }, []);

  let mainContent: ReactNode;
  if (isInitialLoading) {
    mainContent = <CourseSkeletonGrid count={Math.min(size, 6)} />;
  } else if (error) {
    mainContent = (
      <CourseErrorState
        message={errorMessage || "Đã xảy ra lỗi khi tải danh sách khóa học."}
        onRetry={handleRetry}
      />
    );
  } else if (courses.length === 0) {
    mainContent = <CourseEmptyState content={empty} />;
  } else {
    mainContent = (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} variant={variant} />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        {total > 0 ? (
          <span className="text-xs font-semibold uppercase text-green-600">
            {total} khóa học
          </span>
        ) : null}
      </header>

      <CoursesToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        size={size}
        onSizeChange={setSize}
        isBusy={isBusy}
        sortOptions={sortOptions}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        level={levelFilter}
        onLevelChange={setLevelFilter}
        language={languageFilter}
        onLanguageChange={setLanguageFilter}
        onClearFilters={handleClearFilters}
        categoryOptions={categoryOptions}
        isLoadingCategories={isLoadingCategories}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        levelOptions={LEVEL_OPTIONS}
        languageOptions={LANGUAGE_OPTIONS}
      />

      <div className="min-h-[240px]">{mainContent}</div>

      {totalPages > 1 ? (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          visibleRangeLabel={visibleRangeLabel}
          onPrev={goPrev}
          onNext={goNext}
          isBusy={isBusy}
        />
      ) : null}
    </section>
  );
};
