import React, { useRef, useState } from 'react';
import { Course, BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import { ChevronRight, ChevronLeft, Calendar, Clock, User, ArrowLeft, BookOpen } from 'lucide-react';

interface CourseCatalogCarouselProps {
  courses: Course[];
  currentTheme: BrandTheme;
  onSelectCourse: (course: Course) => void;
}

export const CourseCatalogCarousel: React.FC<CourseCatalogCarouselProps> = ({
  courses,
  currentTheme,
  onSelectCourse,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const colors = getThemeColors(currentTheme);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: '3rd', label: 'الصف الثالث الثانوي' },
    { id: 'computing', label: 'مسار الحوسبة والهندسة' },
    { id: 'shared', label: 'السنة المشتركة 1 ث' },
    { id: 'arabic', label: 'اللغة العربية' },
  ];

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === '3rd') return course.gradeKey === '3rd_secondary';
    if (selectedCategory === 'computing') return course.trackKey === 'computing_engineering';
    if (selectedCategory === 'shared') return course.trackKey === 'shared_year';
    if (selectedCategory === 'arabic') return course.subject.includes('العربية');
    return true;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="catalog-section" className="py-8 sm:py-12 px-3 sm:px-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'shadow-xs scale-105'
                    : 'bg-black/5 dark:bg-slate-800 hover:bg-black/10 text-neutral-700 dark:text-slate-300'
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id
                      ? currentTheme === 'dark'
                        ? '#38BDF8'
                        : currentTheme === 'fresh'
                        ? '#6F384F'
                        : '#3A3028'
                      : undefined,
                  color: selectedCategory === cat.id ? (currentTheme === 'dark' ? '#0F172A' : '#FFFFFF') : undefined,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <h2 className="font-camel text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 dark:text-slate-100">
            كورساتنا المقترحة للعام 2025/2026
          </h2>
        </div>

        {/* Carousel Navigation Chevron Buttons */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <button
            onClick={() => scroll('right')}
            aria-label="السابق"
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{ borderColor: colors.borderColor }}
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-neutral-700 dark:text-slate-300" />
          </button>
          <button
            onClick={() => scroll('left')}
            aria-label="التالي"
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{ borderColor: colors.borderColor }}
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-neutral-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Row with Responsive Widths */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="w-[82vw] xs:w-[300px] sm:w-[340px] md:w-[380px] max-w-[400px] snap-start rounded-3xl border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group shrink-0 overflow-hidden"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            {/* Banner Image with Instructor & Stylized Overlay */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
              {/* Graphic pattern */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#F5D278_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Term badge */}
              <div className="absolute top-3 right-3 z-10 bg-amber-400 text-neutral-950 text-xs font-black px-2.5 py-1 rounded-md shadow">
                الترم الأول 2026
              </div>

              {/* Instructor cutout silhouette */}
              <div className="absolute left-3 bottom-0 w-28 sm:w-32 h-full flex items-end opacity-90 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="h-[85%] object-cover object-top rounded-t-full"
                />
              </div>

              {/* Title overlay on banner */}
              <div className="absolute right-4 top-10 sm:top-12 bottom-4 max-w-[65%] flex flex-col justify-center text-right z-10">
                <span className="text-amber-300 text-xs font-bold mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.level}
                </span>
                <h4 className="font-camel text-base sm:text-lg font-black text-white leading-snug drop-shadow">
                  {course.shortTitle}
                </h4>
              </div>
            </div>

            {/* Below Banner Details */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between text-right">
              <div>
                {/* Course Title Bold */}
                <h3 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-2 group-hover:text-amber-500 transition-colors">
                  {course.title}
                </h3>

                {/* Instructor Line */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-slate-400 font-semibold mb-2.5">
                  <User className="w-3.5 h-3.5 text-neutral-500 dark:text-slate-400" />
                  <span>المدرس: {course.teacher.name}</span>
                </div>

                {/* Date / Time Row */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-500 dark:text-slate-400 font-medium mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{course.startTime}</span>
                  </div>
                </div>

                {/* Gray description truncated */}
                <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>
              </div>

              {/* Bottom Price Block & Details Link */}
              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between mt-auto">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="font-impact text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400" dir="ltr">
                    {course.price} ر.س
                  </span>
                  {course.originalPrice && (
                    <span className="font-ui text-xs text-red-500 line-through">
                      بدلاً من {course.originalPrice} ر.س
                    </span>
                  )}
                </div>

                <span
                  className="font-camel text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  style={{ color: currentTheme === 'dark' ? '#38BDF8' : colors.primary }}
                >
                  <span>عرض التفاصيل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
