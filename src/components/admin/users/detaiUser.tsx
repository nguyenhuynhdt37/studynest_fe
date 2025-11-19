"use client";

import api from "@/lib/utils/fetcher/client/axios";
import { showToast } from "@/lib/utils/helpers/toast";
import { UserDetailResponse } from "@/types/admin/user-detail";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  HiAcademicCap,
  HiArrowLeft,
  HiBan,
  HiCalendar,
  HiChartBar,
  HiCheckCircle,
  HiClock,
  HiCog,
  HiCurrencyDollar,
  HiPlay,
  HiShieldCheck,
  HiTrash,
  HiUser,
  HiUserAdd,
  HiUsers,
  HiXCircle,
} from "react-icons/hi";
import useSWR from "swr";

const DetaiUser = ({ userId }: { userId: string }) => {
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

  // Fetch user detail data
  const { data, error, isLoading, mutate } = useSWR<UserDetailResponse>(
    `/admin/users/${userId}`,
    async (url) => {
      console.log("🔍 SWR Fetching user detail:", url);
      const response = await api.get(url);
      console.log("📊 SWR Response:", response.data);
      console.log("📊 Status data:", response.data?.status);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
      // Giữ data cũ khi đang fetch data mới
      keepPreviousData: true,
      // Không hiển thị loading khi mutate
      revalidateIfStale: false,
      // Fallback data để tránh undefined
      fallbackData: undefined,
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

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return formatDate(dateString);
  };

  const handleBanUser = async () => {
    if (!data) return;

    if (data.status.is_banned) {
      // Unban user
      setIsSubmitting(true);
      try {
        await api.post(`/admin/users/${userId}/unlock_ban`);
        showToast.success("Bỏ cấm người dùng thành công!");
        // Sử dụng mutate thay vì reload để tránh nháy
        await mutate();
      } catch (error: any) {
        // Suppress console error để không ảnh hưởng UX
        // console.error("Error unbanning user:", error);
        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          "Có lỗi xảy ra khi bỏ cấm người dùng!";
        showToast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Show ban modal
      setShowBanModal(true);
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
        // Kiểm tra ngày không được trong quá khứ
        if (bannedUntil <= new Date()) {
          showToast.error("Ngày kết thúc cấm phải sau thời điểm hiện tại!");
          setIsSubmitting(false);
          return;
        }
      }

      await api.post(`/admin/users/${userId}/ban`, {
        is_block_permanently: isPermanent,
        banned_reason: banReason.trim(),
        banned_until: bannedUntil ? bannedUntil.toISOString() : null,
      });

      const banTypeText = isPermanent ? "vĩnh viễn" : "tạm thời";
      showToast.success(`Cấm người dùng ${banTypeText} thành công!`);

      // Reset form
      setShowBanModal(false);
      setBanReason("");
      setBanUntilDate("");
      setBanUntilTime("");

      // Sử dụng mutate thay vì reload để tránh nháy
      await mutate();
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error banning user:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Có lỗi xảy ra khi cấm người dùng!";
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!data) return;

    // Kiểm tra điều kiện xóa
    if (data.status.is_verified_email) {
      showToast.error(
        "KHÔNG THỂ XÓA! Người dùng đã xác thực email không thể xóa. Chỉ có thể xóa tài khoản chưa xác thực email."
      );
      return;
    }

    // Hiển thị modal nhập lý do xóa
    setShowDeleteModal(true);
  };

  const handleAddRoleLecturer = async () => {
    if (!data) return;

    const confirm = window.confirm(
      `🎓 XÁC NHẬN CÁP QUYỀN GIẢNG VIÊN\n\nBạn có chắc chắn muốn cấp quyền giảng viên cho "${data.profile.fullname}"?\n\n✅ Sau khi cấp quyền:\n• Người dùng sẽ có quyền giảng viên\n• Có thể tạo và quản lý khóa học\n• Tài khoản sẽ được nâng cấp lên giảng viên\n\nĐây là hành động quan trọng, vui lòng xác nhận!`
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/admin/lecturers/${userId}/add_role_lecturer`
      );

      showToast.success(
        response.data.message || "Đã cấp quyền giảng viên thành công"
      );

      // Redirect to lecturer detail page
      window.location.href = `/admin/lecturers/${userId}`;
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error adding lecturer role:", error);

      const status = error.response?.status;
      const detail = error.response?.data?.detail || error.message;

      let errorMessage = "";

      switch (status) {
        case 403:
          errorMessage =
            detail ||
            "Bạn không có quyền cấp quyền giảng viên hoặc người dùng không hợp lệ.";
          break;
        case 404:
          errorMessage = detail || "Người dùng không tồn tại hoặc đã bị xóa.";
          break;
        case 409:
          errorMessage =
            detail ||
            "Không thể cấp quyền giảng viên. Có thể người dùng đã có quyền giảng viên.";
          break;
        case 400:
          errorMessage = detail || "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 500:
          errorMessage =
            detail || "Có lỗi xảy ra trên server. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage =
            detail || "Có lỗi xảy ra khi cấp quyền giảng viên!";
      }

      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!data || !deleteReason.trim()) {
      showToast.error("Vui lòng nhập lý do xóa người dùng!");
      return;
    }

    // Cảnh báo chi tiết
    const confirmMessage = `🚨 CẢNH BÁO NGHIÊM TRỌNG! 🚨

Bạn đang chuẩn bị XÓA VĨNH VIỄN người dùng:

👤 Tên: ${data.profile.fullname}
📧 Email: ${data.profile.email}
🆔 ID: ${data.profile.id}
📅 Ngày tạo: ${formatDate(data.profile.created_at)}
📊 Số khóa học: ${data.statistics.total_courses_enrolled}
📝 Lý do: ${deleteReason.trim()}

⚠️  HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC!

Tất cả dữ liệu sẽ bị xóa vĩnh viễn:
• Thông tin cá nhân
• Lịch sử học tập
• Dữ liệu khóa học
• Tất cả hoạt động liên quan

Bạn có CHẮC CHẮN muốn tiếp tục?

Nhập "XÓA" để xác nhận:`;

    const userConfirmation = prompt(confirmMessage);

    if (userConfirmation !== "XÓA") {
      showToast.error("Đã hủy thao tác xóa. Người dùng vẫn an toàn.");
      setShowDeleteModal(false);
      setDeleteReason("");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.delete(`/admin/users/${userId}`, {
        params: {
          reason: deleteReason.trim(),
        },
      });

      // Xử lý response mới từ API
      const { message, user_id, deleted_at, deleted_until } = response.data;

      showToast.success(
        `XÓA THÀNH CÔNG! ${message} - Người dùng: ${data.profile.fullname}`
      );

      // Reset form
      setShowDeleteModal(false);
      setDeleteReason("");

      // Redirect to users list
      window.location.href = "/admin/users";
    } catch (error: any) {
      // Suppress console error để không ảnh hưởng UX
      // console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Có lỗi xảy ra khi xóa người dùng!";
      showToast.error(`LỖI KHI XÓA! ${errorMessage}`);
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
            Không tìm thấy người dùng
          </h2>
          <p className="text-gray-600 mb-4">
            Người dùng với ID này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const { profile, status, roles, statistics, transactions, recent_activity } =
    data;

  // Debug log để kiểm tra dữ liệu
  console.log("🔍 Debug - Status data:", status);
  console.log("🔍 Debug - deleted_until:", status.deleted_until);
  console.log("🔍 Debug - deleted_at:", status.deleted_at);

  // Kiểm tra người dùng đã bị xóa vĩnh viễn
  const isDeletedUser =
    status.deleted_at !== null && status.deleted_at !== undefined;

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
              Chi tiết người dùng
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Thông tin đầy đủ về {profile.fullname}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isDeletedUser ? (
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <HiTrash className="w-4 h-4" />
              <span>Đã xóa vĩnh viễn</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleBanUser}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  status.is_banned
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } disabled:opacity-50`}
              >
                {status.is_banned ? (
                  <>
                    <HiShieldCheck className="w-4 h-4" />
                    <span>Bỏ cấm</span>
                  </>
                ) : (
                  <>
                    <HiBan className="w-4 h-4" />
                    <span>Cấm người dùng</span>
                  </>
                )}
              </button>
              <button
                onClick={handleAddRoleLecturer}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
              >
                <HiUserAdd className="w-4 h-4" />
                <span>Cấp quyền GV</span>
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isSubmitting || status.is_verified_email}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  status.is_verified_email
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } disabled:opacity-50`}
                title={
                  status.is_verified_email
                    ? "Không thể xóa người dùng đã xác thực email"
                    : ""
                }
              >
                <HiTrash className="w-4 h-4" />
                <span>Xóa người dùng</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {profile.fullname.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold">{profile.fullname}</h2>
              <p className="text-green-100 text-lg">{profile.email}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status.is_verified_email ? "bg-emerald-400" : "bg-orange-400"
                    }`}
                  />
                  <span className="text-sm">
                    {status.is_verified_email
                      ? "Email đã xác thực"
                      : "Email chưa xác thực"}
                  </span>
                </div>
                {status.is_banned && !isDeletedUser && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="text-sm">
                      {status.banned_until
                        ? "Bị cấm tạm thời"
                        : "Bị cấm vĩnh viễn"}
                    </span>
                  </div>
                )}
                {isDeletedUser && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold">
                      Đã xóa vĩnh viễn
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiUser className="w-5 h-5 text-green-600" />
                <span>Thông tin cá nhân</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    ID người dùng
                  </label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                    {profile.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Họ và tên
                  </label>
                  <p className="text-sm text-gray-900">{profile.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Ngày sinh
                  </label>
                  <p className="text-sm text-gray-900">
                    {profile.birthday
                      ? new Date(profile.birthday).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiCog className="w-5 h-5 text-emerald-600" />
                <span>Trạng thái</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Xác thực email
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        status.is_verified_email
                          ? "bg-emerald-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        status.is_verified_email
                          ? "text-emerald-700"
                          : "text-orange-700"
                      }`}
                    >
                      {status.is_verified_email
                        ? "Đã xác thực"
                        : "Chưa xác thực"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Trạng thái tài khoản
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isDeletedUser
                          ? "bg-red-500"
                          : status.is_banned
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDeletedUser
                          ? "text-red-700"
                          : status.is_banned
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {isDeletedUser
                        ? "Đã xóa vĩnh viễn"
                        : status.is_banned
                        ? "Bị cấm"
                        : "Bình thường"}
                    </span>
                  </div>

                  {/* Thông tin xóa vĩnh viễn */}
                  {isDeletedUser && (
                    <div className="mt-2">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-xs font-medium text-red-800 mb-1">
                          Thông tin xóa:
                        </div>
                        <div className="text-sm text-red-700">
                          <div className="flex items-center space-x-1">
                            <HiTrash className="w-3 h-3" />
                            <span>
                              Đã xóa:{" "}
                              {status.deleted_at
                                ? formatDate(status.deleted_at)
                                : "Không xác định"}
                            </span>
                          </div>
                          {status.deleted_until && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-xs text-red-600">
                                Lý do:
                              </span>
                              <span className="text-xs font-medium text-red-800 bg-red-100 px-2 py-1 rounded">
                                {status.deleted_until}
                              </span>
                            </div>
                          )}
                          {!status.deleted_until && isDeletedUser && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-xs text-red-600">
                                Lý do:
                              </span>
                              <span className="text-xs font-medium text-red-800 bg-red-100 px-2 py-1 rounded">
                                Không có thông tin
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-red-600 mt-1">
                            Tài khoản đã bị xóa vĩnh viễn khỏi hệ thống
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thông tin cấm (chỉ hiển thị khi không bị xóa) */}
                  {status.is_banned && !isDeletedUser && (
                    <div className="mt-2 space-y-2">
                      {/* Lý do cấm */}
                      {status.banned_reason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-xs font-medium text-red-800 mb-1">
                            Lý do cấm:
                          </div>
                          <div className="text-sm text-red-700">
                            {status.banned_reason}
                          </div>
                        </div>
                      )}

                      {/* Thời gian cấm */}
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="text-xs font-medium text-orange-800 mb-1">
                          Thời gian cấm:
                        </div>
                        <div className="text-sm text-orange-700">
                          {status.banned_until ? (
                            <>
                              <div className="flex items-center space-x-1">
                                <HiClock className="w-3 h-3" />
                                <span>
                                  Cấm đến: {formatDate(status.banned_until)}
                                </span>
                              </div>
                              <div className="text-xs text-orange-600 mt-1">
                                Tự động mở khóa sau thời gian này
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-1">
                                <HiBan className="w-3 h-3" />
                                <span>Cấm vĩnh viễn</span>
                              </div>
                              <div className="text-xs text-orange-600 mt-1">
                                Cần admin thao tác để mở khóa
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Đăng nhập lần cuối
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatLastLogin(status.last_login_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiUsers className="w-5 h-5 text-teal-600" />
                <span>Vai trò</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                  >
                    {role}
                  </span>
                ))}
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
              <p className="text-gray-600 text-sm font-medium">
                Khóa học đã đăng ký
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors duration-300">
                {statistics.total_courses_enrolled}
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
              <p className="text-gray-600 text-sm font-medium">
                Khóa học đã hoàn thành
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors duration-300">
                {statistics.total_courses_completed}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiCheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Tiến độ trung bình
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-emerald-600 transition-colors duration-300">
                {statistics.average_progress}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiChartBar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-500 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng chi tiêu</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-yellow-600 transition-colors duration-300">
                {transactions.total_spent.toLocaleString("en-US")}{" "}
                {transactions.currency}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiCurrencyDollar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiCalendar className="w-5 h-5 text-green-600" />
            <span>Timeline</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Tài khoản được tạo
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Cập nhật lần cuối
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Đăng nhập lần cuối
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(status.last_login_at)}
                </p>
              </div>
            </div>
            {transactions.last_payment_at && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Thanh toán lần cuối
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(transactions.last_payment_at)}
                  </p>
                </div>
              </div>
            )}
            {isDeletedUser && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Tài khoản bị xóa vĩnh viễn
                  </p>
                  <p className="text-xs text-red-500">
                    {status.deleted_at
                      ? formatDate(status.deleted_at)
                      : "Không xác định"}
                  </p>
                  {status.deleted_until && (
                    <p className="text-xs text-red-600 mt-1">
                      Lý do:{" "}
                      <span className="font-medium bg-red-100 px-2 py-1 rounded">
                        {status.deleted_until}
                      </span>
                    </p>
                  )}
                  {!status.deleted_until && (
                    <p className="text-xs text-red-600 mt-1">
                      Lý do:{" "}
                      <span className="font-medium bg-red-100 px-2 py-1 rounded">
                        Không có thông tin
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiPlay className="w-5 h-5 text-teal-600" />
            <span>Hoạt động gần đây</span>
          </h3>
          <div className="space-y-4">
            {isDeletedUser ? (
              <div className="text-center py-8">
                <HiTrash className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-500 text-sm font-medium">
                  Tài khoản đã bị xóa vĩnh viễn
                </p>
                <p className="text-red-400 text-xs mt-1">
                  Không có hoạt động nào
                </p>
              </div>
            ) : recent_activity.last_watched_course ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Khóa học xem gần nhất
                    </p>
                    <p className="text-xs text-gray-500">
                      {recent_activity.last_watched_course}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Thời gian xem
                    </p>
                    <p className="text-xs text-gray-500">
                      {recent_activity.last_watched_time
                        ? formatDate(recent_activity.last_watched_time)
                        : "Không có"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <HiClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      {showDeleteModal && (
        <DeleteUserModal
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
    </div>
  );
};

export default DetaiUser;

// Delete User Modal Component
function DeleteUserModal({
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
                    Xóa người dùng
                  </h3>
                  <p className="text-red-100 text-sm">
                    Nhập lý do xóa người dùng
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
                📝 Lý do xóa người dùng
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Nhập lý do xóa người dùng..."
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
                    <div>• Người dùng sẽ bị xóa VĨNH VIỄN khỏi hệ thống</div>
                    <div>• Tất cả dữ liệu cá nhân sẽ bị mất</div>
                    <div>• Lịch sử học tập và tiến độ sẽ bị xóa</div>
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

  // Sử dụng Portal để render modal ở root level
  return createPortal(modalContent, document.body);
}
function BanUserModal({
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
                    Cấm người dùng
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
                placeholder="Nhập lý do cấm người dùng..."
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
                      ? "Người dùng sẽ bị cấm vĩnh viễn và không thể đăng nhập."
                      : banUntilDate && banUntilTime
                      ? `Người dùng sẽ bị cấm đến ${new Date(
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

  // Sử dụng Portal để render modal ở root level
  return createPortal(modalContent, document.body);
}
