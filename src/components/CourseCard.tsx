import React from 'react';
import { Course, BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  currentTheme: BrandTheme;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, currentTheme, onSelect }) => {
  const colors = getThemeColors(currentTheme);

  // Banner background graphic variations based on theme
  const getBannerStyle = () => {
    switch (course.bannerTheme) {
      case 'red-hex':
        return 'from-[#881337] via-[#9F1239] to-[#4C0519]';
      case 'green-hex':
        return 'from-[#065F46] via-[#047857] to-[#064E3B]';
      case 'navy-bookshelf':
        return 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]';
      default:
        return 'from-[#78350F] via-[#92400E] to-[#451A03]';
    }
  };

  return (
    <div
      id={`course-card-${course.id}`}
      className="rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
      }}
      onClick={() => onSelect(course)}
      dir="rtl"
    >
      {/* Top Banner Image Area (~16:9) with Hexagon/Pattern Overlay */}
      <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${getBannerStyle()} overflow-hidden select-none`}>
        {/* Hexagon / Geometric SVG pattern in background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id={`hex-${course.id}`} width="28" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path
                d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 48 L28 40 L28 24 L14 16 L0 24 L0 40 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-${course.id})`} />
        </svg>

        {/* Small Circular Badge Top-Left Inside Banner: "نوح أكاديمي" */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 text-white text-[11px] font-bold">
          <div className="w-4 h-4 rounded-full bg-[#182035] text-[#F5D278] flex items-center justify-center text-[8px] font-bold font-qahwa">
            ن
          </div>
          <span>نوح أكاديمي</span>
        </div>

        {/* Starburst / Pathway Sticker Badge in Corner */}
        {course.starburstBadge && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#F5D278] text-neutral-900 shadow-sm border border-amber-400/50">
              <Sparkles className="w-3 h-3 text-amber-800 ml-1" />
              {course.starburstBadge}
            </span>
          </div>
        )}

        {/* Visual: Teacher Cutout / Graphic */}
        <div className="absolute left-2 bottom-0 w-32 sm:w-44 h-full flex items-end justify-center pointer-events-none z-10 opacity-90 group-hover:scale-105 transition-transform duration-300">
          <img
            src={course.teacher.avatar}
            alt={course.teacher.name}
            className="h-[90%] object-cover object-top mask-radial rounded-t-full drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Bold Large Course Title Stacked directly on banner image */}
        <div className="absolute right-4 top-12 sm:top-14 bottom-10 z-20 flex flex-col justify-center max-w-[62%] text-right">
          <span className="text-amber-300 text-xs font-bold tracking-wide mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.subject}
          </span>
          <h3 className="font-camel text-base sm:text-xl font-black text-white leading-snug drop-shadow-md">
            {course.shortTitle}
          </h3>
          <span className="text-white/80 text-xs mt-1 font-ui line-clamp-1">
            {course.teacher.name}
          </span>
        </div>

        {/* Small Yellow/Gold Rectangular Label Strip near bottom of banner */}
        <div className="absolute bottom-2 right-4 z-20 bg-[#F5D278] text-neutral-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-sm shadow-xs tracking-wider">
          منصة نوح أكاديمي
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between text-right">
        <div>
          {/* Top-Right Level/Track Tag */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#EAEEC3' : '#E5D8C3',
                color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
              }}
            >
              {course.level}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-slate-400 font-medium">
              {course.track}
            </span>
          </div>

          {/* Bold Title */}
          <h4 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-2 group-hover:text-amber-500 transition-colors">
            {course.title}
          </h4>

          {/* Short Gray Descriptive Paragraph */}
          <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>
        </div>

        {/* Bottom Bar: Pricing & "خش شوف كورساتك" Arrow Link */}
        <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between mt-auto">
          {/* Price display in SAR */}
          <div className="flex items-baseline gap-1.5" dir="rtl">
            <span className="font-impact text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400">
              {course.price}
            </span>
            <span className="font-ui text-xs font-bold text-neutral-700 dark:text-slate-300">
              ر.س
            </span>
            {course.originalPrice && (
              <span className="font-ui text-xs text-red-500 line-through mr-1">
                {course.originalPrice} ر.س
              </span>
            )}
          </div>

          {/* Bottom-Left Link: "خش شوف كورساتك" */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(course);
            }}
            className="flex items-center gap-1.5 font-camel text-xs sm:text-sm font-bold transition-all hover:translate-x-1 cursor-pointer"
            style={{ color: currentTheme === 'dark' ? '#38BDF8' : colors.primary }}
          >
            <span>خش شوف كورساتك</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
