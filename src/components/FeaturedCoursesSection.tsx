import React, { useState } from 'react';
import { Course, BrandTheme, SaudiGradeLevel } from '../types';
import { CourseCard } from './CourseCard';
import { getThemeColors } from '../lib/theme';
import { ArrowLeft, Sparkles, BookOpen, Pause, Play } from 'lucide-react';

interface FeaturedCoursesSectionProps {
  courses: Course[];
  currentTheme: BrandTheme;
  onSelectCourse: (course: Course) => void;
  onSelectGradeFilter: (grade: SaudiGradeLevel | 'all') => void;
  selectedGrade: SaudiGradeLevel | 'all';
}

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses,
  currentTheme,
  onSelectCourse,
  onSelectGradeFilter,
  selectedGrade,
}) => {
  const colors = getThemeColors(currentTheme);
  const [isPaused, setIsPaused] = useState(false);

  const filteredCourses =
    selectedGrade === 'all'
      ? courses
      : courses.filter((c) => c.gradeKey === selectedGrade);

  // If filtered list is small, duplicate it to ensure a continuous endless carousel loop
  const carouselItems = filteredCourses.length < 4
    ? [...filteredCourses, ...filteredCourses, ...filteredCourses, ...filteredCourses]
    : [...filteredCourses, ...filteredCourses];

  // Darker version of the chosen theme for the carousel container
  const isDark = currentTheme === 'dark';
  const carouselBg = isDark ? '#100C09' : '#241C15';
  const carouselBorder = isDark ? 'rgba(214, 195, 163, 0.12)' : 'rgba(214, 195, 163, 0.2)';

  return (
    <section id="courses-section" className="py-10 sm:py-14 px-3 sm:px-6 max-w-7xl mx-auto" dir="rtl">
      {/* Section Year Picker Callout with Connector Lines */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 relative">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
          <div
            className="w-1 h-3 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <div
            className="w-1 h-3 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>

        {/* Centered Pill: "عايز سنة كام ؟" */}
        <div
          className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full font-camel text-xs sm:text-base font-extrabold shadow-sm border flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          style={{
            backgroundColor: isDark ? '#3A3028' : '#3A3028',
            borderColor: colors.secondary,
            color: '#FFF9EF',
          }}
        >
          <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
          <span>عايز سنة كام ؟</span>
        </div>

        {/* Connector line pointing down */}
        <div
          className="w-0.5 h-5 sm:h-6 my-1 border-r-2 border-dashed"
          style={{ borderColor: colors.secondary }}
        />
      </div>

      {/* Choose Your Year Section */}
      <div className="mb-8 sm:mb-10">
        <h2 className="font-camel text-lg sm:text-2xl font-black text-center text-[#1C1712] dark:text-[#FFF9EF] mb-5 sm:mb-6">
          اختار السنة الدراسية وادخل علي الكورسات المتاحة لدفعة 2026
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Grade 3 Card */}
          <button
            onClick={() => onSelectGradeFilter(selectedGrade === '3rd_secondary' ? 'all' : '3rd_secondary')}
            className={`p-4 sm:p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
              selectedGrade === '3rd_secondary'
                ? 'ring-2 ring-amber-500 font-bold'
                : 'hover:border-neutral-400'
            }`}
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="font-camel text-base sm:text-lg font-bold text-[#1C1712] dark:text-[#FFF9EF] mb-1">
              الصف الدراسي الثالث
            </div>
            <div
              className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-amber-700 dark:text-[#D6C3A3]"
            >
              <span>جميع كورسات الصف الثالث الثانوي</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>

          {/* Grade 2 Card */}
          <button
            onClick={() => onSelectGradeFilter(selectedGrade === '2nd_secondary' ? 'all' : '2nd_secondary')}
            className={`p-4 sm:p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
              selectedGrade === '2nd_secondary'
                ? 'ring-2 ring-amber-500 font-bold'
                : 'hover:border-neutral-400'
            }`}
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="font-camel text-base sm:text-lg font-bold text-[#1C1712] dark:text-[#FFF9EF] mb-1">
              الصف الدراسي الثاني
            </div>
            <div
              className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-amber-700 dark:text-[#D6C3A3]"
            >
              <span>جميع كورسات الصف الثاني الثانوي</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>

          {/* Grade 1 Card */}
          <button
            onClick={() => onSelectGradeFilter(selectedGrade === '1st_secondary' ? 'all' : '1st_secondary')}
            className={`p-4 sm:p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
              selectedGrade === '1st_secondary'
                ? 'ring-2 ring-amber-500 font-bold'
                : 'hover:border-neutral-400'
            }`}
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="font-camel text-base sm:text-lg font-bold text-[#1C1712] dark:text-[#FFF9EF] mb-1">
              الصف الدراسي الأول
            </div>
            <div
              className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-amber-700 dark:text-[#D6C3A3]"
            >
              <span>جميع كورسات الصف الأول الثانوي</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>
        </div>

        {selectedGrade !== 'all' && (
          <div className="text-center mt-3">
            <button
              onClick={() => onSelectGradeFilter('all')}
              className="text-xs font-semibold text-amber-800 dark:text-[#D6C3A3] hover:underline cursor-pointer"
            >
              إلغاء التصفية وعرض جميع الكورسات
            </button>
          </div>
        )}
      </div>

      {/* Infinite Non-Stop Looping Courses Carousel with Darker Version Background */}
      <div
        className="rounded-3xl p-4 sm:p-8 border shadow-xl overflow-hidden relative"
        style={{
          backgroundColor: carouselBg,
          borderColor: carouselBorder,
        }}
      >
        {/* Header inside the dark carousel container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-camel text-lg sm:text-2xl font-bold text-[#FFF9EF]">
                استعراض الكورسات المقترحة (شريط تفاعلي متواصل)
              </h3>
              <p className="text-xs sm:text-sm text-[#E8D9C0]">
                حرك المؤشر فوق أي كورس لإيقاف الحركة واستعراض التفاصيل والتسجيل المباشر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all text-[#FFF9EF] border-white/20 hover:bg-white/10 cursor-pointer"
              title={isPaused ? 'استئناف الحركة التلقائية' : 'إيقاف الحركة مؤقتاً'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
            </button>
          </div>
        </div>

        {/* Carousel Infinite Track */}
        <div className="overflow-hidden py-2">
          <div
            className="animate-infinite-carousel flex gap-5 sm:gap-6"
            style={{
              animationPlayState: isPaused ? 'paused' : undefined,
            }}
          >
            {carouselItems.map((course, idx) => (
              <div
                key={`${course.id}-loop-${idx}`}
                className="w-[300px] sm:w-[340px] shrink-0"
              >
                <CourseCard
                  course={course}
                  currentTheme={currentTheme}
                  onSelect={onSelectCourse}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
