import React, { useState, useEffect } from 'react';
import { LogoBadge } from './LogoBadge';
import { BrandTheme, StudentUser } from '../types';
import { getThemeColors } from '../lib/theme';
import {
  Sparkles,
  User,
  CheckCircle,
  X,
  ShieldCheck,
  Menu,
  Moon,
  Sun,
  Flame,
  Home,
  Info,
  BookOpen,
  Package,
  ArrowLeft,
  LogIn,
  UserPlus,
  ShoppingCart,
  GraduationCap,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentTheme: BrandTheme;
  onToggleTheme: () => void;
  onChangeTheme?: (theme: BrandTheme) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  currentUser: StudentUser | null;
  onOpenDashboard: () => void;
  onOpenExam?: () => void;
  onOpenAdmin?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  currentPage?: string;
  onNavigatePage?: (page: string, params?: any) => void;
  cartCount?: number;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onToggleTheme,
  onChangeTheme,
  onOpenAuth,
  onOpenLogin,
  onOpenSignup,
  currentUser,
  onOpenDashboard,
  onOpenExam,
  onOpenAdmin,
  onNavigateSection,
  currentPage = 'home',
  onNavigatePage,
  cartCount = 0,
  onLogout,
}) => {
  const [activeLink, setActiveLink] = useState<'home' | 'about' | 'courses' | 'packages'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const colors = getThemeColors(currentTheme);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (link: 'home' | 'about' | 'courses' | 'packages', targetId?: string) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
    if (link === 'courses' && onNavigatePage) {
      onNavigatePage('courses');
      return;
    }
    if (currentPage !== 'home' && onNavigatePage) {
      onNavigatePage('home');
    }
    if (targetId) {
      setTimeout(() => {
        if (typeof onNavigateSection === 'function') {
          onNavigateSection(targetId);
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 50);
    }
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setIsMobileMenuOpen(false);
    if (typeof onOpenAuth === 'function') {
      onOpenAuth(mode);
    } else if (mode === 'login' && typeof onOpenLogin === 'function') {
      onOpenLogin();
    } else if (mode === 'signup' && typeof onOpenSignup === 'function') {
      onOpenSignup();
    }
  };

  const handleSelectTheme = (theme: BrandTheme) => {
    if (typeof onChangeTheme === 'function') {
      onChangeTheme(theme);
    } else {
      onToggleTheme();
    }
  };

  const handleGoToCheckout = () => {
    setIsMobileMenuOpen(false);
    if (onNavigatePage) {
      onNavigatePage('checkout');
    }
  };

  return (
    <>
      <header className="sticky top-2 z-50 px-2 sm:px-4 md:px-6 w-full max-w-7xl mx-auto transition-all duration-300">
        <nav
          id="main-navbar"
          className="backdrop-blur-md rounded-2xl md:rounded-full px-2.5 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 shadow-lg border flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 transition-all duration-300 relative w-full min-w-0"
          style={{
            backgroundColor: colors.navBg,
            borderColor: colors.navBorder,
          }}
        >
          {/* Far Right: Brand Logo Lockup */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-w-0"
            onClick={() => handleNavClick('home', 'hero-section')}
          >
            <LogoBadge size="sm" theme={currentTheme} />
          </div>

          {/* Center Nav Links - Desktop (md+) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 font-ui text-sm font-semibold">
            <button
              onClick={() => handleNavClick('home', 'hero-section')}
              className={`relative py-2 px-1 transition-colors duration-200 cursor-pointer min-h-[44px] flex items-center ${
                currentPage === 'home' && activeLink === 'home'
                  ? currentTheme === 'dark'
                    ? 'text-[#38BDF8] font-bold'
                    : currentTheme === 'fresh'
                    ? 'text-[#6F384F] font-bold'
                    : 'text-[#3A3028] font-bold'
                  : currentTheme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              الرئيسية
              {currentPage === 'home' && activeLink === 'home' && (
                <span
                  className="absolute bottom-1 right-0 w-full h-[3px] rounded-full transition-all"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#A3D365' : '#D6C3A3',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => handleNavClick('about', 'about-section')}
              className={`relative py-2 px-1 transition-colors duration-200 cursor-pointer min-h-[44px] flex items-center ${
                currentPage === 'home' && activeLink === 'about'
                  ? currentTheme === 'dark'
                    ? 'text-[#38BDF8] font-bold'
                    : currentTheme === 'fresh'
                    ? 'text-[#6F384F] font-bold'
                    : 'text-[#3A3028] font-bold'
                  : currentTheme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              من نحن
              {currentPage === 'home' && activeLink === 'about' && (
                <span
                  className="absolute bottom-1 right-0 w-full h-[3px] rounded-full transition-all"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#A3D365' : '#D6C3A3',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => {
                if (onNavigatePage) onNavigatePage('courses');
                else handleNavClick('courses', 'courses-section');
              }}
              className={`relative py-2 px-1 transition-colors duration-200 cursor-pointer min-h-[44px] flex items-center ${
                currentPage === 'courses'
                  ? currentTheme === 'dark'
                    ? 'text-[#38BDF8] font-bold'
                    : currentTheme === 'fresh'
                    ? 'text-[#6F384F] font-bold'
                    : 'text-[#3A3028] font-bold'
                  : currentTheme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              الكورسات
              {currentPage === 'courses' && (
                <span
                  className="absolute bottom-1 right-0 w-full h-[3px] rounded-full transition-all"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#A3D365' : '#D6C3A3',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => handleNavClick('packages', 'packages-section')}
              className={`relative py-2 px-1 transition-colors duration-200 cursor-pointer min-h-[44px] flex items-center ${
                currentPage === 'home' && activeLink === 'packages'
                  ? currentTheme === 'dark'
                    ? 'text-[#38BDF8] font-bold'
                    : currentTheme === 'fresh'
                    ? 'text-[#6F384F] font-bold'
                    : 'text-[#3A3028] font-bold'
                  : currentTheme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              الباقات
              {currentPage === 'home' && activeLink === 'packages' && (
                <span
                  className="absolute bottom-1 right-0 w-full h-[3px] rounded-full transition-all"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#A3D365' : '#D6C3A3',
                  }}
                />
              )}
            </button>

            {/* Quick interactive test modal trigger */}
            <button
              onClick={() => onOpenExam && onOpenExam()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs min-h-[36px]"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#F5D278' : '#D6C3A3',
                color: currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#3B1B28' : '#2A221C',
                border: currentTheme === 'dark' ? '1px solid #334155' : 'none',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              اختبر نفسك
            </button>
          </div>

          {/* Left Controls: Theme Switcher, Cart, Auth & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* Shopping Cart Button (44x44px touch target) */}
            <button
              onClick={handleGoToCheckout}
              className="relative p-2.5 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#F9FADE' : '#EFE4D0',
                borderColor: colors.borderColor,
                color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
              }}
              title="سلة المشتريات وإتمام الطلب"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Icon-Only Theme Switcher Button */}
            <button
              id="theme-toggle-button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : '#EFE4D0',
                borderColor: colors.borderColor,
                color: currentTheme === 'dark' ? '#FDE047' : colors.primary,
              }}
              aria-label="تبديل النمط اللوني"
              title={currentTheme === 'dark' ? 'التحويل للنمط النهاري' : 'التحويل للنمط الليلي'}
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-[#3A3028]" />
              )}
            </button>

            {/* Auth & User Profile Section */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {currentUser.role === 'admin' && onOpenAdmin && (
                  <button
                    id="admin-portal-button"
                    onClick={onOpenAdmin}
                    className="px-2.5 sm:px-3 py-2 rounded-full text-xs font-bold bg-neutral-900 text-amber-400 border border-neutral-700 hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                    title="لوحة تحكم الإدارة"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">لوحة الإدارة</span>
                  </button>
                )}
                <button
                  id="student-dashboard-button"
                  onClick={onOpenDashboard}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow transition-transform hover:scale-105 cursor-pointer text-white truncate max-w-[140px] sm:max-w-none min-h-[44px]"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                  }}
                  title="الملف الشخصي"
                >
                  <User className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="truncate">{currentUser.fullName.split(' ')[0]}</span>
                  {currentUser.role === 'admin' ? (
                    <span className="bg-amber-400 text-neutral-900 text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0">
                      مشرف
                    </span>
                  ) : (
                    <span className="bg-amber-400 text-neutral-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0">
                      {currentUser.points}
                    </span>
                  )}
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2.5 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="تسجيل الخروج"
                    aria-label="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  id="login-button"
                  onClick={() => handleAuthClick('login')}
                  className="px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm border transition-colors hover:bg-black/5 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center justify-center"
                  style={{
                    borderColor: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
                    color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
                  }}
                >
                  دخول
                </button>
                <button
                  id="signup-button"
                  onClick={() => handleAuthClick('signup')}
                  className="hidden xs:inline-flex px-3.5 sm:px-4.5 py-2 rounded-full font-bold text-xs sm:text-sm text-white shadow-sm transition-transform hover:scale-105 cursor-pointer whitespace-nowrap min-h-[44px] items-center justify-center"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                  }}
                >
                  حساب جديد
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Button (Under 768px, 44x44px touch target) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full border shadow-xs transition-colors flex items-center justify-center cursor-pointer text-neutral-700 dark:text-slate-200 min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#F9FADE' : '#EFE4D0',
                borderColor: colors.borderColor,
              }}
              aria-label="فتح القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Feature Mobile Drawer Modal with Smooth Backdrop & flex-col overflow-hidden */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden w-full overflow-hidden" dir="rtl">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer container (Slide down from top or side) */}
          <div className="fixed inset-x-2 top-3 max-h-[92vh] overflow-y-auto w-full max-w-lg mx-auto rounded-3xl shadow-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
              color: colors.textPrimary,
            }}
          >
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: colors.borderColor }}>
                <div className="flex items-center gap-2">
                  <LogoBadge size="sm" theme={currentTheme} />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2 rounded-full bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-slate-300 hover:bg-black/10 cursor-pointer flex items-center justify-center"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links Group (All items have min-h-[44px] touch target) */}
              <div className="space-y-1.5 font-ui text-sm font-semibold pb-3 border-b" style={{ borderColor: colors.borderColor }}>
                <button
                  onClick={() => handleNavClick('home', 'hero-section')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'home' && activeLink === 'home'
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-neutral-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-amber-500" />
                    <span>الرئيسية</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onNavigatePage) onNavigatePage('courses');
                    else handleNavClick('courses', 'courses-section');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'courses'
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-neutral-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>فهرس ودليل الكورسات</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNavClick('packages', 'packages-section')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'home' && activeLink === 'packages'
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-neutral-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>الباقات والكومبو الحصري</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNavClick('about', 'about-section')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'home' && activeLink === 'about'
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-neutral-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-amber-500" />
                    <span>من نحن ورسالة الأكاديمية</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenExam) onOpenExam();
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer bg-gradient-to-r from-amber-400/20 to-amber-200/20 text-amber-900 dark:text-amber-200 font-bold border border-amber-400/30"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>اختبر نفسك الآن (تفاعلي)</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={handleGoToCheckout}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-right flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'checkout'
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-neutral-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="w-4 h-4 text-amber-500" />
                    <span>سلة المشتريات وإتمام الدفع</span>
                  </div>
                  {cartCount > 0 ? (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  ) : (
                    <ArrowLeft className="w-4 h-4 opacity-40" />
                  )}
                </button>
              </div>

              {/* Theme Selector Section (Icon-only without titles, min 44px touch targets) */}
              <div className="py-3 border-b" style={{ borderColor: colors.borderColor }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-600 dark:text-[#E8D9C0]">
                    المظهر (Theme):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectTheme('warm-earth')}
                      className={`min-h-[44px] min-w-[44px] p-2 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                        currentTheme === 'warm-earth'
                          ? 'bg-[#3A3028] text-[#FFF9EF] border-[#3A3028] shadow-sm'
                          : 'bg-white/60 dark:bg-black/30 text-neutral-800 dark:text-[#E8D9C0] border-neutral-200 dark:border-neutral-800'
                      }`}
                      title="نمط أرضي"
                      aria-label="نمط أرضي"
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                    </button>

                    <button
                      onClick={() => handleSelectTheme('dark')}
                      className={`min-h-[44px] min-w-[44px] p-2 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                        currentTheme === 'dark'
                          ? 'bg-[#D6C3A3] text-[#1C1712] border-[#D6C3A3] shadow-sm'
                          : 'bg-white/60 dark:bg-black/30 text-neutral-800 dark:text-[#E8D9C0] border-neutral-200 dark:border-neutral-800'
                      }`}
                      title="نمط داكن"
                      aria-label="نمط داكن"
                    >
                      <Moon className="w-5 h-5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Actions at the Bottom (min-h-[44px]) */}
            <div className="pt-3">
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="min-h-[44px] py-2.5 rounded-xl font-bold text-xs border text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    style={{
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="min-h-[44px] py-2.5 rounded-xl font-bold text-xs text-white text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    style={{
                      backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>انشاء حساب</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full min-h-[44px] py-2.5 rounded-xl font-bold text-xs text-white text-center flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    style={{
                      backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                    }}
                  >
                    <User className="w-4 h-4 text-amber-300" />
                    <span>الملف الشخصي ({currentUser.fullName})</span>
                  </button>
                  {currentUser.role === 'admin' && onOpenAdmin && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full min-h-[44px] py-2 rounded-xl font-bold text-xs bg-neutral-900 text-amber-400 border border-neutral-700 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>لوحة تحكم الإدارة</span>
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full min-h-[44px] py-2 rounded-xl font-bold text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AnnouncementBar: React.FC<{ currentTheme?: BrandTheme; onDismiss?: () => void }> = ({
  currentTheme = 'warm-earth',
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isDark = currentTheme === 'dark';
  const bgColor = isDark ? '#140F0C' : '#3A3028';
  const borderColor = isDark ? 'rgba(214, 195, 163, 0.15)' : 'rgba(214, 195, 163, 0.2)';

  return (
    <div
      id="announcement-bar"
      className="w-full text-white py-2 px-3 sm:px-4 shadow-sm border-b relative z-40 transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Empty placeholder for balance */}
        <div className="w-6 hidden sm:block" />

        {/* Centered Message */}
        <div className="flex items-center gap-2 mx-auto text-xs sm:text-sm font-medium text-center min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
          </span>
          <span className="font-ui font-semibold text-[#FFF9EF] truncate">
            سجلّ حسابك الان وابدأ متابعة شروحات واختبارات دفعة 2026 مع نخبة معلمي المسارات
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="text-[#E8D9C0] hover:text-[#FFF9EF] p-1 rounded-md transition-colors shrink-0 cursor-pointer"
          aria-label="إغلاق الإشعار"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

