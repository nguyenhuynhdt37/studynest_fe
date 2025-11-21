"use client";

import api from "@/lib/utils/fetcher/client/axios";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import CoursesCarousel from "./CoursesCarousel";

interface CourseItem {
  id: string;
  title: string;
  thumbnail: string;
  base_price: number;
  views: number;
  rating: number;
  enrolls: number;
  tags: string[];
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface FeedResponse {
  items: CourseItem[];
  next_cursor: string | null;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const transformCourse = (item: CourseItem) => ({
  id: item.id,
  slug: item.id,
  title: item.title,
  instructor: item.instructor?.name || "",
  instructorAvatar: item.instructor?.avatar || "",
  rating: item.rating || 0,
  students: item.enrolls || 0,
  price: item.base_price ?? null,
  image: item.thumbnail,
  tags: item.tags || [],
});

const CoursesSection = () => {
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1280) setItemsPerPage(4);
      else if (width >= 1024) setItemsPerPage(3);
      else if (width >= 640) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch initial data
  const { data: topRatedData, isLoading: isLoadingTopRated } =
    useSWR<FeedResponse>(
      `/courses/feed/top-rated?limit=${itemsPerPage}`,
      fetcher,
      { revalidateOnFocus: false }
    );

  const { data: newestData, isLoading: isLoadingNewest } = useSWR<FeedResponse>(
    `/courses/feed/newest?limit=${itemsPerPage}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: topViewData, isLoading: isLoadingTopView } =
    useSWR<FeedResponse>(
      `/courses/feed/top-view?limit=${itemsPerPage}`,
      fetcher,
      { revalidateOnFocus: false }
    );

  const [allNewestCourses, setAllNewestCourses] = useState<CourseItem[]>([]);
  const [allTopViewCourses, setAllTopViewCourses] = useState<CourseItem[]>([]);
  const [newestCursor, setNewestCursor] = useState<string | null>(null);
  const [topViewCursor, setTopViewCursor] = useState<string | null>(null);
  const [loadingMoreNewest, setLoadingMoreNewest] = useState(false);
  const [loadingMoreTopView, setLoadingMoreTopView] = useState(false);

  // Update state when data changes
  useEffect(() => {
    if (newestData?.items) {
      setAllNewestCourses(newestData.items);
      setNewestCursor(newestData.next_cursor);
    }
  }, [newestData]);

  useEffect(() => {
    if (topViewData?.items) {
      setAllTopViewCourses(topViewData.items);
      setTopViewCursor(topViewData.next_cursor);
    }
  }, [topViewData]);

  // Load more handlers
  const loadMoreNewest = useCallback(async () => {
    if (!newestCursor || loadingMoreNewest) return;
    setLoadingMoreNewest(true);
    try {
      const res = await api.get<FeedResponse>(
        `/courses/feed/newest?limit=${itemsPerPage}&cursor=${newestCursor}`
      );
      setAllNewestCourses((prev) => [...prev, ...res.data.items]);
      setNewestCursor(res.data.next_cursor);
    } catch (error) {
      console.error("Error loading more newest courses:", error);
    } finally {
      setLoadingMoreNewest(false);
    }
  }, [newestCursor, itemsPerPage, loadingMoreNewest]);

  const loadMoreTopView = useCallback(async () => {
    if (!topViewCursor || loadingMoreTopView) return;
    setLoadingMoreTopView(true);
    try {
      const res = await api.get<FeedResponse>(
        `/courses/feed/top-view?limit=${itemsPerPage}&cursor=${topViewCursor}`
      );
      setAllTopViewCourses((prev) => [...prev, ...res.data.items]);
      setTopViewCursor(res.data.next_cursor);
    } catch (error) {
      console.error("Error loading more top view courses:", error);
    } finally {
      setLoadingMoreTopView(false);
    }
  }, [topViewCursor, itemsPerPage, loadingMoreTopView]);

  // Carousel states
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [newestIndex, setNewestIndex] = useState(0);
  const [topViewIndex, setTopViewIndex] = useState(0);

  return (
    <div id="courses-section">
      <CoursesCarousel
        title="Khóa học được đánh giá cao"
        items={(topRatedData?.items || []).map(transformCourse)}
        index={topRatedIndex}
        onPrev={() => setTopRatedIndex((p) => Math.max(0, p - 1))}
        onNext={() => setTopRatedIndex((p) => p + 1)}
        hasMore={false}
        totalPages={Math.ceil(
          (topRatedData?.items?.length || 0) / itemsPerPage
        )}
        isLoadingFeeds={isLoadingTopRated}
        isFetchingMore={false}
        itemsPerPage={itemsPerPage}
        section="top"
      />

      <CoursesCarousel
        title="Khóa học thịnh hành"
        items={allTopViewCourses.map(transformCourse)}
        index={topViewIndex}
        onPrev={() => setTopViewIndex((p) => Math.max(0, p - 1))}
        onNext={() => {
          const maxPage = Math.ceil(allTopViewCourses.length / itemsPerPage);
          if (topViewIndex >= maxPage - 1 && topViewCursor) {
            loadMoreTopView();
          }
          setTopViewIndex((p) => p + 1);
        }}
        hasMore={!!topViewCursor}
        totalPages={Math.ceil(allTopViewCourses.length / itemsPerPage)}
        isLoadingFeeds={isLoadingTopView}
        isFetchingMore={loadingMoreTopView}
        itemsPerPage={itemsPerPage}
        section="trending"
      />

      <CoursesCarousel
        title="Khóa học mới ra mắt"
        items={allNewestCourses.map(transformCourse)}
        index={newestIndex}
        onPrev={() => setNewestIndex((p) => Math.max(0, p - 1))}
        onNext={() => {
          const maxPage = Math.ceil(allNewestCourses.length / itemsPerPage);
          if (newestIndex >= maxPage - 1 && newestCursor) {
            loadMoreNewest();
          }
          setNewestIndex((p) => p + 1);
        }}
        hasMore={!!newestCursor}
        totalPages={Math.ceil(allNewestCourses.length / itemsPerPage)}
        isLoadingFeeds={isLoadingNewest}
        isFetchingMore={loadingMoreNewest}
        itemsPerPage={itemsPerPage}
        section="newest"
      />
    </div>
  );
};

export default CoursesSection;
