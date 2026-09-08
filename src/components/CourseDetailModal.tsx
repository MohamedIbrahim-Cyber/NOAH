import React, { useState } from 'react';
import { Course, BrandTheme, StudentUser } from '../types';
import { getThemeColors } from '../lib/theme';
import {
  X,
  Play,
  Clock,
  CheckCircle2,
  Lock,
  Download,
  ArrowLeft,
  Volume2,
  Maximize2,
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BrandTheme;
  currentUser: StudentUser | null;
  onEnroll: (course: Course) => void;
  onOpenWatchLesson?: (lessonId: string, courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  currentTheme,
  currentUser,
  onEnroll,
  onOpenWatchLesson,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  const colors = getThemeColors(currentTheme);
  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);

  const mockLessons = [
    {
      id: 1,
      title: 'المحاضرة 01: مقدمة التأسيس والمفاهيم الجوهرية للمنهج الوزاري',
      duration: '45 دقيقة',
      isPreview: true,
      hasPdf: true,
    },
    {
      id: 2,
      title: 'المحاضرة 02: التطبيقات المتقدمة وحل مسائل التفكير العليا',
      duration: '50 دقيقة',
      isPreview: false,
      hasPdf: true,
    },
    {
      id: 3,
      title: 'المحاضرة 03: حل نماذج اختبارات قياس ونظام المسارات المعتمد',
      duration: '60 دقيقة',
      isPreview: false,
      hasPdf: false,
    },
    {
      id: 4,
      title: 'المحاضرة 04: المعسكر الأسبوعي ومراجعة بنك الأسئلة المتدرج',
      duration: '55 دقيقة',
      isPreview: false,
      hasPdf: true,
    },
  ];

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadNotice('جاري تجهيز وتحميل ملخص الدرس (PDF)...');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto" dir="rtl">
      <div
        className="rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border relative my-auto animate-in fade-in zoom-in-95 duration-200 text-right"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
          color: colors.textPrimary,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 text-white sm:text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 bg-black/40 sm:bg-black/5 dark:sm:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player / Preview Hero Banner */}
        <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <div className="relative w-full h-full bg-slate-900 flex flex-col justify-between p-4 text-white">
              <div className="flex items-center justify-between z-10">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  بث مشفّر عبر CDN BunnyStream (Signed Token)
                </span>
                <span className="text-xs text-neutral-300 font-impact">1080p 60fps</span>
              </div>

              <div className="text-center my-auto">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Play className="w-8 h-8 text-amber-400 fill-amber-400 ml-1" />
                </div>
                <h4 className="font-camel text-lg font-bold text-white mb-1">
                  {mockLessons[selectedLessonIndex].title}
                </h4>
                <p className="text-xs text-neutral-400 font-ui">
                  شرح المعلم: {course.teacher.name} — منصة نوح أكاديمي
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(false)} className="hover:text-amber-400 cursor-pointer">
                    إيقاف
                  </button>
                  <span>14:20 / {mockLessons[selectedLessonIndex].duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4" />
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-rose-950 to-slate-900 opacity-90" />

              <div className="relative z-20 text-center p-6">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl transform hover:scale-110 transition-all cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
                  شاهد المحاضرة التأسيسية الأولى مجاناً
                </div>
                <h3 className="font-camel text-lg sm:text-2xl font-black text-white">
                  {course.title}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8">
          {downloadNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{downloadNotice}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pb-6 border-b" style={{ borderColor: colors.borderColor }}>
            {/* Title and tags */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  {course.level}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-slate-300">
                  {course.track}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-blue-500/20 text-blue-500 border border-blue-500/30">
                  {course.subject}
                </span>
              </div>

              <h2 className="font-camel text-xl sm:text-2xl font-black text-neutral-900 dark:text-slate-100 mb-3">
                {course.title}
              </h2>

              <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>
            </div>

            {/* Price Box & Action Button */}
            <div
              className="w-full lg:w-auto shrink-0 rounded-2xl p-5 border flex flex-col items-center justify-center min-w-56 text-center"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : '#F8FAFC',
                borderColor: colors.borderColor,
              }}
            >
              <span className="text-xs text-neutral-500 dark:text-slate-400 font-semibold mb-1">
                سعر الاشتراك الموحد:
              </span>
              <div className="flex items-baseline gap-2 mb-4" dir="rtl">
                <span className="font-impact text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
                  {course.price}
                </span>
                <span className="font-ui text-xs sm:text-sm font-bold text-neutral-800 dark:text-slate-200">
                  ريال سعودي
                </span>
                {course.originalPrice && (
                  <span className="font-ui text-xs text-red-500 line-through">
                    {course.originalPrice} ر.س
                  </span>
                )}
              </div>

              {isEnrolled ? (
                <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>أنت مشترك في هذا الكورس</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onEnroll(course);
                  }}
                  className="w-full py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
                >
                  <span>اشترك الآن في الكورس</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Lessons List (Curriculum) */}
          <div className="mt-6 sm:mt-8">
            <h3 className="font-camel text-base sm:text-lg font-bold text-neutral-900 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span>محتوى الكورس والمحاضرات ({mockLessons.length} محاضرات):</span>
              <span className="text-xs text-neutral-500 dark:text-slate-400 font-normal">
                تحديث أسبوعي مستمر
              </span>
            </h3>

            <div className="space-y-3">
              {mockLessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (lesson.isPreview || isEnrolled) {
                      if (onOpenWatchLesson) {
                        onClose();
                        onOpenWatchLesson(`l${lesson.id}`, course.id);
                      } else {
                        setSelectedLessonIndex(idx);
                        setIsPlaying(true);
                      }
                    } else {
                      onEnroll(course);
                    }
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedLessonIndex === idx && isPlaying
                      ? 'border-amber-400 bg-amber-500/10 shadow-sm'
                      : 'hover:border-neutral-400'
                  }`}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: selectedLessonIndex === idx && isPlaying ? '#F59E0B' : colors.borderColor,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        lesson.isPreview || isEnrolled
                          ? 'bg-amber-400 text-neutral-950'
                          : 'bg-black/5 dark:bg-white/10 text-neutral-400'
                      }`}
                    >
                      {lesson.isPreview || isEnrolled ? (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="font-camel text-xs sm:text-sm font-bold text-neutral-900 dark:text-slate-100">
                        {lesson.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-slate-400 font-ui mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </span>
                        {lesson.isPreview && (
                          <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                            معاينة مجانية
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {lesson.hasPdf && (
                    <button
                      onClick={handleDownloadPdf}
                      className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-slate-300 hover:text-amber-500 border border-neutral-300 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">الملخص PDF</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
