import React, { useState } from 'react';
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Download,
  Share2,
  Heart,
  ShieldCheck,
  Award,
  Smartphone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  Calendar,
  Globe,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Zap,
  MessageSquare,
  ThumbsUp,
  X,
  Volume2,
} from 'lucide-react';
import { BrandTheme, Course, StudentUser } from '../../types';
import { COURSES } from '../../data/mockData';
import { getThemeColors } from '../../lib/theme';

export interface CourseDetailPageProps {
  course?: Course | null;
  currentTheme?: BrandTheme;
  currentUser?: StudentUser | null;
  onEnroll?: (course: Course) => void;
  onAddToCart?: (course: Course) => void;
  onWatchLesson?: (lessonId: string, courseId: string) => void;
  onNavigateBack?: () => void;
}

interface CurriculumModule {
  id: string;
  title: string;
  duration: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isPreview: boolean;
    hasPdf: boolean;
    pdfSize?: string;
  }[];
}

const SAMPLE_CURRICULUM: CurriculumModule[] = [
  {
    id: 'm1',
    title: 'الوحدة الأولى: المفاهيم التأسيسية ومنطق المنهج الوزاري الجديد',
    duration: '4 محاضرات • ساعتان و15 دقيقة',
    lessons: [
      {
        id: 'l1',
        title: 'المحاضرة 01: مقدمة التأسيس والمفاهيم الجوهرية واستراتيجيات الحل السريع',
        duration: '45 دقيقة',
        isPreview: true,
        hasPdf: true,
        pdfSize: '2.4 MB',
      },
      {
        id: 'l2',
        title: 'المحاضرة 02: التطبيقات المتقدمة وحل مسائل التفكير العليا ومسائل النماذج',
        duration: '50 دقيقة',
        isPreview: false,
        hasPdf: true,
        pdfSize: '3.1 MB',
      },
      {
        id: 'l3',
        title: 'المحاضرة 03: معسكر التدريب العملي والتطبيق على بنك الأسئلة الوزاري',
        duration: '40 دقيقة',
        isPreview: false,
        hasPdf: false,
      },
    ],
  },
  {
    id: 'm2',
    title: 'الوحدة الثانية: نماذج اختبارات قياس ونظام المسارات المعتمد',
    duration: '5 محاضرات • 3 ساعات و40 دقيقة',
    lessons: [
      {
        id: 'l4',
        title: 'المحاضرة 04: فك شفرات الأسئلة غير النمطية والتحليل المنطقي',
        duration: '55 دقيقة',
        isPreview: false,
        hasPdf: true,
        pdfSize: '4.2 MB',
      },
      {
        id: 'l5',
        title: 'المحاضرة 05: ورشة عمل تفاعلية مع المعلم وحل التمارين المباشرة',
        duration: '60 دقيقة',
        isPreview: false,
        hasPdf: true,
        pdfSize: '1.8 MB',
      },
      {
        id: 'l6',
        title: 'المحاضرة 06: الاختبار التقييمي الأسبوعي وتصحيح الأخطاء الشائعة',
        duration: '45 دقيقة',
        isPreview: false,
        hasPdf: false,
      },
    ],
  },
  {
    id: 'm3',
    title: 'الوحدة الثالثة: المراجعة النهائية والمعسكر الختامي والمحاكاة الوزارية',
    duration: '3 محاضرات • ساعتان و30 دقيقة',
    lessons: [
      {
        id: 'l7',
        title: 'المحاضرة 07: الخريطة الذهنية الشاملة لجميع محاور المنهج',
        duration: '50 دقيقة',
        isPreview: false,
        hasPdf: true,
        pdfSize: '5.6 MB',
      },
      {
        id: 'l8',
        title: 'المحاضرة 08: حل 100 سؤال متوقع في الاختبار النهائي بنظام البابل شيت',
        duration: '60 دقيقة',
        isPreview: false,
        hasPdf: true,
        pdfSize: '6.0 MB',
      },
    ],
  },
];

const REVIEWS = [
  {
    id: 'r1',
    author: 'سارة خالد العتيبي',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'منذ يومين',
    comment:
      'كورس استثنائي بمعنى الكلمة! أسلوب الشرح يربط المنهج بالاختبارات الوزارية وأسئلة قياس بطريقة عملية وسهلة. المذكرات المرفقة وفرت عليّ الكثير من وقت التلخيص.',
    helpfulCount: 24,
  },
  {
    id: 'r2',
    author: 'فيصل بن عبدالعزيز الدوسري',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'منذ أسبوع',
    comment:
      'التطبيقات التفاعلية وبنك الأسئلة المتدرج ساعدني أحصل على الدرجة الكاملة في الاختبار الشهري. منصة نوح أكاديمي الأفضل في مسارات الثانوي بلا منازع.',
    helpfulCount: 19,
  },
  {
    id: 'r3',
    author: 'ريناد محمد الغامدي',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 4.5,
    date: 'منذ أسبوعين',
    comment:
      'جودة الفيديو ممتازة والمشغل سلس وسريع بدون أي تقطيع. المعلم متجاوب جداً في خانة الاستفسارات الأكاديمية.',
    helpfulCount: 12,
  },
];

export default function CourseDetailPage({
  course: propCourse,
  currentTheme = 'warm-earth',
  currentUser,
  onEnroll,
  onAddToCart,
  onWatchLesson,
  onNavigateBack,
}: CourseDetailPageProps) {
  // Default to first mock course if none provided
  const course = propCourse || COURSES[0];
  const colors = getThemeColors(currentTheme);

  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleExpandAll = () => {
    setExpandedModules(SAMPLE_CURRICULUM.map((m) => m.id));
  };

  const handleCollapseAll = () => {
    setExpandedModules([]);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddCart = () => {
    setCartAdded(true);
    if (onAddToCart) onAddToCart(course);
    setTimeout(() => setCartAdded(false), 3000);
  };

  const discountPercent =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

  return (
    <div
      className="min-h-screen transition-colors duration-300 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-amber-300 selection:text-neutral-900"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6 font-ui text-xs text-neutral-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-1.5 text-neutral-800 dark:text-slate-200 font-bold hover:underline cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>العودة للكورسات</span>
            </button>
          )}
          <span>/</span>
          <span>{course.level}</span>
          <span>/</span>
          <span className="text-neutral-900 dark:text-slate-100 font-bold line-clamp-1">
            {course.title}
          </span>
        </div>

        {/* Share & Wishlist buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="مشاركة الكورس"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && <span className="text-[10px] text-emerald-500 font-bold">تم النسخ!</span>}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-full border transition-colors flex items-center justify-center cursor-pointer ${
              isSaved
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                : 'bg-black/5 dark:bg-white/5 border-neutral-300 dark:border-slate-700 text-neutral-700 dark:text-slate-200 hover:text-rose-500'
            }`}
            title="إضافة للمفضلة"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================== LEFT: MAIN COURSE DETAILS (8 Cols) ===================== */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Banner Section */}
          <div
            className="rounded-3xl p-6 sm:p-8 border shadow-xs relative overflow-hidden"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {course.level}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                {course.track}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {course.subject}
              </span>
              {course.starburstBadge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500 text-white shadow-xs">
                  {course.starburstBadge}
                </span>
              )}
            </div>

            {/* Course Title */}
            <h1 className="font-camel text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-slate-100 leading-tight mb-4">
              {course.title}
            </h1>

            {/* Course Description */}
            <p className="font-ui text-sm sm:text-base text-neutral-600 dark:text-slate-300 leading-relaxed mb-6 max-w-3xl">
              {course.description}
            </p>

            {/* Aggregate Ratings & Student Count */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t font-ui text-xs sm:text-sm" style={{ borderColor: colors.borderColor }}>
              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base">4.9</span>
                <span className="text-neutral-400 font-normal">(2,840 تقييم معتمد)</span>
              </div>

              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-slate-300">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">+14,200 طالب مسجل</span>
              </div>

              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>آخر تحديث: سبتمبر 2026 (دفعة المسارات)</span>
              </div>

              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-slate-300">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>اللغة: العربية (المنهج السعودي)</span>
              </div>
            </div>

            {/* Instructor Quick Card */}
            <div className="mt-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border flex items-center justify-between gap-4" style={{ borderColor: colors.borderColor }}>
              <div className="flex items-center gap-3">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                />
                <div>
                  <div className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100">
                    تقديم المعلم: {course.teacher.name}
                  </div>
                  <div className="font-ui text-xs text-neutral-500 dark:text-slate-400">
                    {course.teacher.role}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4" />
                <span>معلم موثق بنظام نوح</span>
              </div>
            </div>
          </div>

          {/* ===================== CURRICULUM ACCORDION SECTION ===================== */}
          <div
            className="rounded-3xl p-6 sm:p-8 border shadow-xs"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-camel text-xl sm:text-2xl font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  المنهاج الدراسي والمحاضرات (Curriculum)
                </h2>
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-slate-400 font-ui">
                  <span>{SAMPLE_CURRICULUM.length} وحدات تدريبية</span>
                  <span>•</span>
                  <span>
                    {SAMPLE_CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)} محاضرة
                  </span>
                  <span>•</span>
                  <span>إجمالي المدة: 8 ساعات و25 دقيقة</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-ui font-bold">
                <button
                  onClick={handleExpandAll}
                  className="px-3 py-1.5 rounded-full border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ borderColor: colors.borderColor }}
                >
                  توسيع الكل
                </button>
                <button
                  onClick={handleCollapseAll}
                  className="px-3 py-1.5 rounded-full border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ borderColor: colors.borderColor }}
                >
                  طيّ الكل
                </button>
              </div>
            </div>

            {/* Modules Accordion List */}
            <div className="space-y-4">
              {SAMPLE_CURRICULUM.map((mod, modIdx) => {
                const isExpanded = expandedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border overflow-hidden transition-all"
                    style={{ borderColor: colors.borderColor }}
                  >
                    {/* Module Accordion Header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-4 flex items-center justify-between text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{
                        backgroundColor: isExpanded
                          ? currentTheme === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(0,0,0,0.02)'
                          : colors.cardBg,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {modIdx + 1}
                        </div>
                        <div>
                          <h3 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100">
                            {mod.title}
                          </h3>
                          <span className="font-ui text-xs text-neutral-500 dark:text-slate-400">
                            {mod.duration}
                          </span>
                        </div>
                      </div>

                      <div className="p-1 rounded-full text-neutral-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Module Lessons Content */}
                    {isExpanded && (
                      <div className="border-t divide-y" style={{ borderColor: colors.borderColor }}>
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/2 dark:bg-white/2 hover:bg-amber-500/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  lesson.isPreview || isEnrolled
                                    ? 'bg-amber-400 text-neutral-950 cursor-pointer shadow-xs'
                                    : 'bg-black/5 dark:bg-white/10 text-neutral-400'
                                }`}
                                onClick={() => {
                                  if (lesson.isPreview || isEnrolled) {
                                    if (onWatchLesson) onWatchLesson(lesson.id, course.id);
                                    else setIsPreviewModalOpen(true);
                                  }
                                }}
                              >
                                {lesson.isPreview || isEnrolled ? (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5" />
                                )}
                              </div>

                              <div>
                                <div className="font-camel text-xs sm:text-sm font-bold text-neutral-900 dark:text-slate-100">
                                  {lesson.title}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-slate-400 font-ui mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-neutral-400" />
                                    {lesson.duration}
                                  </span>
                                  {lesson.isPreview && (
                                    <span className="text-emerald-500 font-bold bg-emerald-500/15 px-2 py-0.2 rounded-full border border-emerald-500/30">
                                      معاينة مجانية
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons for Lesson */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {lesson.hasPdf && (
                                <button
                                  onClick={() => alert(`جاري تنزيل ملف الشرح: ${lesson.title} (PDF)`)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-slate-300 hover:text-amber-500 border border-neutral-300 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3.5 h-3.5 text-amber-500" />
                                  <span>ملف PDF ({lesson.pdfSize})</span>
                                </button>
                              )}

                              {lesson.isPreview && (
                                <button
                                  onClick={() => {
                                    if (onWatchLesson) onWatchLesson(lesson.id, course.id);
                                    else setIsPreviewModalOpen(true);
                                  }}
                                  className="px-3 py-1 rounded-lg text-xs font-bold bg-neutral-900 dark:bg-slate-700 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>شاهد الآن</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================== INSTRUCTOR BIO & REVIEWS SECTION ===================== */}
          <div
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-8"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            {/* Instructor Deep Profile */}
            <div>
              <h2 className="font-camel text-xl sm:text-2xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
                عن المعلم المشرف
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div>
                  <h3 className="font-camel text-lg font-bold text-neutral-900 dark:text-slate-100">
                    {course.teacher.name}
                  </h3>
                  <p className="font-ui text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-semibold mb-2">
                    {course.teacher.role}
                  </p>
                  <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 leading-relaxed mb-4">
                    أكثر من 15 عاماً من الخبرة في تدريس المناهج الوزارية ونظام المسارات المعتمد في المملكة، والمشرف الأكاديمي على إعداد بنوك أسئلة قياس واختبارات التحصيلي للثانوية العامة. خرّج آلاف الطلاب الحاصلين على درجات الامتياز.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-ui font-semibold text-neutral-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      4.9 تقييم المعلم
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      +45,000 طالب متدرب
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      14 دورة تدريبية
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings & Star Breakdown */}
            <div className="pt-6 border-t" style={{ borderColor: colors.borderColor }}>
              <h3 className="font-camel text-lg font-bold text-neutral-900 dark:text-slate-100 mb-4">
                تقييمات وآراء الطلاب
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8">
                {/* Score Number Box */}
                <div className="md:col-span-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center flex flex-col items-center justify-center">
                  <span className="font-impact text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400">
                    4.9
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 my-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-ui text-xs text-neutral-600 dark:text-slate-400 font-semibold">
                    بناءً على 2,840 تقييماً حقيقياً
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="md:col-span-8 space-y-2 font-ui text-xs">
                  {[
                    { stars: 5, pct: 88, count: 2499 },
                    { stars: 4, pct: 9, count: 255 },
                    { stars: 3, pct: 2, count: 56 },
                    { stars: 2, pct: 0.5, count: 15 },
                    { stars: 1, pct: 0.5, count: 15 },
                  ].map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16 text-neutral-600 dark:text-slate-300 font-bold">
                        <span>{bar.stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-left text-neutral-400 text-[11px] font-mono">
                        {bar.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Review Cards */}
              <div className="space-y-4">
                {REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl border"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-9 h-9 rounded-full object-cover border"
                        />
                        <div>
                          <div className="font-camel text-xs sm:text-sm font-bold text-neutral-900 dark:text-slate-100">
                            {rev.author}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-ui">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(rev.rating) ? 'fill-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="font-ui text-xs sm:text-sm text-neutral-700 dark:text-slate-300 leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-ui">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount} طالباً وجدوا هذا التقييم مفيداً</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT: FLOATING STICKY PURCHASE CARD (4 Cols) ===================== */}
        <aside className="lg:col-span-4 sticky top-20 space-y-6">
          <div
            className="rounded-3xl border overflow-hidden shadow-xl"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            {/* Preview Video / Thumbnail */}
            <div
              onClick={() => setIsPreviewModalOpen(true)}
              className="relative aspect-video bg-neutral-950 flex items-center justify-center cursor-pointer group overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  course.bannerTheme === 'red-hex'
                    ? 'from-rose-950 via-neutral-900 to-amber-950'
                    : 'from-slate-900 via-indigo-950 to-neutral-950'
                } opacity-90 group-hover:scale-105 transition-transform duration-500`}
              />
              <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <span className="font-ui text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
                  شاهد العرض التعريفي المجاني
                </span>
              </div>
            </div>

            {/* Price & Purchase CTA */}
            <div className="p-5 sm:p-6">
              {/* Pricing Box */}
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b" style={{ borderColor: colors.borderColor }}>
                <div>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-semibold block mb-0.5">
                    سعر الاشتراك الكامل:
                  </span>
                  <div className="flex items-baseline gap-2" dir="rtl">
                    <span className="font-impact text-3xl sm:text-4xl font-black text-neutral-900 dark:text-slate-100">
                      {course.price}
                    </span>
                    <span className="font-ui text-sm font-bold text-neutral-600 dark:text-slate-400">
                      ريال سعودي
                    </span>
                    {course.originalPrice && (
                      <span className="font-ui text-sm text-neutral-400 line-through">
                        {course.originalPrice} ر.س
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <span className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                    وفّر {discountPercent}%
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {isEnrolled ? (
                  <button
                    onClick={() => onWatchLesson && onWatchLesson('l1', course.id)}
                    className="w-full py-3.5 rounded-full font-bold text-sm bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>متابعة المشاهدة (أنت مشترك)</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onEnroll && onEnroll(course)}
                      className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base text-white shadow-lg hover:shadow-xl transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
                      }}
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>اشترك الآن (دخول فوري)</span>
                    </button>

                    <button
                      onClick={handleAddCart}
                      className="w-full py-2.5 rounded-full font-bold text-xs sm:text-sm border transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                        backgroundColor: cartAdded ? 'rgba(16, 185, 129, 0.1)' : undefined,
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-500" />
                      <span>{cartAdded ? '✓ تمت الإضافة للسلة' : 'أضف إلى سلة المشتريات'}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Money-Back Guarantee Badge */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 mb-6 text-xs text-emerald-700 dark:text-emerald-400 font-ui font-semibold">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>ضمان استرجاع الرصيد 100% خلال 30 يوماً إن لم تحقق الاستفادة المرجوة.</span>
              </div>

              {/* Bulleted Perks */}
              <div className="space-y-3 font-ui text-xs text-neutral-700 dark:text-slate-300 border-t pt-5" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 mb-2">
                  يشمل هذا الكورس المميزات الآتية:
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>دخول كامل مدى الحياة مع تحديثات المنهج</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>شهادة إتمام معتمدة قابلة للتنزيل والمشاركة</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>18 مذكرة وملف PDF عالي الجودة للطباعة</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>إمكانية المتابعة عبر الجوال، الآيباد، وشاشات التلفزيون</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>دعم أكاديمي مباشر للإجابة على جميع الأسئلة</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== MOBILE STICKY BOTTOM BAR ===================== */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3.5 border-t backdrop-blur-md shadow-2xl flex items-center justify-between gap-4"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
        }}
      >
        <div>
          <span className="text-[10px] text-neutral-400 font-semibold block">سعر الكورس:</span>
          <div className="flex items-baseline gap-1" dir="rtl">
            <span className="font-impact text-xl font-bold text-neutral-900 dark:text-slate-100">
              {course.price}
            </span>
            <span className="font-ui text-xs font-bold text-neutral-500">ر.س</span>
          </div>
        </div>

        <button
          onClick={() => (onEnroll ? onEnroll(course) : setIsPreviewModalOpen(true))}
          className="flex-1 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary,
          }}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>اشترك الآن في الكورس</span>
        </button>
      </div>

      {/* ===================== VIDEO PREVIEW MODAL ===================== */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div
            className="w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl relative"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.borderColor }}>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-500 fill-current" />
                <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100">
                  معاينة الدرس الأول: {course.title}
                </h4>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-neutral-950 flex items-center justify-center">
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center mb-3 shadow-xl animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h5 className="font-camel text-white text-base font-bold mb-1">
                  البث التجريبي المباشر (1080p HD)
                </h5>
                <p className="font-ui text-xs text-neutral-400 max-w-sm mb-4">
                  استمتع بمشاهدة أول 15 دقيقة مجاناً واكتشف أسلوب الشرح التفاعلي مع المعلم {course.teacher.name}
                </p>
                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    if (onEnroll) onEnroll(course);
                  }}
                  className="px-6 py-2.5 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs shadow-md hover:scale-105 transition-all"
                >
                  الاشتراك لفتح جميع المحاضرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
