"use client";

import type {
  CoursesMeSortField,
  CoursesMeSortOption,
} from "@/types/user/courses-me";
import { ChangeEvent, ReactNode } from "react";
import {
  HiOutlineAdjustments,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSwitchVertical,
} from "react-icons/hi";

type SelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
}: FilterSelectProps) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
    <span>
      {icon}
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-green-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

type CoursesToolbarProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  sortBy: CoursesMeSortField;
  onSortByChange: (value: CoursesMeSortField) => void;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  size: number;
  onSizeChange: (value: number) => void;
  isBusy: boolean;
  sortOptions: CoursesMeSortOption[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onClearFilters: () => void;
  categoryOptions: SelectOption[];
  isLoadingCategories: boolean;
  pageSizeOptions: readonly number[];
  levelOptions: { value: string; label: string }[];
  languageOptions: { value: string; label: string }[];
};

export const CoursesToolbar = ({
  keyword,
  onKeywordChange,
  sortBy,
  onSortByChange,
  sortOrder,
  toggleSortOrder,
  size,
  onSizeChange,
  isBusy,
  sortOptions,
  categoryId,
  onCategoryChange,
  level,
  onLevelChange,
  language,
  onLanguageChange,
  onClearFilters,
  categoryOptions,
  isLoadingCategories,
  pageSizeOptions,
  levelOptions,
  languageOptions,
}: CoursesToolbarProps) => {
  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onKeywordChange(event.target.value);
  };

  const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSizeChange(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50/50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Tìm kiếm khóa học</span>
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
          <input
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Tìm kiếm theo tên khóa học..."
            className="w-full rounded-lg border-2 border-green-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm">
            <span>Kích thước</span>
            <select
              value={size}
              onChange={handleSizeChange}
              className="rounded-lg border border-green-200 bg-white px-2 py-1 text-sm font-semibold text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}/trang
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-600 shadow-sm transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <HiOutlineRefresh className="h-4 w-4" />
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1 text-sm font-medium text-gray-600">
          <span>Sắp xếp theo</span>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(event) =>
                onSortByChange(event.target.value as CoursesMeSortField)
              }
              className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-green-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleSortOrder}
              disabled={isBusy}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-white text-green-600 shadow-sm transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
              aria-label="Đổi chiều sắp xếp"
            >
              <HiOutlineSwitchVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <FilterSelect
          label="Danh mục"
          value={categoryId}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder={isLoadingCategories ? "Đang tải..." : "Tất cả danh mục"}
          icon={
            <HiOutlineAdjustments className="mr-1 inline h-4 w-4 text-green-600" />
          }
        />

        <FilterSelect
          label="Cấp độ"
          value={level}
          onChange={onLevelChange}
          options={levelOptions}
        />

        <FilterSelect
          label="Ngôn ngữ"
          value={language}
          onChange={onLanguageChange}
          options={languageOptions}
        />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-green-600">
        Thứ tự: {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
      </p>
    </div>
  );
};
