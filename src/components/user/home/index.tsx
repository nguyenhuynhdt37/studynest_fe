"use client";

import api from "@/lib/utils/fetcher/client/axios";
import { getGoogleDriveImageUrl } from "@/lib/utils/helpers/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiBadgeCheck,
  HiBookOpen,
  HiCamera,
  HiChartBar,
  HiCode,
  HiCurrencyDollar,
  HiEmojiHappy,
  HiGift,
  HiGlobe,
  HiHeart,
  HiLightningBolt,
  HiMusicNote,
  HiPlay,
  HiSparkles,
  HiStar,
  HiUsers,
} from "react-icons/hi";
import useSWRInfinite from "swr/infinite";
import DynamicFeeds from "./DynamicFeeds";

const Home = () => {
  // responsive items per page based on Tailwind breakpoints
  const [itemsPerPage, setItemsPerPage] = useState(4);
  // scroll performance optimization
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // intersection observer for lazy loading
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  // ref for courses section
  const coursesSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const computeItems = () => {
      if (typeof window === "undefined") return 4;
      const width = window.innerWidth;
      if (width >= 1280) return 4; // xl
      if (width >= 1024) return 3; // lg
      if (width >= 640) return 2; // sm
      return 1; // xs
    };
    const update = () => setItemsPerPage(computeItems());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll performance optimization
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to stop scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const fetcher = async ([url, params]: [string, any]) => {
    const res = await api.get(url, { params });
    // Chuẩn hóa cấu trúc trả về: ưu tiên data.data nếu tồn tại
    return res.data?.data ?? res.data;
  };

  // State để lưu trữ feeds đã merge và loading state cho từng feed
  const [mergedFeeds, setMergedFeeds] = useState<any | null>(null);
  const [loadingMoreByFeed, setLoadingMoreByFeed] = useState<
    Record<string, boolean>
  >({});

  // Fetch lần đầu với feed_type=all
  const {
    data: initialFeedsData,
    error: feedsError,
    isLoading: isLoadingFeeds,
  } = useSWRInfinite(
    (index: number) => {
      if (index > 0) return null; // Chỉ fetch lần đầu
      return ["/courses/feeds", { feed_type: "all", limit: itemsPerPage }];
    },
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const categories = useMemo(
    () => [
      {
        id: "development",
        name: "Phát triển",
        icon: HiCode,
        color: "bg-blue-500",
      },
      {
        id: "business",
        name: "Kinh doanh",
        icon: HiChartBar,
        color: "bg-green-500",
      },
      {
        id: "design",
        name: "Thiết kế",
        icon: HiCamera,
        color: "bg-purple-500",
      },
      {
        id: "marketing",
        name: "Marketing",
        icon: HiLightningBolt,
        color: "bg-yellow-500",
      },
      { id: "music", name: "Âm nhạc", icon: HiMusicNote, color: "bg-pink-500" },
      {
        id: "photography",
        name: "Nhiếp ảnh",
        icon: HiCamera,
        color: "bg-indigo-500",
      },
      { id: "health", name: "Sức khỏe", icon: HiHeart, color: "bg-red-500" },
      {
        id: "finance",
        name: "Tài chính",
        icon: HiCurrencyDollar,
        color: "bg-emerald-500",
      },
    ],
    []
  );

  // Process feeds data từ API lần đầu
  const initialFeeds = useMemo(() => {
    return (
      initialFeedsData?.[0] || {
        personalization: {
          title: "Khóa học dành riêng cho bạn",
          items: [],
          next_cursor: null,
        },
        trending: { title: "Khóa học xu hướng", items: [], next_cursor: null },
        views: {
          title: "Các khóa học thịnh hành",
          items: [],
          next_cursor: null,
        },
        best_sellers: {
          title: "Khóa học bán chạy",
          items: [],
          next_cursor: null,
        },
        rating: {
          title: "Khóa học được đánh giá cao",
          items: [],
          next_cursor: null,
        },
        created_at: {
          title: "Khóa học mới ra mắt",
          items: [],
          next_cursor: null,
        },
      }
    );
  }, [initialFeedsData]);

  // Sync mergedFeeds khi có dữ liệu lần đầu
  useEffect(() => {
    if (initialFeeds && Object.keys(initialFeeds).length > 0) {
      setMergedFeeds(initialFeeds);
    }
  }, [initialFeeds]);

  // Function để load more cho từng feed
  const loadMoreFeed = useCallback(
    async (feedType: string, cursor: string) => {
      if (!cursor) return;

      setLoadingMoreByFeed((prev) => ({ ...prev, [feedType]: true }));

      try {
        const res = await api.get("/courses/feeds", {
          params: { feed_type: feedType, cursor, limit: itemsPerPage },
        });

        const data = res.data || {};
        const newFeedData = data[feedType] || {
          items: [],
          next_cursor: null,
          title: "",
        };

        setMergedFeeds((prev: any) => {
          const current = prev?.[feedType] || {
            title: newFeedData.title,
            items: [],
            next_cursor: null,
          };

          return {
            ...(prev || {}),
            [feedType]: {
              title: current.title || newFeedData.title,
              items: [...(current.items || []), ...(newFeedData.items || [])],
              next_cursor: newFeedData.next_cursor ?? null,
            },
          };
        });
      } finally {
        setLoadingMoreByFeed((prev) => ({ ...prev, [feedType]: false }));
      }
    },
    [itemsPerPage]
  );

  const feedsErrorMsg =
    feedsError && ((feedsError as any).message || "Không thể tải dữ liệu");

  const instructors = useMemo(
    () => [
      {
        id: 1,
        name: "Nguyễn Văn A",
        title: "Senior Full-Stack Developer tại Google",
        students: 125000,
        courses: 15,
        rating: 4.9,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        specialties: ["JavaScript", "React", "Node.js"],
        verified: true,
      },
      {
        id: 2,
        name: "Trần Thị B",
        title: "Lead UI/UX Designer tại Facebook",
        students: 89000,
        courses: 12,
        rating: 4.8,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        specialties: ["Figma", "Adobe XD", "Sketch"],
        verified: true,
      },
      {
        id: 3,
        name: "Lê Văn C",
        title: "Data Scientist tại Microsoft",
        students: 156000,
        courses: 18,
        rating: 4.9,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        specialties: ["Python", "Machine Learning", "TensorFlow"],
        verified: true,
      },
      {
        id: 4,
        name: "Phạm Thị D",
        title: "Digital Marketing Expert tại Amazon",
        students: 112000,
        courses: 14,
        rating: 4.7,
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        specialties: ["Google Ads", "Facebook Ads", "SEO"],
        verified: true,
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        id: 1,
        name: "Nguyễn Minh T",
        role: "Frontend Developer",
        company: "TechCorp",
        content:
          "Khóa học JavaScript của StudyNest đã giúp tôi từ một người mới bắt đầu trở thành developer chuyên nghiệp. Giảng viên rất tận tâm và nội dung chất lượng cao.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: 2,
        name: "Trần Thị H",
        role: "UI Designer",
        company: "DesignStudio",
        content:
          "Tôi đã học được rất nhiều từ khóa UI/UX Design. Phương pháp giảng dạy rất thực tế và dễ hiểu. Giờ đây tôi có thể tự tin làm việc trong lĩnh vực thiết kế.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: 3,
        name: "Lê Văn K",
        role: "Data Analyst",
        company: "DataCorp",
        content:
          "Khóa Python cho Data Science rất tuyệt vời! Tôi đã áp dụng ngay những kiến thức học được vào công việc và được sếp đánh giá cao.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { number: "500K+", label: "Học viên", icon: HiUsers },
      { number: "10K+", label: "Khóa học", icon: HiBookOpen },
      { number: "50+", label: "Quốc gia", icon: HiGlobe },
      { number: "98%", label: "Hài lòng", icon: HiEmojiHappy },
    ],
    []
  );

  // Function to scroll to courses section
  const scrollToCourses = useCallback(() => {
    coursesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimalist & Clean Design */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-[90vh]">
          <div className="w-full">
            {/* Content */}
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-sm border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-semibold text-green-700">
                  500.000+ học viên đang tin tưởng
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-gray-900">Học tập không giới hạn</span>
                  <br />
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Phát triển không ngừng
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia
                  hàng đầu. Bắt đầu hành trình học tập của bạn ngay hôm nay.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <button
                  onClick={scrollToCourses}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center cursor-pointer"
                >
                  <HiPlay className="mr-2 h-5 w-5" />
                  Khám phá ngay
                </button>

                <button
                  onClick={scrollToCourses}
                  className="group border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center cursor-pointer"
                >
                  <HiSparkles className="mr-2 h-5 w-5" />
                  Dùng thử miễn phí
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    500K+
                  </div>
                  <div className="text-sm font-medium text-gray-600 mt-1">
                    Học viên
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-sm font-medium text-gray-600 mt-1">
                    Khóa học
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm font-medium text-gray-600 mt-1">
                    Hài lòng
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HiBookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Học mọi lúc, mọi nơi
                </h3>
                <p className="text-sm text-gray-600">
                  Truy cập khóa học trên mọi thiết bị, học tập linh hoạt theo
                  lịch trình của bạn
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HiUsers className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Giảng viên chuyên nghiệp
                </h3>
                <p className="text-sm text-gray-600">
                  Học từ các chuyên gia hàng đầu với kinh nghiệm thực tế phong
                  phú
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HiBadgeCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chứng chỉ uy tín
                </h3>
                <p className="text-sm text-gray-600">
                  Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Feeds Section */}
      <div ref={coursesSectionRef}>
        <DynamicFeeds
          feedsData={mergedFeeds || initialFeeds}
          isLoadingFeeds={isLoadingFeeds}
          itemsPerPage={itemsPerPage}
          onLoadMore={loadMoreFeed}
          isFetchingMore={{
            personalization: !!loadingMoreByFeed["personalization"],
            views: !!loadingMoreByFeed["views"],
            best_sellers: !!loadingMoreByFeed["best_sellers"],
            rating: !!loadingMoreByFeed["rating"],
            created_at: !!loadingMoreByFeed["created_at"],
          }}
        />
      </div>

      {/* Categories Section - StudyNest Style */}
      <section
        id="categories"
        data-section="categories"
        className={`py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 performance-optimized scroll-stable relative overflow-hidden ${
          isScrolling ? "scroll-optimized" : ""
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
              Khám phá theo danh mục
            </h2>
            <p className="text-emerald-600 font-medium">
              Tìm khóa học phù hợp với sở thích và mục tiêu của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className={`group bg-white rounded-xl p-5 text-center hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 hover:-translate-y-1 ${
                    isScrolling ? "hover-optimized" : ""
                  }`}
                >
                  <div
                    className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - StudyNest Style */}
      <section
        id="stats"
        data-section="stats"
        className={`py-16 bg-white performance-optimized scroll-stable relative ${
          isScrolling ? "scroll-optimized" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
              StudyNest trong con số
            </h2>
            <p className="text-emerald-600 font-medium">
              Cộng đồng học tập lớn nhất Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl border-2 border-green-200">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructors Section - StudyNest Style */}
      <section
        id="instructors"
        data-section="instructors"
        className={`py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 performance-optimized scroll-stable relative overflow-hidden ${
          isScrolling ? "scroll-optimized" : ""
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
              Giảng viên hàng đầu
            </h2>
            <p className="text-emerald-600 font-medium flex items-center justify-center gap-2">
              <span className="text-green-500">👨‍🏫</span>
              Học từ những chuyên gia có kinh nghiệm thực tế
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                className={`group bg-white rounded-xl p-6 text-center hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-2 ${
                  isScrolling ? "hover-optimized" : ""
                }`}
              >
                <div className="relative mb-4 inline-block">
                  <div className="w-20 h-20 rounded-full ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-300 overflow-hidden">
                    <img
                      src={getGoogleDriveImageUrl(instructor.avatar)}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {instructor.verified && (
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <HiBadgeCheck className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  {instructor.name}
                </h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                  {instructor.title}
                </p>

                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center justify-center gap-1">
                    <HiUsers className="h-4 w-4 text-green-500" />
                    <span className="font-semibold" suppressHydrationWarning>
                      {instructor.students.toLocaleString("en-US")}
                    </span>{" "}
                    học viên
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <HiBookOpen className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold">
                      {instructor.courses}
                    </span>{" "}
                    khóa học
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {instructor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold border border-green-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer">
                  Xem khóa học
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - StudyNest Style */}
      <section
        id="testimonials"
        data-section="testimonials"
        className={`py-16 bg-white performance-optimized scroll-stable ${
          isScrolling ? "scroll-optimized" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
              Học viên nói gì về StudyNest
            </h2>
            <p className="text-emerald-600 font-medium flex items-center justify-center gap-2">
              <span className="text-green-500">💬</span>
              Những chia sẻ chân thực từ cộng đồng học viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-1 ${
                  isScrolling ? "hover-optimized" : ""
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiStar
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 text-sm leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full ring-2 ring-green-200 overflow-hidden mr-3">
                    <img
                      src={getGoogleDriveImageUrl(testimonial.avatar)}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium">
                      {testimonial.role} tại {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - StudyNest Style */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold">Bắt đầu ngay hôm nay</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
            Tham gia cùng hàng trăm nghìn học viên đang phát triển kỹ năng và
            thăng tiến trong sự nghiệp với StudyNest
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-white hover:bg-gray-50 text-green-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer">
              <HiGift className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Đăng ký miễn phí ngay
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 cursor-pointer">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
