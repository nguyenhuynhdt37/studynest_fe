"use client";

import api from "@/lib/utils/fetcher/client/axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";

import { CourseSkeletonGrid } from "../my-learning/course-skeleton-grid";
import {
  CourseEmptyState,
  CourseErrorState,
  type EmptyStateContent,
} from "../my-learning/empty-states";
import { PaginationControls } from "../my-learning/pagination-controls";
import type {
  FavouriteCoursesResponse,
  FavouriteCourseItem,
  FavouriteLevel,
  FavouriteSortField,
  FavouriteSortOption,
} from "@/types/user/favourites";
import { FavoriteCard } from "./favorite-card";
import { FavoritesToolbar } from "./favorites-toolbar";

const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

const SORT_OPTIONS: FavouriteSortOption[] = [
  { value: "created_at", label: "Thời gian thêm" },
  { value: "title", label: "Tên khóa học" },
  { value: "rating_avg", label: "Đánh giá" },
  { value: "views", label: "Lượt xem" },
];

const LEVEL_OPTIONS: { value: "" | FavouriteLevel; label: string }[] = [
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

const fetchFavourites = async (url: string) => {
  const response = await api.get<FavouriteCoursesResponse>(url);
  return response.data;
};

const fetchCategories = async () => {
  const response = await api.get<{ id: string; name: string }[]>("categories/all");
  return response.data;
};

const useDebouncedValue = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value.trim());
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const parseErrorMessage = (error: unknown) => {
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
};

type FavouritesQuery = {
  page: number;
  size: number;
  sortBy: FavouriteSortField;
  sortOrder: "asc" | "desc";
  keyword: string;
  categoryId: string;
  level: "" | FavouriteLevel;
  language: string;
};

const useFavouriteCourses = (query: FavouritesQuery) => {
  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("size", String(query.size));
    params.set("sort_by", query.sortBy);
    params.set("order", query.sortOrder);
    if (query.keyword) params.set("keyword", query.keyword);
    if (query.categoryId) params.set("category_id", query.categoryId);
    if (query.level) params.set("level", query.level);
    if (query.language) params.set("language", query.language);
    return `favourites?${params.toString()}`;
  }, [query]);

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<FavouriteCoursesResponse>(swrKey, fetchFavourites, {
      keepPreviousData: true,
      revalidateOnFocus: false,
    });

  const favourites = data?.favourites ?? [];
  const total = data?.total ?? 0;

  const totalPages = useMemo(() => {
    if (!total || !query.size) return 1;
    return Math.max(1, Math.ceil(total / query.size));
  }, [total, query.size]);

  const visibleRangeLabel = useMemo(() => {
    if (!total) return "Không có dữ liệu";
    const start = (query.page - 1) * query.size + 1;
    const end = Math.min(total, query.page * query.size);
    return `Hiển thị ${start}-${end} / ${total}`;
  }, [query.page, query.size, total]);

  const isInitialLoading = isLoading && !data;
  const isBusy = isLoading || isValidating;
  const errorMessage = useMemo(() => parseErrorMessage(error), [error]);

  return {
    favourites,
    total,
    totalPages,
    visibleRangeLabel,
    isInitialLoading,
    isBusy,
    error,
    errorMessage,
    mutate,
  };
};

type FavoritesContentProps = {
  isInitialLoading: boolean;
  error: unknown;
  errorMessage: string | null;
  favourites: FavouriteCourseItem[];
  size: number;
  empty: EmptyStateContent;
  onRetry: () => void;
};

const FavoritesContent = ({
  isInitialLoading,
  error,
  errorMessage,
  favourites,
  size,
  empty,
  onRetry,
}: FavoritesContentProps) => {
  if (isInitialLoading) {
    return <CourseSkeletonGrid count={Math.min(size, 6)} />;
  }

  if (error) {
    return (
      <CourseErrorState
        message={errorMessage || "Đã xảy ra lỗi khi tải danh sách yêu thích."}
        onRetry={onRetry}
      />
    );
  }

  if (favourites.length === 0) {
    return <CourseEmptyState content={empty} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {favourites.map((course) => (
        <FavoriteCard key={course.id} course={course} />
      ))}
    </div>
  );
};

type FavoritesPanelProps = {
  heading: string;
  description: string;
  empty: EmptyStateContent;
};

export const FavoritesPanel = ({
  heading,
  description,
  empty,
}: FavoritesPanelProps) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [sortBy, setSortBy] = useState<FavouriteSortField>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [levelFilter, setLevelFilter] = useState<"" | FavouriteLevel>("");
  const [languageFilter, setLanguageFilter] = useState("");

  const { data: categoriesData, isLoading: isLoadingCategories } = useSWR<
    { id: string; name: string }[]
  >("categories/all", fetchCategories, {
    revalidateOnFocus: false,
  });

  const categoryOptions = useMemo(
    () =>
      categoriesData?.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? [],
    [categoriesData]
  );

  const debouncedKeyword = useDebouncedValue(keyword);
  const filterSignature = useMemo(
    () =>
      [
        debouncedKeyword,
        sortBy,
        sortOrder,
        size,
        categoryId,
        levelFilter,
        languageFilter,
      ].join("|"),
    [
      debouncedKeyword,
      sortBy,
      sortOrder,
      size,
      categoryId,
      levelFilter,
      languageFilter,
    ]
  );

  useEffect(() => {
    setPage(1);
  }, [filterSignature]);

  const query = useMemo<FavouritesQuery>(
    () => ({
      page,
      size,
      sortBy,
      sortOrder,
      keyword: debouncedKeyword,
      categoryId,
      level: levelFilter,
      language: languageFilter,
    }),
    [
      page,
      size,
      sortBy,
      sortOrder,
      debouncedKeyword,
      categoryId,
      levelFilter,
      languageFilter,
    ]
  );

  const {
    favourites,
    total,
    totalPages,
    visibleRangeLabel,
    isInitialLoading,
    isBusy,
    error,
    errorMessage,
    mutate,
  } = useFavouriteCourses(query);

  useEffect(() => {
    if (page <= totalPages) return;
    setPage(totalPages);
  }, [page, totalPages]);

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
    setKeyword("");
  }, []);

  return (
    <section className="space-y-6 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
        <p className="text-sm text-slate-500">{description}</p>
        {total > 0 ? (
          <span className="text-xs font-semibold uppercase text-teal-600">
            {total} khóa học yêu thích
          </span>
        ) : null}
      </header>

      <FavoritesToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        size={size}
        onSizeChange={setSize}
        isBusy={isBusy}
        sortOptions={SORT_OPTIONS}
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

      <div className="min-h-[240px]">
        <FavoritesContent
          isInitialLoading={isInitialLoading}
          error={error}
          errorMessage={errorMessage}
          favourites={favourites}
          size={size}
          empty={empty}
          onRetry={handleRetry}
        />
      </div>

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


