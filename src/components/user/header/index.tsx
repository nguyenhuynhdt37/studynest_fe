"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiBell,
  HiHeart,
  HiMenuAlt3,
  HiSearch,
  HiShoppingBag,
} from "react-icons/hi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State để quản lý trạng thái đăng nhập
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HiMenuAlt3 className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-3">
                {/* Book Icon */}
                <div className="relative">
                  <img
                    src="/logo/studynest-logo.svg"
                    alt="StudyNest Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                {/* Brand Text */}
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-2xl font-black text-gray-900 tracking-wide">
                      STUDY
                    </span>
                    <span className="text-2xl font-black text-teal-500 ml-0.5">
                      NEST
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 tracking-widest uppercase -mt-1">
                    Spreading Knowledge
                  </span>
                </div>
              </a>
            </div>

            {/* Categories (Desktop) */}
            <div className="hidden lg:block relative">
              {/* Categories Dropdown */}
              {isCategoriesOpen && (
                <div
                  className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className="py-2">
                    <a
                      href="/category/development"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Phát triển
                    </a>
                    <a
                      href="/category/business"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Kinh doanh
                    </a>
                    <a
                      href="/category/finance"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Tài chính & Kế toán
                    </a>
                    <a
                      href="/category/it-software"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      CNTT & Phần mềm
                    </a>
                    <a
                      href="/category/design"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Thiết kế
                    </a>
                    <a
                      href="/category/marketing"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Marketing
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung bất kỳ"
                  className="w-full pl-12 pr-4 py-3 border border-gray-900 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Mobile Search Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HiSearch className="h-6 w-6" />
              </button>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <a
                    href="/teach"
                    className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium whitespace-nowrap"
                  >
                    Giảng viên
                  </a>
                  <a
                    href="/my-learning"
                    className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium whitespace-nowrap"
                  >
                    Học tập
                  </a>

                  {/* Heart Icon */}
                  <button className="p-2 text-gray-700 hover:text-teal-600">
                    <HiHeart className="h-5 w-5" />
                  </button>

                  {/* Shopping Cart */}
                  <a
                    href="/cart"
                    className="text-gray-700 hover:text-teal-600 p-2 relative"
                  >
                    <HiShoppingBag className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  </a>

                  {/* Notifications */}
                  <button className="p-2 text-gray-700 hover:text-teal-600">
                    <HiBell className="h-5 w-5" />
                  </button>

                  {/* User Avatar */}
                  <div className="relative">
                    <button className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                      NH
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Shopping Cart for non-logged users */}
                  <a
                    href="/cart"
                    className="text-gray-700 hover:text-teal-600 p-2 relative"
                  >
                    <HiShoppingBag className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  </a>

                  {/* Login Button */}
                  <button
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md text-sm font-medium hover:bg-teal-50 transition-colors whitespace-nowrap"
                  >
                    Đăng nhập
                  </button>

                  {/* Register Button */}
                  <button
                    onClick={() => {
                      /* Handle register */
                    }}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors whitespace-nowrap"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second Navigation Bar - Only show when logged in */}
      {isLoggedIn && (
        <div className="bg-white border-b border-gray-200 hidden lg:block">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8 py-3">
              <a
                href="/category/development"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Phát triển
              </a>
              <a
                href="/category/business"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Kinh doanh
              </a>
              <a
                href="/category/finance"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Tài chính & Kế toán
              </a>
              <a
                href="/category/it-software"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                CNTT & Phần mềm
              </a>
              <a
                href="/category/productivity"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Năng suất văn phòng
              </a>
              <a
                href="/category/personal-development"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Phát triển cá nhân
              </a>
              <a
                href="/category/design"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Thiết kế
              </a>
              <a
                href="/category/marketing"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Marketing
              </a>
              <a
                href="/category/lifestyle"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Sức khỏe & Thể dục
              </a>
              <a
                href="/category/music"
                className="text-sm text-gray-700 hover:text-teal-600 font-medium"
              >
                Âm nhạc
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Third Navigation Bar - Company Logos - Only show when logged in */}
      {isLoggedIn && (
        <div className="bg-gray-900 text-white hidden lg:block">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-12 py-2">
              <span className="text-xs text-gray-300 font-medium">
                Phát triển web
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Phát triển ứng dụng di động
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Ngôn ngữ lập trình
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Phát triển trò chơi
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Thiết kế & Phát triển cơ sở dữ liệu
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Kiểm tra phần mềm
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden py-4 border-t border-gray-200 bg-white">
          <div className="w-full px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm nội dung bất kỳ"
                className="w-full pl-12 pr-4 py-3 border border-gray-900 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="w-full px-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <a
                    href="/teach"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                  >
                    Giảng viên
                  </a>
                  <a
                    href="/my-learning"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                  >
                    Học tập
                  </a>
                  <a
                    href="/cart"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                  >
                    Giỏ hàng
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/cart"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                  >
                    Giỏ hàng
                  </a>
                  <div className="px-3 py-2 space-y-2">
                    <button
                      onClick={() => {
                        /* Handle login */
                      }}
                      className="w-full px-4 py-2 border border-teal-600 text-teal-600 rounded-md text-sm font-medium hover:bg-teal-50 transition-colors"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        /* Handle register */
                      }}
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      Đăng ký
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
