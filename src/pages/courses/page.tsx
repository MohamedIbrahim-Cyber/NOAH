import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  RotateCcw,
  Check,
  Layers,
  GraduationCap,
  Users,
  Eye,
  Flame,
} from 'lucide-react';
import { BrandTheme, Course, StudentUser } from '../../types';
import { COURSES } from '../../data/mockData';
import { getThemeColors } from '../../lib/theme';

export interface CoursesPageProps {
  currentTheme?: BrandTheme;
  currentUser?: StudentUser | null;
  onSelectCourse?: (course: Course) => void;
  onEnrollCourse?: (course: Course) => void;
  onEnroll?: (course: Course) => void;
  onAddToCart?: (course: Course) => void;
  onNavigateHome?: () => void;
  savedCourseIds?: string[];
  onToggleSaveCourse?: (courseId: string) => void;
}

export interface ExtendedCourseCard extends Course {
  rating: number;
  reviewsCount: number;
  durationHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isPopular?: boolean;
}

export const EXTENDED_COURSES: ExtendedCourseCard[] = [
  {
    ...COURSES[0],
    rating: 4.9,
    reviewsCount: 1420,
    durationHours: 24,
    difficulty: 'advanced',
    category: 'اللغة العربية والمسارات',
    isPopular: true,
  },
  {
    ...COURSES[1],
    rating: 4.8,
    reviewsCount: 980,
    durationHours: 18,
    difficulty: 'intermediate',
    category: 'البرمجة والذكاء الاصطناعي',
    isPopular: true,
  },
  {
    ...COURSES[2],
    rating: 4.7,
    reviewsCount: 1150,
    durationHours: 22,
    difficulty: 'beginner',
    category: 'المواد المشتركة',
    isPopular: false,
  },
  {
    ...COURSES[3],
    rating: 4.9,
    reviewsCount: 860,
    durationHours: 20,
    difficulty: 'intermediate',
    category: 'البرمجة والذكاء الاصطناعي',
    isPopular: true,
  },
  {
    ...COURSES[4],
    rating: 4.6,
    reviewsCount: 640,
    durationHours: 16,
    difficulty: 'beginner',
    category: 'البرمجة والذكاء الاصطناعي',
    isPopular: false,
  },
  {
    ...COURSES[5],
    rating: 4.9,
    reviewsCount: 1780,
    durationHours: 14,
    difficulty: 'beginner',
    category: 'البرمجة والذكاء الاصطناعي',
    isPopular: true,
  },
  {
    id: 'c7',
    title: 'الفيزياء المتقدمة للمسار العلمي والمسارات التخصصية',
    shortTitle: 'فيزياء المسارات 3 ث',
    level: 'الصف الثالث الثانوي',
    track: 'مسار العلوم الطبيعية',
    gradeKey: '3rd_secondary',
    trackKey: 'natural_sciences',
    subject: 'الفيزياء',
    teacher: {
      name: 'أ/ بدر المنصور',
      role: 'كبير معلمي الفيزياء الحديثة',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    price: 290,
    originalPrice: 390,
    startDate: '01 أكتوبر 2025',
    startTime: '07:00 مساءً',
    lecturesCount: 16,
    bannerTheme: 'navy-bookshelf',
    starburstBadge: 'معسكر المسارات',
    description: 'شرح مبسط للقوانين الفيزيائية والكهرباء والمغناطيسية وتطبيقاتها مع حل أسئلة بنك قياس والتحصيلي.',
    tags: ['فيزياء', 'تجارب معملية', 'تحصيلي'],
    rating: 4.9,
    reviewsCount: 1120,
    durationHours: 26,
    difficulty: 'advanced',
    category: 'العلوم الطبيعية والرياضيات',
    isPopular: true,
  },
  {
    id: 'c8',
    title: 'الرياضيات والإحصاء التحليلي لمسار إدارة الأعمال',
    shortTitle: 'رياضيات الأعمال 2 ث',
    level: 'الصف الثاني الثانوي',
    track: 'مسار الإدارة والأعمال',
    gradeKey: '2nd_secondary',
    trackKey: 'business_admin',
    subject: 'الرياضيات',
    teacher: {
      name: 'د/ عبدالعزيز الشمري',
      role: 'أستاذ الرياضيات والإحصاء التطبيقي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    price: 270,
    originalPrice: 360,
    startDate: '05 أكتوبر 2025',
    startTime: '05:30 مساءً',
    lecturesCount: 14,
    bannerTheme: 'green-hex',
    starburstBadge: 'إدارة وأعمال',
    description: 'تحليل البيانات والمصفوفات والاحتمالات الرياضية المطبقة في مجالات الاقتصاد والإدارة الحديثة.',
    tags: ['إحصاء', 'اقتصاد', 'رياضيات مالية'],
    rating: 4.7,
    reviewsCount: 520,
    durationHours: 19,
    difficulty: 'intermediate',
    category: 'العلوم الطبيعية والرياضيات',
    isPopular: false,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'جميع التخصصات' },
  { id: 'البرمجة والذكاء الاصطناعي', name: 'البرمجة والذكاء الاصطناعي' },
  { id: 'اللغة العربية والمسارات', name: 'اللغة العربية والمسارات' },
  { id: 'العلوم الطبيعية والرياضيات', name: 'العلوم الطبيعية والرياضيات' },
  { id: 'المواد المشتركة', name: 'المواد المشتركة (1 ث)' },
];

export default function CoursesCatalogPage({
  currentTheme = 'warm-earth',
  currentUser,
  onSelectCourse,
  onEnrollCourse,
  onNavigateHome,
  savedCourseIds = [],
  onToggleSaveCourse,
}: CoursesPageProps) {
  const colors = getThemeColors(currentTheme);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState<'popular' | 'rating' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sidebar Filter States
  const [maxPrice, setMaxPrice] = useState<number>(450);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // Local saved state fallback if prop not fully managed
  const [localBookmarks, setLocalBookmarks] = useState<string[]>(savedCourseIds);

  const handleBookmarkToggle = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSaveCourse) {
      onToggleSaveCourse(courseId);
    } else {
      setLocalBookmarks((prev) =>
        prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
      );
    }
  };

  const isCourseBookmarked = (courseId: string) => {
    return savedCourseIds.length > 0
      ? savedCourseIds.includes(courseId)
      : localBookmarks.includes(courseId);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSort('popular');
    setMaxPrice(450);
    setSelectedDifficulties([]);
    setMinRating(0);
    setSelectedGrades([]);
    setOnlyDiscounted(false);
  };

  const isFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'all' ||
      selectedSort !== 'popular' ||
      maxPrice < 450 ||
      selectedDifficulties.length > 0 ||
      minRating > 0 ||
      selectedGrades.length > 0 ||
      onlyDiscounted
    );
  }, [
    searchQuery,
    selectedCategory,
    selectedSort,
    maxPrice,
    selectedDifficulties,
    minRating,
    selectedGrades,
    onlyDiscounted,
  ]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return EXTENDED_COURSES.filter((course) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesTeacher = course.teacher.name.toLowerCase().includes(q);
        const matchesTag = course.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTeacher && !matchesTag) return false;
      }

      // Category
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }

      // Max price
      if (course.price > maxPrice) {
        return false;
      }

      // Difficulty
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(course.difficulty)) {
        return false;
      }

      // Rating
      if (minRating > 0 && course.rating < minRating) {
        return false;
      }

      // Grade level
      if (selectedGrades.length > 0 && !selectedGrades.includes(course.gradeKey)) {
        return false;
      }

      // Only Discounted
      if (onlyDiscounted && (!course.originalPrice || course.originalPrice <= course.price)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'newest') return b.id.localeCompare(a.id);
      // 'popular' default
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedSort,
    maxPrice,
    selectedDifficulties,
    minRating,
    selectedGrades,
    onlyDiscounted,
  ]);

  const difficultyLabels: Record<string, { label: string; bg: string; text: string }> = {
    beginner: { label: 'مبتدئ / تأسيس', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    intermediate: { label: 'متوسط / تطبيقي', bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
    advanced: { label: 'متقدم / مسارات واختبارات', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden selection:bg-amber-300 selection:text-neutral-900"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* Top Header Breadcrumb & Search Section */}
      <div className="mb-8 w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-slate-400 font-ui mb-1.5">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="hover:underline text-neutral-700 dark:text-slate-300 cursor-pointer flex items-center gap-1 min-h-[44px]"
                >
                  الرئيسية
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
              <span>دليل المقررات والكورسات التفاعلية</span>
            </div>
            <h1 className="font-camel text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-slate-100 flex items-center gap-3">
              <span>فهرس الكورسات والمسارات</span>
              <span className="text-xs sm:text-sm font-ui font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                {filteredCourses.length} كورس متاح
              </span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-80 lg:w-96 relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الكورس، المعلم، أو المادة..."
              className="w-full pr-10 pl-10 py-2.5 min-h-[44px] rounded-full border text-xs sm:text-sm font-ui transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
                color: colors.textPrimary,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills & Sort Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-3 pb-2 border-b w-full overflow-hidden" style={{ borderColor: colors.borderColor }}>
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none font-ui text-xs font-semibold w-full">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 min-h-[44px] rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-neutral-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full border text-xs font-bold font-ui transition-all cursor-pointer shadow-xs"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: isFilterActive ? '#F59E0B' : colors.borderColor,
                color: isFilterActive ? '#D97706' : colors.textPrimary,
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>تصفية النتائج</span>
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 font-ui text-xs">
              <span className="text-neutral-500 dark:text-slate-400 hidden sm:inline">ترتيب حسب:</span>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="appearance-none pr-4 pl-9 py-2.5 min-h-[44px] rounded-full border text-xs font-bold font-ui cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="popular">الأعلى طلباً والأكثر تسجيلاً</option>
                  <option value="rating">الأعلى تقييماً (★ 4.9+)</option>
                  <option value="newest">أحدث الكورسات المضافة</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filter (Desktop) + Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================== DESKTOP SIDEBAR FILTER (3 Cols) ===================== */}
        <aside
          className="hidden lg:block lg:col-span-3 rounded-3xl p-5 border sticky top-20 shadow-xs"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: colors.borderColor }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <h3 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100">
                فلاتر التصفية الذكية
              </h3>
            </div>
            {isFilterActive && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>

          <div className="space-y-6 text-xs font-ui">
            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2 font-bold">
                <span className="text-neutral-800 dark:text-slate-200">الحد الأقصى للسعر:</span>
                <span className="text-amber-600 dark:text-amber-400 font-impact text-sm">
                  {maxPrice} ر.س
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="450"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                <span>100 ر.س</span>
                <span>450 ر.س</span>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="pt-4 border-t" style={{ borderColor: colors.borderColor }}>
              <div className="font-bold text-neutral-800 dark:text-slate-200 mb-2.5">
                مستوى الصعوبة والتأسيس:
              </div>
              <div className="space-y-2">
                {[
                  { id: 'beginner', label: 'مبتدئ / تأسيس شامل' },
                  { id: 'intermediate', label: 'متوسط / تطبيقي' },
                  { id: 'advanced', label: 'متقدم / مهارات عليا' },
                ].map((item) => {
                  const checked = selectedDifficulties.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 dark:text-slate-300 hover:text-neutral-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedDifficulties((prev) =>
                            checked ? prev.filter((d) => d !== item.id) : [...prev, item.id]
                          );
                        }}
                        className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t" style={{ borderColor: colors.borderColor }}>
              <div className="font-bold text-neutral-800 dark:text-slate-200 mb-2.5">
                التقييم الأدنى:
              </div>
              <div className="space-y-1.5">
                {[
                  { val: 4.8, label: '★ 4.8 وأعلى (ممتاز)' },
                  { val: 4.5, label: '★ 4.5 وأعلى (جيد جداً)' },
                  { val: 4.0, label: '★ 4.0 وأعلى (جيد)' },
                  { val: 0, label: 'الكل دون اشتراط تقييم' },
                ].map((item) => (
                  <label
                    key={item.val}
                    className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer select-none transition-colors ${
                      minRating === item.val
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="minRatingDesktop"
                      checked={minRating === item.val}
                      onChange={() => setMinRating(item.val)}
                      className="accent-amber-500 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grade Filter */}
            <div className="pt-4 border-t" style={{ borderColor: colors.borderColor }}>
              <div className="font-bold text-neutral-800 dark:text-slate-200 mb-2.5">
                المرحلة الدراسية:
              </div>
              <div className="space-y-2">
                {[
                  { id: '1st_secondary', label: 'الصف الأول الثانوي (مشتركة)' },
                  { id: '2nd_secondary', label: 'الصف الثاني الثانوي (مسارات)' },
                  { id: '3rd_secondary', label: 'الصف الثالث الثانوي (مسارات)' },
                ].map((grade) => {
                  const checked = selectedGrades.includes(grade.id);
                  return (
                    <label
                      key={grade.id}
                      className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 dark:text-slate-300 hover:text-neutral-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedGrades((prev) =>
                            checked ? prev.filter((g) => g !== grade.id) : [...prev, grade.id]
                          );
                        }}
                        className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{grade.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Offers Only Toggle */}
            <div className="pt-4 border-t" style={{ borderColor: colors.borderColor }}>
              <label className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 cursor-pointer">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  عروض وتخفيضات فقط
                </span>
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* ===================== COURSES GRID (9 Cols) ===================== */}
        <section className="col-span-1 lg:col-span-9 w-full overflow-hidden">
          {filteredCourses.length === 0 ? (
            /* Empty State */
            <div
              className="rounded-3xl p-10 sm:p-16 border text-center flex flex-col items-center justify-center my-8 w-full"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-camel text-lg sm:text-xl font-bold text-neutral-900 dark:text-slate-100 mb-2">
                لا توجد كورسات مطابقة لخيارات البحث
              </h3>
              <p className="font-ui text-xs sm:text-sm text-neutral-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
                جرّب تعديل الكلمات المفتاحية أو تخفيف قيود التصفية (السعر، التقييم، أو المرحلة) لتوسيع النتائج.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="px-6 py-3 min-h-[44px] rounded-full font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط جميع الفلاتر</span>
              </button>
            </div>
          ) : (
            /* Courses Multi-Column Grid (Mobile 1 col, Tablet 2 cols, Desktop 3 cols) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
              {filteredCourses.map((course) => {
                const bookmarked = isCourseBookmarked(course.id);
                const discountPercent =
                  course.originalPrice && course.originalPrice > course.price
                    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
                    : 0;
                const diffBadge = difficultyLabels[course.difficulty] || difficultyLabels.intermediate;

                return (
                  <article
                    key={course.id}
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    className="group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer relative w-full"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.borderColor,
                    }}
                  >
                    {/* Course Card Top Header Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-900">
                      {/* Gradient / Cover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          course.bannerTheme === 'red-hex'
                            ? 'from-rose-900 via-neutral-900 to-amber-950'
                            : course.bannerTheme === 'green-hex'
                            ? 'from-emerald-950 via-neutral-900 to-teal-950'
                            : 'from-slate-900 via-indigo-950 to-neutral-950'
                        } opacity-90 group-hover:scale-105 transition-transform duration-500`}
                      />

                      {/* Level & Duration Badges */}
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 z-10">
                        <span className="font-ui text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow-xs">
                          <GraduationCap className="w-3 h-3 text-amber-400" />
                          <span>{course.level}</span>
                        </span>

                        {/* Bookmark Button (44x44px touch target) */}
                        <button
                          onClick={(e) => handleBookmarkToggle(course.id, e)}
                          className="min-w-[44px] min-h-[44px] rounded-full bg-black/60 backdrop-blur-md text-white hover:text-amber-400 hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-xs"
                          title={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الكورس'}
                          aria-label="حفظ الكورس"
                        >
                          {bookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Course Short Title Center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-5">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300/90 mb-1">
                          {course.track}
                        </span>
                        <h4 className="font-camel text-sm sm:text-base font-black text-white line-clamp-2 px-2">
                          {course.title}
                        </h4>
                      </div>

                      {/* Bottom Info Bar on Image */}
                      <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] font-semibold text-neutral-200 z-10">
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{course.durationHours} ساعة • {course.lecturesCount} محاضرة</span>
                        </span>

                        {discountPercent > 0 && (
                          <span className="bg-rose-500 text-white font-impact px-2 py-0.5 rounded-full text-[10px] shadow-xs">
                            خصم {discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Tags / Difficulty pill */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${diffBadge.bg} ${diffBadge.text}`}>
                            {diffBadge.label}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-slate-400">
                            {course.subject}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                          {course.title}
                        </h3>

                        {/* Description snippet */}
                        <p className="font-ui text-xs text-neutral-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {course.description}
                        </p>

                        {/* Instructor row */}
                        <div className="flex items-center justify-between gap-3 pt-3 border-t mb-4" style={{ borderColor: colors.borderColor }}>
                          <div className="flex items-center gap-2">
                            <img
                              src={course.teacher.avatar}
                              alt={course.teacher.name}
                              className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
                            />
                            <div>
                              <div className="font-camel text-xs font-bold text-neutral-800 dark:text-slate-200">
                                {course.teacher.name}
                              </div>
                              <div className="font-ui text-[10px] text-neutral-400">
                                {course.teacher.role.split(' ')[0]} {course.teacher.role.split(' ')[1]}
                              </div>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 font-ui">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{course.rating}</span>
                            <span className="text-[10px] text-neutral-400 font-normal">
                              ({course.reviewsCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action CTA */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t mt-auto" style={{ borderColor: colors.borderColor }}>
                        {/* Price */}
                        <div>
                          <div className="flex items-baseline gap-1.5" dir="rtl">
                            <span className="font-impact text-lg sm:text-xl font-black text-neutral-900 dark:text-slate-100">
                              {course.price}
                            </span>
                            <span className="font-ui text-xs font-bold text-neutral-600 dark:text-slate-400">
                              ر.س
                            </span>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="font-ui text-xs text-neutral-400 line-through mr-1">
                                {course.originalPrice} ر.س
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons (min-h-[44px]) */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEnrollCourse) onEnrollCourse(course);
                              else if (onSelectCourse) onSelectCourse(course);
                            }}
                            className="px-4 py-2 min-h-[44px] rounded-full font-bold text-xs text-white shadow-xs hover:shadow-md transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-1"
                            style={{
                              backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                            }}
                          >
                            <span>اشترك الآن</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ===================== MOBILE FILTER DRAWER MODAL ===================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end lg:hidden animate-in fade-in duration-200 w-full overflow-hidden">
          <div
            className="w-full max-w-sm h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between text-right"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textPrimary,
            }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: colors.borderColor }}>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100">
                    تصفية الكورسات
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2 rounded-full bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-slate-300 hover:bg-black/10 flex items-center justify-center cursor-pointer"
                  aria-label="إغلاق التصفية"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Filters Body */}
              <div className="space-y-5 text-xs font-ui">
                {/* Max Price Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2 font-bold">
                    <span>الحد الأقصى للسعر:</span>
                    <span className="text-amber-500 font-impact text-sm font-black">{maxPrice} ر.س</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="450"
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none"
                  />
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                    <span>100 ر.س</span>
                    <span>450 ر.س</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="pt-3 border-t" style={{ borderColor: colors.borderColor }}>
                  <div className="font-bold mb-2">المستوى:</div>
                  <div className="space-y-1">
                    {[
                      { id: 'beginner', label: 'مبتدئ / تأسيس' },
                      { id: 'intermediate', label: 'متوسط / تطبيقي' },
                      { id: 'advanced', label: 'متقدم / مسارات' },
                    ].map((item) => {
                      const checked = selectedDifficulties.includes(item.id);
                      return (
                        <label key={item.id} className="min-h-[44px] flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedDifficulties((prev) =>
                                checked ? prev.filter((d) => d !== item.id) : [...prev, item.id]
                              );
                            }}
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                          />
                          <span className="font-semibold">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div className="pt-3 border-t" style={{ borderColor: colors.borderColor }}>
                  <div className="font-bold mb-2">التقييم الأدنى:</div>
                  <div className="space-y-1">
                    {[
                      { val: 4.8, label: '★ 4.8 وأعلى' },
                      { val: 4.5, label: '★ 4.5 وأعلى' },
                      { val: 4.0, label: '★ 4.0 وأعلى' },
                      { val: 0, label: 'جميع التقييمات' },
                    ].map((item) => (
                      <label key={item.val} className="min-h-[44px] flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                        <input
                          type="radio"
                          name="minRatingMobile"
                          checked={minRating === item.val}
                          onChange={() => setMinRating(item.val)}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                        <span className="font-semibold">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discounted only */}
                <div className="pt-3 border-t" style={{ borderColor: colors.borderColor }}>
                  <label className="min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 cursor-pointer">
                    <span className="font-bold text-amber-900 dark:text-amber-300">عروض فقط</span>
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div className="pt-4 border-t mt-6 flex items-center gap-3" style={{ borderColor: colors.borderColor }}>
              <button
                onClick={handleClearAllFilters}
                className="flex-1 min-h-[44px] py-2.5 rounded-full border text-xs font-bold text-neutral-600 dark:text-slate-300 text-center flex items-center justify-center cursor-pointer hover:bg-black/5"
                style={{ borderColor: colors.borderColor }}
              >
                إعادة ضبط
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 min-h-[44px] py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs text-center shadow-md flex items-center justify-center cursor-pointer"
              >
                عرض النتائج ({filteredCourses.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
