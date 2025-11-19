// Course related interfaces
export interface Course {
  id: string;
  slug?: string;
  title: string;
  instructor?: string;
  rating?: number;
  students?: number;
  price: number | null | undefined;
  originalPrice?: number | undefined;
  image?: string;
  badge?: string | undefined;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface CourseCardProps {
  course: Course;
  section: "featured" | "trending" | "top" | "newest";
  showPreview?: boolean;
}

export interface CoursesCarouselProps {
  title: string;
  items: Course[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  hasMore: boolean;
  totalPages: number;
  isLoadingFeeds: boolean;
  isFetchingMore: boolean;
  itemsPerPage: number;
  section: "featured" | "trending" | "top" | "newest";
}

export interface FeedData {
  title: string;
  items: any[];
  next_cursor: string | null;
}

export interface FeedsResponse {
  personalization: FeedData;
  views: FeedData;
  best_sellers: FeedData;
  rating: FeedData;
  created_at: FeedData;
}

export interface DynamicFeedsProps {
  feedsData: FeedsResponse;
  isLoadingFeeds: boolean;
  itemsPerPage: number;
  onLoadMore: (feedType: string, cursor: string) => void;
  isFetchingMore: Record<string, boolean>;
}
