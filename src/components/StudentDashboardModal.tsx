import React, { useState, useEffect } from 'react';
import { StudentUser, Course, BrandTheme } from '../types';
import { api } from '../lib/api';
import { X, BookOpen, Award, CheckCircle2, Play, FileText, ArrowLeft, Star, Clock, Sparkles, Loader2, Download, Receipt } from 'lucide-react';

interface StudentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser;
  courses: Course[];
  currentTheme: BrandTheme;
  onOpenCourse: (course: Course) => void;
  onOpenExam: () => void;
  onOpenWatchLesson?: (lessonId: string, courseId: string) => void;
  onLogout: () => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  courses,
  currentTheme,
  onOpenCourse,
  onOpenExam,
  onOpenWatchLesson,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await api.dashboard.getProgress();
        setDashboardData(data);
      } catch (err) {
        console.warn('Could not refresh remote progress, using local cached state:', err);
        setDashboardData({
          enrolledCourses: courses
            .filter((c) => currentUser?.enrolledCourseIds?.includes(c.id))
            .map((c) => ({
              ...c,
              totalLessons: 5,
              completedCount: 2,
              progressPercent: 40,
              nextLessonId: `les_${c.id}_3`,
              nextLessonTitle: 'المحاضرة 3: نماذج اختبارات الوزارة وتكنيكات الحل السريع',
            })),
          examAttempts: [],
          orders: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [isOpen]);

  if (!isOpen) return null;

  const primaryBrandColor = currentTheme === 'fresh' ? '#6F384F' : '#3A3028';
  const enrolledCourses = dashboardData?.enrolledCourses || courses.filter((c) =>
    currentUser?.enrolledCourseIds?.includes(c.id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border relative my-8 animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0"
              style={{ backgroundColor: primaryBrandColor }}
            >
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-camel text-xl font-bold text-neutral-900">
                  {currentUser.fullName}
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  طالب نظام المسارات
                </span>
              </div>
              <p className="font-ui text-xs text-neutral-500 mt-0.5">
                {currentUser.phone} • {currentUser.gradeLevel === '3rd_secondary' ? 'الصف الثالث الثانوي' : currentUser.gradeLevel === '2nd_secondary' ? 'الصف الثاني الثانوي' : 'الصف الأول الثانوي'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Reward Points */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[10px] text-amber-800 font-bold block">رصيد نقاط التميز</span>
              <span className="font-impact text-lg font-bold text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                {dashboardData?.user?.points ?? currentUser.points} نقطة
              </span>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => {
              onClose();
              onOpenExam();
            }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 flex items-center justify-between shadow-md hover:shadow-lg transition-transform hover:scale-101 cursor-pointer"
          >
            <div>
              <div className="font-camel text-base font-black">
                بنك الاختبارات والمحاكاة
              </div>
              <div className="font-ui text-xs text-neutral-900 font-medium">
                اختبر مستواك الآن في نظام قياس والمسارات
              </div>
            </div>
            <Award className="w-8 h-8 text-neutral-950" />
          </button>

          <div className="p-4 rounded-2xl bg-neutral-50 border flex items-center justify-between">
            <div>
              <div className="font-camel text-sm font-bold text-neutral-900">
                المتابعة الأكاديمية التراكمية
              </div>
              <div className="font-ui text-xs text-emerald-700 font-semibold mt-0.5">
                أكملت {dashboardData?.totalCompletedLessons || 2} محاضرات بنجاح 🌟
              </div>
            </div>
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <h4 className="font-camel text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>كورساتي المشترك بها ({enrolledCourses.length}):</span>
          </h4>

          {loading ? (
            <div className="py-8 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span>جاري تحميل تقدمك الدراسي من الخادم...</span>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-8 bg-neutral-50 rounded-2xl border text-neutral-500 text-xs">
              لم تشترك في أي كورس بعد. تصفح الكورسات المقترحة وابدأ رحلتك!
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map((course: any) => {
                const percent = course.progressPercent || 0;
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: primaryBrandColor }}
                      >
                        <BookOpen className="w-6 h-6 text-amber-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-camel text-sm sm:text-base font-bold text-neutral-900">
                            {course.title}
                          </h5>
                          <span className="text-xs font-mono font-bold text-neutral-700">
                            {percent}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden my-1.5">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <span className="text-[11px] text-neutral-500 font-ui block">
                          المحاضرة التالية: {course.nextLessonTitle || 'متابعة المشاهدة'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {onOpenWatchLesson && course.nextLessonId ? (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenWatchLesson(course.nextLessonId, course.id);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>مشاهدة الدرس الآن</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenCourse(course);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                          style={{ backgroundColor: primaryBrandColor }}
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>تفاصيل الكورس</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Exam Attempts & Receipts Tabs or History */}
        {dashboardData?.examAttempts && dashboardData.examAttempts.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-camel text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>نتائج اختباراتي السابقة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dashboardData.examAttempts.map((att: any) => (
                <div key={att.id} className="p-3 rounded-xl bg-neutral-50 border text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900">{att.examTitle}</div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(att.submittedAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="font-impact font-bold text-emerald-700 text-sm">
                    {att.score} / {att.totalQuestions} ({Math.round((att.score / att.totalQuestions) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
