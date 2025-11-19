"use client";

import Pagination from "@/components/shared/pagination";
import api from "@/lib/utils/fetcher/client/axios";
import { getGoogleDriveImageUrl } from "@/lib/utils/helpers/image";
import { showToast } from "@/lib/utils/helpers/toast";
import {
  LecturerCoursesResponse,
  LecturerDetailResponse,
} from "@/types/admin/lecturer-detail";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  HiAcademicCap,
  HiArrowLeft,
  HiBan,
  HiCheckCircle,
  HiClock,
  HiCurrencyDollar,
  HiEye,
  HiStar,
  HiTrash,
  HiUser,
  HiUserRemove,
  HiUsers,
  HiX,
  HiXCircle,
} from "react-icons/hi";
import useSWR from "swr";

const DetailLecturer = ({ lecturerId }: { lecturerId: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banType, setBanType] = useState<"permanent" | "temporary">(
    "temporary"
  );
  const [banReason, setBanReason] = useState("");
  const [banUntilDate, setBanUntilDate] = useState("");
  const [banUntilTime, setBanUntilTime] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showCourseDetailModal, setShowCourseDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Pagination state for courses
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesSize, setCoursesSize] = useState(4);
  const [coursesSortBy, setCoursesSortBy] = useState("created_at");
  const [coursesOrder, setCoursesOrder] = useState<"asc" | "desc">("desc");

  // Pagination state for transactions
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsSize, setTransactionsSize] = useState(5);

  // Fetch lecturer detail data
  const { data, error, isLoading, mutate } = useSWR<LecturerDetailResponse>(
    `/admin/lecturers/${lecturerId}?page=${transactionsPage}&size=${transactionsSize}`,
    async (url) => {
      console.log("🔍 SWR Fetching lecturer detail:", url);
      const response = await api.get(url);
      console.log("📊 SWR Response:", response.data);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateIfStale: false,
      refreshInterval: 0,
      suspense: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  // Fetch lecturer courses with pagination
  const {
    data: coursesData,
    error: coursesError,
    isLoading: isLoadingCourses,
  } = useSWR<LecturerCoursesResponse>(
    `/admin/lecturers/${lecturerId}/courses?page=${coursesPage}&size=${coursesSize}&sort_by=${coursesSortBy}&order=${coursesOrder}`,
    async (url) => {
      console.log("🔍 SWR Fetching lecturer courses:", url);
      const response = await api.get(url);
      console.log("📊 SWR Courses Response:", response.data);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateIfStale: false,
      refreshInterval: 0,
      suspense: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Pagination handlers
  const handleCoursesPageChange = (newPage: number) => {
    setCoursesPage(newPage);
  };

  const handleCoursesSizeChange = (newSize: number) => {
    setCoursesSize(newSize);
    setCoursesPage(1); // Reset to first page when changing size
  };

  const handleCoursesSortChange = (newSortBy: string) => {
    setCoursesSortBy(newSortBy);
    setCoursesPage(1); // Reset to first page when changing sort
  };

  const handleCoursesOrderChange = (newOrder: "asc" | "desc") => {
    setCoursesOrder(newOrder);
    setCoursesPage(1); // Reset to first page when changing order
  };

  const handleTransactionsPageChange = (newPage: number) => {
    setTransactionsPage(newPage);
  };

  const handleTransactionsSizeChange = (newSize: number) => {
    setTransactionsSize(newSize);
    setTransactionsPage(1); // Reset to first page when changing size
  };

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetailModal(true);
  };

  // Component để xử lý ảnh với error handling
  const CourseImage = ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleImageError = () => {
      setImageError(true);
      setIsLoading(false);
    };

    const handleImageLoad = () => {
      setIsLoading(false);
    };

    // Xử lý URL Google Drive
    const getImageUrl = (url: string) => {
      if (!url) return "/placeholder-course.jpg";
      return getGoogleDriveImageUrl(url);
    };

    if (imageError) {
      return (
        <div
          className={`${className} bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center`}
        >
          <div className="text-center">
            <HiAcademicCap className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-purple-600 font-medium">
              Không thể tải ảnh
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${className} relative overflow-hidden`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <HiAcademicCap className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <img
          src={getImageUrl(src)}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  const handleBanLecturer = async () => {
    if (!data) return;

    // Show ban modal
    setShowBanModal(true);
  };

  const handleUnbanLecturer = async () => {
    if (!data) return;

    const confirm = window.confirm(
      `🔓 XÁC NHẬN MỞ CHẶN\n\nBạn có chắc chắn muốn mở chặn giảng viên "${data.fullname}"?\n\nGiảng viên sẽ có thể đăng nhập và hoạt động trở lại.`
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/admin/lecturers/${data.id}/unban`);

      showToast.success(
        response.data.message || "Đã mở chặn giảng viên thành công"
      );

      await mutate(); // Refresh data
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error unbanning lecturer:", error);

      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;

      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage =
            detail ||
            "Bạn không có quyền mở chặn giảng viên hoặc đây không phải là giảng viên.";
          break;
        case 404:
          errorMessage = detail || "Giảng viên không tồn tại hoặc đã bị xóa.";
          break;
        case 409:
          errorMessage =
            detail ||
            "Giảng viên chưa từng bị chặn hoặc không thể tự mở chặn chính mình.";
          break;
        case 500:
          errorMessage =
            detail || "Có lỗi xảy ra trên server. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = detail || "Có lỗi xảy ra khi mở chặn giảng viên!";
      }

      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBan = async () => {
    if (!banReason.trim()) {
      showToast.error("Vui lòng nhập lý do cấm!");
      return;
    }

    if (banType === "temporary" && (!banUntilDate || !banUntilTime)) {
      showToast.error("Vui lòng chọn ngày và giờ kết thúc cấm!");
      return;
    }

    setIsSubmitting(true);
    try {
      const isPermanent = banType === "permanent";
      let bannedUntil = null;

      if (!isPermanent) {
        bannedUntil = new Date(`${banUntilDate}T${banUntilTime}`);
        if (bannedUntil <= new Date()) {
          showToast.error("Ngày kết thúc cấm phải sau thời điểm hiện tại!");
          setIsSubmitting(false);
          return;
        }
      }

      const response = await api.post(`/admin/lecturers/${lecturerId}/ban`, {
        is_block_permanently: isPermanent,
        banned_reason: banReason.trim(),
        banned_until: bannedUntil ? bannedUntil.toISOString() : null,
      });

      const banTypeText = isPermanent ? "vĩnh viễn" : "tạm thời";
      const successMessage =
        response.data?.message || `Cấm giảng viên ${banTypeText} thành công!`;
      showToast.success(successMessage);

      // Reset form
      setShowBanModal(false);
      setBanReason("");
      setBanUntilDate("");
      setBanUntilTime("");

      await mutate();
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error banning lecturer:", error);

      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;

      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage =
            detail ||
            "Bạn không có quyền chặn giảng viên hoặc đây không phải là giảng viên.";
          break;
        case 404:
          errorMessage = detail || "Giảng viên không tồn tại hoặc đã bị xóa.";
          break;
        case 409:
          errorMessage =
            detail ||
            "Giảng viên đang bị chặn hoặc không thể tự chặn chính mình.";
          break;
        case 400:
          errorMessage = detail || "Thông tin cấm không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 500:
          errorMessage =
            detail || "Có lỗi xảy ra trên server. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = detail || "Có lỗi xảy ra khi cấm giảng viên!";
      }

      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLecturer = async () => {
    if (!data) return;

    // Kiểm tra điều kiện xóa
    if (data.is_verified_email) {
      showToast.error(
        "KHÔNG THỂ XÓA! Giảng viên đã xác thực email không thể xóa. Chỉ có thể xóa tài khoản chưa xác thực email."
      );
      return;
    }

    // Hiển thị modal nhập lý do xóa
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!data || !deleteReason.trim()) {
      showToast.error("Vui lòng nhập lý do xóa giảng viên!");
      return;
    }

    // Cảnh báo chi tiết
    const confirmMessage = `🚨 CẢNH BÁO NGHIÊM TRỌNG! 🚨

Bạn đang chuẩn bị XÓA VĨNH VIỄN giảng viên:

👤 Tên: ${data.fullname}
📧 Email: ${data.email}
🆔 ID: ${data.id}
💰 Số dư ví: ${formatCurrency(data.wallet.balance)}
📝 Lý do: ${deleteReason.trim()}

⚠️  HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC!

Tất cả dữ liệu sẽ bị xóa vĩnh viễn:
• Thông tin cá nhân
• Khóa học đã tạo
• Lịch sử giảng dạy
• Tất cả hoạt động liên quan

Bạn có CHẮC CHẮN muốn tiếp tục?

Nhập "XÓA" để xác nhận:`;

    const userConfirmation = prompt(confirmMessage);

    if (userConfirmation !== "XÓA") {
      showToast.error("Đã hủy thao tác xóa. Giảng viên vẫn an toàn.");
      setShowDeleteModal(false);
      setDeleteReason("");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.delete(`/admin/lecturers/${lecturerId}`, {
        params: {
          reason: deleteReason.trim(),
        },
      });

      // Xử lý response mới từ API
      const { message, lecturer_id, deleted_at, deleted_until } = response.data;

      showToast.success(
        `XÓA THÀNH CÔNG! ${message} - Giảng viên: ${data.fullname}`
      );

      // Reset form
      setShowDeleteModal(false);
      setDeleteReason("");

      // Redirect to lecturers list
      window.location.href = "/admin/lecturers";
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error deleting lecturer:", error);

      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;

      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage =
            detail ||
            "Bạn không có quyền xóa giảng viên hoặc đây không phải là giảng viên.";
          break;
        case 404:
          errorMessage = detail || "Giảng viên không tồn tại hoặc đã bị xóa.";
          break;
        case 409:
          errorMessage =
            detail ||
            "Không thể xóa giảng viên này. Có thể giảng viên đang có dữ liệu liên quan.";
          break;
        case 400:
          errorMessage = detail || "Lý do xóa không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 500:
          errorMessage =
            detail || "Có lỗi xảy ra trên server. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = detail || "Có lỗi xảy ra khi xóa giảng viên!";
      }

      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRoleLecturer = async () => {
    if (!data) return;

    const confirm = window.confirm(
      `⚠️ XÁC NHẬN GỠ QUYỀN GIẢNG VIÊN\n\nBạn có chắc chắn muốn gỡ quyền giảng viên của "${data.fullname}"?\n\n⚠️ Sau khi gỡ quyền:\n• Người dùng sẽ mất quyền giảng viên\n• Không thể tạo hoặc quản lý khóa học\n• Tài khoản sẽ trở thành người dùng thông thường\n\nĐây là hành động quan trọng, vui lòng xác nhận!`
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const response = await api.delete(
        `/admin/lecturers/${lecturerId}/remove_role_lecturer`
      );

      showToast.success(
        response.data.message || "Đã gỡ quyền giảng viên thành công"
      );

      // Redirect to users list (không còn là giảng viên nữa)
      window.location.href = "/admin/users";
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error removing lecturer role:", error);

      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;

      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage =
            detail ||
            "Bạn không có quyền gỡ quyền giảng viên hoặc đây không phải là giảng viên.";
          break;
        case 404:
          errorMessage = detail || "Giảng viên không tồn tại hoặc đã bị xóa.";
          break;
        case 409:
          errorMessage =
            detail ||
            "Không thể gỡ quyền giảng viên này. Có thể người dùng chưa có quyền giảng viên hoặc đang có khóa học đang hoạt động.";
          break;
        case 400:
          errorMessage = detail || "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 500:
          errorMessage =
            detail || "Có lỗi xảy ra trên server. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = detail || "Có lỗi xảy ra khi gỡ quyền giảng viên!";
      }

      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy giảng viên
          </h2>
          <p className="text-gray-600 mb-4">
            Giảng viên với ID này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => (window.location.href = "/admin/lecturers")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Quay lại"
          >
            <HiArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Chi tiết giảng viên
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Thông tin đầy đủ về {data.fullname}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {data.is_banned ? (
            <button
              onClick={handleUnbanLecturer}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
            >
              <HiBan className="w-4 h-4" />
              <span>Mở chặn</span>
            </button>
          ) : (
            <button
              onClick={handleBanLecturer}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
            >
              <HiBan className="w-4 h-4" />
              <span>Cấm giảng viên</span>
            </button>
          )}
          <button
            onClick={handleRemoveRoleLecturer}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
          >
            <HiUserRemove className="w-4 h-4" />
            <span>Gỡ quyền GV</span>
          </button>
          <button
            onClick={handleDeleteLecturer}
            disabled={isSubmitting || data.is_verified_email}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              data.is_verified_email
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            } disabled:opacity-50`}
            title={
              data.is_verified_email
                ? "Không thể xóa giảng viên đã xác thực email"
                : ""
            }
          >
            <HiTrash className="w-4 h-4" />
            <span>Xóa giảng viên</span>
          </button>
        </div>
      </div>

      {/* Lecturer Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {data.fullname.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold">{data.fullname}</h2>
              <p className="text-purple-100 text-lg">{data.email}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      data.is_verified_email ? "bg-emerald-400" : "bg-orange-400"
                    }`}
                  />
                  <span className="text-sm">
                    {data.is_verified_email
                      ? "Email đã xác thực"
                      : "Email chưa xác thực"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm font-semibold">
                    Giảng viên đã nâng cấp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiUser className="w-5 h-5 text-purple-600" />
                <span>Thông tin cá nhân</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    ID giảng viên
                  </label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                    {data.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Họ và tên
                  </label>
                  <p className="text-sm text-gray-900">{data.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{data.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Giới thiệu
                  </label>
                  <p className="text-sm text-gray-900">
                    {data.bio || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                <span>Thông tin ví</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Số dư hiện tại
                  </label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(data.wallet.balance)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tổng nạp vào
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(data.wallet.total_in)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tổng chi ra
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(data.wallet.total_out)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Giao dịch cuối
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(data.wallet.last_transaction_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Nâng cấp giảng viên</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phí nâng cấp
                  </label>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(data.upgrade_payment.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian thanh toán
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(data.upgrade_payment.paid_time)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Trạng thái
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      {data.upgrade_payment.payment_status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Ghi chú
                  </label>
                  <p className="text-sm text-gray-900">
                    {data.upgrade_payment.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng khóa học</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-purple-600 transition-colors duration-300">
                {coursesData?.total_items || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiAcademicCap className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng học viên</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-emerald-600 transition-colors duration-300">
                {coursesData?.items?.reduce(
                  (sum, course) => sum + course.total_enrolls,
                  0
                ) || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiUsers className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Đánh giá trung bình
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-yellow-600 transition-colors duration-300">
                {coursesData?.items?.length
                  ? (
                      coursesData.items.reduce(
                        (sum, course) => sum + course.rating_avg,
                        0
                      ) / coursesData.items.length
                    ).toFixed(1)
                  : 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiStar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng lượt xem</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors duration-300">
                {coursesData?.items?.reduce(
                  (sum, course) => sum + course.views,
                  0
                ) || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiEye className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses and Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <HiAcademicCap className="w-5 h-5 text-purple-600" />
              <span>Khóa học của giảng viên</span>
            </h3>
            <div className="text-sm text-gray-600">
              Tổng:{" "}
              <span className="font-semibold">
                {coursesData?.total_items || 0}
              </span>{" "}
              khóa học
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Sắp xếp theo:
              </label>
              <select
                value={coursesSortBy}
                onChange={(e) => handleCoursesSortChange(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="title">Tên khóa học</option>
                <option value="views">Lượt xem</option>
                <option value="price">Giá</option>
                <option value="total_enrolls">Số học viên</option>
                <option value="total_reviews">Tổng số đánh giá</option>
                <option value="rating">Đánh giá trung bình</option>
                <option value="created_at">Ngày tạo</option>
                <option value="updated_at">Ngày cập nhật</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Thứ tự:
              </label>
              <select
                value={coursesOrder}
                onChange={(e) =>
                  handleCoursesOrderChange(e.target.value as "asc" | "desc")
                }
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>

          {isLoadingCourses && !coursesData ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : coursesData?.items?.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {coursesData.items.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:scale-105"
                  >
                    <CourseImage
                      src={getGoogleDriveImageUrl(course.thumbnail)}
                      alt={course.title}
                      className="aspect-video rounded-lg mb-2"
                    />
                    <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <HiUsers className="w-3 h-3" />
                        <span>{course.total_enrolls}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HiStar className="w-3 h-3 text-yellow-500" />
                        <span>{course.rating_avg}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HiEye className="w-3 h-3" />
                        <span>{course.views}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(course.price)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          course.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.is_published ? "Xuất bản" : "Nháp"}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-purple-600 font-medium text-center">
                      👆 Nhấn để xem chi tiết
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={coursesData.page}
                totalPages={coursesData.total_pages}
                totalItems={coursesData.total_items}
                pageSize={coursesData.size}
                onPageChange={handleCoursesPageChange}
                onPageSizeChange={handleCoursesSizeChange}
                showPageSizeSelector={true}
                pageSizeOptions={[4, 8, 12, 16]}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <HiAcademicCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Chưa có khóa học nào</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <HiCurrencyDollar className="w-5 h-5 text-green-600" />
              <span>Giao dịch gần đây</span>
            </h3>
            <div className="text-sm text-gray-600">
              Tổng:{" "}
              <span className="font-semibold">
                {data?.pagination?.total || 0}
              </span>{" "}
              giao dịch
            </div>
          </div>

          {isLoading && !data ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : data?.transactions?.length ? (
            <>
              <div className="space-y-3 mb-6">
                {data.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          transaction.amount > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.transaction_code} •{" "}
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.total_pages}
                totalItems={data.pagination.total}
                pageSize={data.pagination.page_size}
                onPageChange={handleTransactionsPageChange}
                onPageSizeChange={handleTransactionsSizeChange}
                showPageSizeSelector={true}
                pageSizeOptions={[5, 10, 15, 20]}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <HiCurrencyDollar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Lecturer Modal */}
      {showDeleteModal && (
        <DeleteLecturerModal
          deleteReason={deleteReason}
          setDeleteReason={setDeleteReason}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeleteReason("");
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Course Detail Modal */}
      {showCourseDetailModal &&
        selectedCourse &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            {/* Backdrop */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
              }}
              onClick={() => setShowCourseDetailModal(false)}
            />

            {/* Modal Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "56rem",
                transform: "scale(1)",
                opacity: 1,
                transition: "all 300ms ease-out",
              }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 via-purple-700 to-teal-600 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <HiAcademicCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold mb-1 leading-tight line-clamp-2">
                          {selectedCourse.title}
                        </h2>
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <HiStar className="w-3 h-3 text-yellow-300" />
                            <span className="font-medium">
                              {selectedCourse.rating_avg}
                            </span>
                            <span className="text-purple-200">
                              ({selectedCourse.rating_count})
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiUsers className="w-3 h-3 text-blue-300" />
                            <span className="font-medium">
                              {selectedCourse.total_enrolls}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiEye className="w-3 h-3 text-green-300" />
                            <span className="font-medium">
                              {selectedCourse.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCourseDetailModal(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group flex-shrink-0"
                    >
                      <HiX className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="p-6 overflow-y-auto"
                  style={{ maxHeight: "calc(90vh - 200px)" }}
                >
                  {/* Course Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Thumbnail */}
                    <div className="md:col-span-1">
                      <CourseImage
                        src={getGoogleDriveImageUrl(selectedCourse.thumbnail)}
                        alt={selectedCourse.title}
                        className="w-full h-48 rounded-xl shadow-md"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="md:col-span-2">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Thông tin khóa học</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Giá
                              </span>
                              <span className="text-base font-bold text-green-600">
                                {formatCurrency(selectedCourse.price)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Ngôn ngữ
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                {selectedCourse.language}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Cấp độ
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                                {selectedCourse.level}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Trạng thái
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedCourse.is_published
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {selectedCourse.is_published
                                  ? "Đã xuất bản"
                                  : "Nháp"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Ngày tạo
                              </span>
                              <span className="text-xs text-gray-700">
                                {formatDate(selectedCourse.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-600 text-sm font-medium">
                                Cập nhật
                              </span>
                              <span className="text-xs text-gray-700">
                                {formatDate(selectedCourse.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}

                  {/* Sections and Lessons */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Chương và bài học</span>
                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {selectedCourse.sections?.length || 0} chương
                      </span>
                    </h3>

                    {selectedCourse.sections &&
                    selectedCourse.sections.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCourse.sections.map(
                          (section: any, sectionIndex: number) => (
                            <div
                              key={section.id || sectionIndex}
                              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
                            >
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">
                                      Chương {sectionIndex + 1}:{" "}
                                      {section.title ||
                                        `Chương ${sectionIndex + 1}`}
                                    </h4>
                                    {section.description && (
                                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                        {section.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                    {section.lessons?.length || 0} bài
                                  </div>
                                </div>
                              </div>

                              {section.lessons && section.lessons.length > 0 ? (
                                <div className="p-3">
                                  <div className="space-y-2">
                                    {section.lessons.map(
                                      (lesson: any, lessonIndex: number) => (
                                        <div
                                          key={lesson.id || lessonIndex}
                                          className="flex items-center space-x-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                                        >
                                          <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-white">
                                              {lessonIndex + 1}
                                            </span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="text-xs font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                                              {lesson.title ||
                                                `Bài ${lessonIndex + 1}`}
                                            </h5>
                                            {lesson.description && (
                                              <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                                {lesson.description}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex items-center space-x-1 flex-shrink-0">
                                            {lesson.type && (
                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                {lesson.type}
                                              </span>
                                            )}
                                            {lesson.duration && (
                                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                {lesson.duration}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="p-6 text-center">
                                  <HiAcademicCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                  <p className="text-gray-500 text-xs">
                                    Chưa có bài học
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                        <HiAcademicCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-sm font-semibold text-gray-600 mb-1">
                          Chưa có nội dung khóa học
                        </h4>
                        <p className="text-gray-500 text-xs">
                          Khóa học này chưa có chương và bài học nào
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setShowCourseDetailModal(false)}
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all duration-200 shadow-md"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Ban Lecturer Modal */}
      {showBanModal && (
        <BanLecturerModal
          banType={banType}
          setBanType={setBanType}
          banReason={banReason}
          setBanReason={setBanReason}
          banUntilDate={banUntilDate}
          setBanUntilDate={setBanUntilDate}
          banUntilTime={banUntilTime}
          setBanUntilTime={setBanUntilTime}
          onConfirm={handleConfirmBan}
          onCancel={() => {
            setShowBanModal(false);
            setBanReason("");
            setBanUntilDate("");
            setBanUntilTime("");
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default DetailLecturer;

// Delete Lecturer Modal Component
function DeleteLecturerModal({
  deleteReason,
  setDeleteReason,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  deleteReason: string;
  setDeleteReason: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "32rem",
          transform: "scale(1)",
          opacity: 1,
          transition: "all 300ms ease-out",
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <HiTrash className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Xóa giảng viên
                  </h3>
                  <p className="text-red-100 text-sm">
                    Nhập lý do xóa giảng viên
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
              >
                <HiXCircle className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Delete Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📝 Lý do xóa giảng viên
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Nhập lý do xóa giảng viên..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200 placeholder-gray-500 resize-none"
                rows={4}
              />
            </div>

            {/* Warning */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiTrash className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-red-800 text-sm">
                    Cảnh báo nghiêm trọng!
                  </div>
                  <div className="text-sm text-red-700 mt-1 space-y-1">
                    <div>• Giảng viên sẽ bị xóa VĨNH VIỄN khỏi hệ thống</div>
                    <div>• Tất cả khóa học sẽ bị xóa</div>
                    <div>• Lịch sử giảng dạy sẽ mất</div>
                    <div>• Hành động này KHÔNG THỂ HOÀN TÁC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting || !deleteReason.trim()}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Ban Lecturer Modal Component
function BanLecturerModal({
  banType,
  setBanType,
  banReason,
  setBanReason,
  banUntilDate,
  setBanUntilDate,
  banUntilTime,
  setBanUntilTime,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  banType: "permanent" | "temporary";
  setBanType: (type: "permanent" | "temporary") => void;
  banReason: string;
  setBanReason: (reason: string) => void;
  banUntilDate: string;
  setBanUntilDate: (date: string) => void;
  banUntilTime: string;
  setBanUntilTime: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "32rem",
          transform: "scale(1)",
          opacity: 1,
          transition: "all 300ms ease-out",
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <HiBan className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Cấm giảng viên
                  </h3>
                  <p className="text-red-100 text-sm">
                    Chọn loại cấm và nhập thông tin
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
              >
                <HiXCircle className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Ban Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🚫 Loại cấm
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBanType("temporary")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                    banType === "temporary"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-25"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <HiClock className="w-4 h-4" />
                    <span>Cấm tạm thời</span>
                  </div>
                </button>
                <button
                  onClick={() => setBanType("permanent")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                    banType === "permanent"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-25"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <HiBan className="w-4 h-4" />
                    <span>Cấm vĩnh viễn</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Ban Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📝 Lý do cấm
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Nhập lý do cấm giảng viên..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200 placeholder-gray-500 resize-none"
                rows={3}
              />
            </div>

            {/* Time Settings (only for temporary ban) */}
            {banType === "temporary" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Thời gian kết thúc cấm
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      value={banUntilDate}
                      onChange={(e) => setBanUntilDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Giờ kết thúc
                    </label>
                    <input
                      type="time"
                      value={banUntilTime}
                      onChange={(e) => setBanUntilTime(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
                {banUntilDate && banUntilTime && (
                  <div className="mt-2 text-sm text-gray-600">
                    Cấm đến:{" "}
                    {new Date(`${banUntilDate}T${banUntilTime}`).toLocaleString(
                      "vi-VN"
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Warning */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiBan className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-red-800 text-sm">
                    Cảnh báo!
                  </div>
                  <div className="text-sm text-red-700 mt-1">
                    {banType === "permanent"
                      ? "Giảng viên sẽ bị cấm vĩnh viễn và không thể đăng nhập."
                      : banUntilDate && banUntilTime
                      ? `Giảng viên sẽ bị cấm đến ${new Date(
                          `${banUntilDate}T${banUntilTime}`
                        ).toLocaleString("vi-VN")}.`
                      : "Vui lòng chọn ngày và giờ kết thúc cấm."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting || !banReason.trim()}
                className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  banType === "permanent"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận cấm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
