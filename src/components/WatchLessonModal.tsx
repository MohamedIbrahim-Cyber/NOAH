import React, { useState, useEffect } from 'react';
import { BrandTheme, StudentUser, Lesson, SignedVideoToken } from '../types';
import { api } from '../lib/api';
import { getThemeColors } from '../lib/theme';
import { Play, CheckCircle2, Lock, Download, FileText, ArrowRight, ShieldAlert, Sparkles, X, Volume2, Clock } from 'lucide-react';

interface WatchLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string | null;
  courseId: string;
  currentTheme: BrandTheme;
  currentUser: StudentUser | null;
  onOpenCheckout: (courseId: string) => void;
  onProgressUpdated?: () => void;
}

export const WatchLessonModal: React.FC<WatchLessonModalProps> = ({
  isOpen,
  onClose,
  lessonId,
  courseId,
  currentTheme,
  currentUser,
  onOpenCheckout,
  onProgressUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<SignedVideoToken | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [courseLessons, setCourseLessons] = useState<(Lesson & { isLocked?: boolean; completed?: boolean })[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '25%' });

  const colors = getThemeColors(currentTheme);

  // Shift watermark periodically to defeat screen recording
  useEffect(() => {
    const interval = setInterval(() => {
      const top = `${15 + Math.floor(Math.random() * 65)}%`;
      const left = `${10 + Math.floor(Math.random() * 70)}%`;
      setWatermarkPos({ top, left });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Fetch course lessons & video token
  useEffect(() => {
    if (!isOpen || !courseId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.courses.getLessons(courseId);
        setCourseLessons(res.lessons || []);

        const targetId = lessonId || (res.lessons && res.lessons[0]?.id);
        if (targetId) {
          loadLessonToken(targetId);
        }
      } catch (err: any) {
        setError(err.message || 'فشل تحميل بيانات المحاضرة');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, courseId, lessonId]);

  const loadLessonToken = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.courses.getVideoToken(id);
      setTokenData(res.token);
      setActiveLesson(res.lesson);
      setIsCompleted(false);
    } catch (err: any) {
      setError(err.message || 'المحتوى مقفل للمشتركين فقط');
      setTokenData(null);
      const target = courseLessons.find((l) => l.id === id);
      if (target) setActiveLesson(target);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || isCompleted) return;
    try {
      await api.courses.markLessonComplete(activeLesson.id);
      setIsCompleted(true);
      setCourseLessons((prev) =>
        prev.map((l) => (l.id === activeLesson.id ? { ...l, completed: true } : l))
      );
      if (onProgressUpdated) onProgressUpdated();
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div
        className="w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border transition-all"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
          color: colors.textPrimary,
        }}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b flex items-center justify-between gap-4 shrink-0" style={{ borderColor: colors.borderColor }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
            >
              <Play className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-camel text-base sm:text-lg font-bold text-neutral-900 dark:text-slate-100 line-clamp-1">
                {activeLesson ? activeLesson.title : 'مشغل المحاضرات المشفرة'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-slate-400 font-ui">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  {activeLesson ? `${Math.round(activeLesson.durationSeconds / 60)} دقيقة` : '45 دقيقة'}
                </span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> جودة 1080p مانعة للتسجيل
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-neutral-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Main Video Area (8 Cols) */}
          <div className="lg:col-span-8 p-3 sm:p-6 flex flex-col justify-between bg-black/5 dark:bg-black/20">
            {error ? (
              // Locked State with purchase CTA
              <div className="aspect-video w-full rounded-2xl bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/40">
                  <Lock className="w-7 sm:w-8 h-7 sm:h-8" />
                </div>
                <h3 className="font-camel text-lg sm:text-xl font-bold mb-2">المحاضرة مقفلة للمشتركين</h3>
                <p className="font-ui text-xs sm:text-sm text-neutral-300 max-w-md mb-5 sm:mb-6 leading-relaxed">
                  {error}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCheckout(courseId);
                    }}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-neutral-900 shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#F5D278' }}
                  >
                    <span>الاشتراك في الكورس (خصم 20% بكود NOHE2026)</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            ) : (
              // Video Player with Dynamic Anti-Piracy Watermark
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 shadow-lg border border-black/20 flex items-center justify-center select-none group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"
                    alt="Lesson preview"
                    className="w-full h-full object-cover opacity-35 filter blur-xs"
                  />
                  <div className="absolute flex flex-col items-center gap-3 pointer-events-none">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-amber-400/90 text-neutral-950 flex items-center justify-center shadow-2xl pl-1 animate-pulse">
                      <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current" />
                    </div>
                    <span className="bg-black/70 text-white font-ui text-xs px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
                      بث مباشر محمي من Bunny.net / Cloudflare Stream
                    </span>
                  </div>
                </div>

                {/* ANTI-PIRACY DYNAMIC WATERMARK OVERLAY */}
                {tokenData && (
                  <div
                    className="absolute pointer-events-none transition-all duration-1000 ease-in-out opacity-45 select-none"
                    style={{
                      top: watermarkPos.top,
                      left: watermarkPos.left,
                    }}
                  >
                    <div className="bg-black/60 text-amber-200 font-ui text-[11px] px-3 py-1 rounded-md border border-amber-400/30 shadow tracking-wider whitespace-nowrap">
                      🛡️ {tokenData.watermarkText}
                    </div>
                  </div>
                )}

                {/* Player Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between text-white text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] text-neutral-300">14:20 / 45:00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                      1080p HD
                    </span>
                    <span className="text-neutral-400 text-[10px]">رمز الحماية: {tokenData?.token ? '✓ موثق' : 'تجريبي'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Action Controls */}
            <div
              className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <div>
                <h4 className="font-camel text-xs sm:text-sm font-bold text-neutral-900 dark:text-slate-100">
                  {activeLesson?.title}
                </h4>
                <p className="font-ui text-xs text-neutral-500 dark:text-slate-400">
                  أنهِ مشاهدة المحاضرة وحل التكليف لتحصل على نقاط إضافية في رصيدك.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCompleteLesson}
                  disabled={isCompleted || !currentUser}
                  className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-900 dark:bg-slate-700 text-white hover:bg-neutral-800 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'تم إكمال المحاضرة (+10 نقاط) ✓' : 'تحديد كمكتمل'}</span>
                </button>
              </div>
            </div>

            {/* Lesson Attachments & PDF Notes */}
            {activeLesson?.attachmentUrls && activeLesson.attachmentUrls.length > 0 && (
              <div
                className="mt-4 p-4 rounded-2xl border text-right"
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#1E293B' : '#FEF3C7',
                  borderColor: colors.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span className="font-camel text-xs font-bold text-amber-900 dark:text-amber-400">
                    المذكرات وملفات الشرح المرفقة مع هذا الدرس:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.attachmentUrls.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border flex items-center justify-between hover:shadow-md transition-all text-neutral-800 dark:text-slate-200 text-xs font-semibold group"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.borderColor,
                      }}
                    >
                      <div className="flex items-center gap-2 line-clamp-1">
                        <Download className="w-3.5 h-3.5 text-amber-500 group-hover:translate-y-0.5 transition-transform" />
                        <span className="line-clamp-1">{att.title}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 shrink-0 font-mono">{att.size}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Course Lessons Playlist (4 Cols) */}
          <div
            className="lg:col-span-4 p-4 sm:p-6 border-t lg:border-t-0 lg:border-r flex flex-col justify-between"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: currentTheme === 'dark' ? '#0B1120' : 'rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100">
                  فهرس محاضرات الكورس
                </h3>
                <span className="text-xs font-bold font-ui px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-slate-800 text-neutral-700 dark:text-slate-300">
                  {courseLessons.length} محاضرات
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {courseLessons.map((l, idx) => {
                  const isActive = activeLesson?.id === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => loadLessonToken(l.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-right ${
                        isActive
                          ? 'border-amber-400 bg-amber-500/10 shadow-xs'
                          : 'hover:border-neutral-400'
                      }`}
                      style={{
                        backgroundColor: isActive ? undefined : colors.cardBg,
                        borderColor: isActive ? '#F59E0B' : colors.borderColor,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            l.completed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isActive
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-400'
                          }`}
                        >
                          {l.completed ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="font-camel text-xs font-bold text-neutral-900 dark:text-slate-100 line-clamp-1">
                            {l.title}
                          </div>
                          <div className="font-ui text-[11px] text-neutral-500 dark:text-slate-400">
                            {Math.round(l.durationSeconds / 60)} دقيقة
                          </div>
                        </div>
                      </div>

                      {l.isLocked ? (
                        <span className="text-neutral-400 p-1" title="مغلق للمشتركين">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : l.isPreview ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                          مجاني
                        </span>
                      ) : (
                        <span className="text-amber-500 p-1">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div
              className="mt-6 p-4 rounded-2xl border text-right"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                <span className="font-camel text-xs font-bold text-neutral-900 dark:text-slate-100">
                  حماية حقوق المعلم
                </span>
              </div>
              <p className="font-ui text-[11px] text-neutral-500 dark:text-slate-400 leading-relaxed">
                جميع المحاضرات مشفرة وموسومة بعلامة مائية ديناميكية مخصصة لكل طالب لمنع إعادة البيع وحفظ الأمانة الأكاديمية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
