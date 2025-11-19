"use client";

import { DynamicFeedsProps, FeedData } from "@/types/user/course";
import { useCallback, useMemo, useState } from "react";
import CoursesCarousel from "./CoursesCarousel";

// Feed configuration mapping
const FEED_CONFIG = {
  personalization: { section: "featured" as const },
  views: { section: "trending" as const },
  best_sellers: { section: "featured" as const },
  rating: { section: "top" as const },
  created_at: { section: "newest" as const },
} as const;

const DynamicFeeds = ({
  feedsData,
  isLoadingFeeds,
  itemsPerPage,
  onLoadMore,
  isFetchingMore,
}: DynamicFeedsProps) => {
  const [feedStates, setFeedStates] = useState<Record<string, number>>({});

  const handlePrev = useCallback((feedType: string) => {
    setFeedStates((prev) => ({
      ...prev,
      [feedType]: Math.max(0, (prev[feedType] || 0) - 1),
    }));
  }, []);

  const handleNext = useCallback(
    (feedType: string, feedData: FeedData) => {
      const currentIndex = feedStates[feedType] || 0;
      const basePages = Math.ceil((feedData.items?.length || 0) / itemsPerPage);
      const isFetching = isFetchingMore[feedType] || false;

      // Move to next tab and fetch if at last tab with cursor
      if (
        currentIndex >= basePages - 1 &&
        feedData.next_cursor &&
        !isFetching
      ) {
        setFeedStates((prev) => ({ ...prev, [feedType]: currentIndex + 1 }));
        onLoadMore(feedType, feedData.next_cursor);
      } else if (currentIndex < basePages - 1) {
        // Move to next tab in existing data
        setFeedStates((prev) => ({ ...prev, [feedType]: currentIndex + 1 }));
      }
    },
    [feedStates, itemsPerPage, isFetchingMore, onLoadMore]
  );

  // Transform course data for UI - memoized để tránh re-render
  const transformCourseData = useCallback(
    (item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      instructor: item.instructor_full_name,
      rating: item.rating ?? item.rating_avg ?? 0,
      students: item.total_enrolls ?? 0,
      price:
        typeof item?.base_price === "number"
          ? item.base_price
          : typeof item?.price === "number"
          ? item.price
          : item?.price === "Miễn phí"
          ? 0
          : null,
      originalPrice: undefined,
      image: item.thumbnail_url,
      duration: undefined,
      level: undefined,
      badge:
        Array.isArray(item.tags) && item.tags.includes("bán chạy nhất")
          ? "Bán chạy"
          : Array.isArray(item.tags) && item.tags.includes("thịnh hành")
          ? "Thịnh hành"
          : Array.isArray(item.tags) && item.tags.includes("mới ra mắt")
          ? "Mới"
          : undefined,
      isBestSeller:
        Array.isArray(item.tags) && item.tags.includes("bán chạy nhất"),
      tags: Array.isArray(item.tags) ? item.tags : [],
      language: undefined,
      lastUpdated: undefined,
    }),
    []
  );

  // Memoize feeds để tránh re-render không cần thiết
  const renderedFeeds = useMemo(() => {
    return Object.entries(feedsData).map(([feedType, feedData]) => {
      if (!feedData?.items) return null;

      const config = FEED_CONFIG[feedType as keyof typeof FEED_CONFIG];
      if (!config) return null;

      const currentIndex = feedStates[feedType] || 0;
      const basePages = Math.ceil((feedData.items?.length || 0) / itemsPerPage);
      const hasMore = !!feedData.next_cursor;
      const isFetching = isFetchingMore[feedType] || false;
      const totalPages = basePages + (isFetching ? 1 : 0);

      return (
        <CoursesCarousel
          key={feedType}
          title={feedData.title}
          items={feedData.items.map(transformCourseData)}
          index={currentIndex}
          onPrev={() => handlePrev(feedType)}
          onNext={() => handleNext(feedType, feedData)}
          hasMore={hasMore}
          totalPages={totalPages}
          isLoadingFeeds={isLoadingFeeds}
          isFetchingMore={isFetching}
          itemsPerPage={itemsPerPage}
          section={config.section}
        />
      );
    });
  }, [
    feedsData,
    feedStates,
    itemsPerPage,
    isFetchingMore,
    isLoadingFeeds,
    transformCourseData,
    handlePrev,
    handleNext,
  ]);

  return <>{renderedFeeds}</>;
};

export default DynamicFeeds;
