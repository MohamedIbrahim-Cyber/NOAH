import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Settings,
  Edit,
  Play,
  CheckCircle2,
  Download,
  Share2,
  Lock,
  Bell,
  Globe,
  Camera,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Check,
  X,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { BrandTheme, StudentUser, Course } from '../../types';
import { COURSES } from '../../data/mockData';
import { getThemeColors } from '../../lib/theme';

export interface ProfilePageProps {
  currentUser?: StudentUser | null;
  currentTheme?: BrandTheme;
  onOpenWatchLesson?: (lessonId: string, courseId: string) => void;
  onOpenCourseDetail?: (course: Course) => void;
  onNavigateHome?: () => void;
  onUpdateUser?: (updated: Partial<StudentUser>) => void;
  onLogout?: () => void;
}

interface EnrolledCourseProgress {
  course: Course;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonTitle: string;
  lastLessonId: string;
}

interface CertificateItem {
  id: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  grade: string;
  credentialId: string;
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    courseTitle: 'الصف الأول الثانوي – أساسيات البرمجة والتفكير الحاسوبي',
    instructorName: 'م/ محمد القاضي',
    issueDate: '15 أغسطس 2026',
    grade: 'ممتاز مرتفع (A+)',
    credentialId: 'NOHE-2026-CS-8921',
  },
  {
    id: 'cert-2',
    courseTitle: 'معسكر النحو الشامل والإعراب من البداية حتى الإتقان',
    instructorName: 'أ/ محمود عبداللطيف',
    issueDate: '01 يوليو 2026',
    grade: 'ممتاز (A)',
    credentialId: 'NOHE-2026-AR-4412',
  },
];

const BADGES = [
  {
    id: 'b1',
    title: 'المثابر الأكاديمي',
    desc: 'إكمال 10 محاضرات متتالية دون انقطاع',
    icon: '🔥',
    unlocked: true,
  },
  {
    id: 'b2',
    title: 'فارس الاختبارات',
    desc: 'الحصول على درجة 100% في الاختبار التجريبي',
    icon: '🏆',
    unlocked: true,
  },
  {
    id: 'b3',
    title: 'عبقري البلاغة والنحو',
    desc: 'حل 50 مسألة نحوية متقدمة في بنك الأسئلة',
    icon: '📜',
    unlocked: true,
  },
  {
    id: 'b4',
    title: 'سفير المعرفة',
    desc: 'دعوة 3 زملاء للاشتراك في منصة نوح',
    icon: '⭐',
    unlocked: false,
  },
];

export default function StudentProfilePage({
  currentUser: propUser,
  currentTheme = 'warm-earth',
  onOpenWatchLesson,
  onOpenCourseDetail,
  onNavigateHome,
  onUpdateUser,
  onLogout,
}: ProfilePageProps) {
  const colors = getThemeColors(currentTheme);

  // Default demo user if none passed
  const [user, setUser] = useState<StudentUser>(
    propUser || {
      id: 'usr_demo_1',
      fullName: 'عبدالله بن راشد الشمري',
      phone: '0558924110',
      email: 'abdullah@noheacademy.sa',
      gradeLevel: '3rd_secondary',
      track: 'computing_engineering',
      enrolledCourseIds: ['c1', 'c2', 'c3'],
      points: 480,
      role: 'admin',
    }
  );

  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState<'learning' | 'certificates' | 'settings' | 'admin_overview'>(
    isAdmin ? 'admin_overview' : 'learning'
  );
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateItem | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsReminders: true,
    weeklyReport: true,
    promotions: false,
  });

  // Password state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  });

  const enrolledProgressList: EnrolledCourseProgress[] = (user.enrolledCourseIds || ['c1', 'c2'])
    .map((id, idx) => {
      const c = COURSES.find((item) => item.id === id) || COURSES[idx % COURSES.length];
      const progressPercent = idx === 0 ? 68 : idx === 1 ? 42 : 15;
      const completed = Math.round((progressPercent / 100) * c.lecturesCount);
      return {
        course: c,
        progressPercent,
        completedLessons: completed,
        totalLessons: c.lecturesCount,
        lastLessonTitle: 'المحاضرة 03: التطبيقات المتقدمة وحل مسائل التفكير العليا',
        lastLessonId: `l${idx + 1}`,
      };
    });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone,
    };
    setUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditProfileOpen(false);
    showToast('تم تحديث بيانات الملف الشخصي بنجاح ✓');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ تفضيلات الإشعارات والأمان بنجاح ✓');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('تم تحديث كلمة المرور بنجاح ✓');
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-amber-300 selection:text-neutral-900"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* ===================== PROFILE HEADER CARD ===================== */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-xs mb-8 relative overflow-hidden"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-3xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-2xl sm:text-3xl border-4 border-white/20 shadow-xl overflow-hidden">
                {user.fullName.charAt(0)}
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute bottom-0 left-0 p-1.5 rounded-full bg-neutral-900 text-white hover:bg-amber-400 hover:text-neutral-950 transition-colors shadow"
                title="تغيير الصورة"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="font-camel text-xl sm:text-2xl font-black text-neutral-900 dark:text-slate-100">
                  {user.fullName}
                </h1>
                {isAdmin ? (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مدير النظام العام (Super Admin)</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    طالب متميز 🎓
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-ui text-neutral-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  عضو منذ: 2024
                </span>
              </div>

              {isAdmin ? (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-ui font-semibold">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    الرتبة: مدير تنفيذي للمنصة
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    الصلاحيات: تحكم إداري كامل (Full Access)
                  </span>
                </div>
              ) : (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-ui font-semibold">
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-600 dark:text-sky-400">
                    الصف الثالث الثانوي
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
                    مسار الحوسبة والهندسة
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics / Points & Edit Button */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0" style={{ borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center min-w-24">
                    <span className="font-impact text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 block">
                      مدير عام
                    </span>
                    <span className="font-ui text-[10px] text-neutral-500 dark:text-slate-400 font-bold">
                      بوابة الإدارة
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-center min-w-24">
                    <span className="font-impact text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block">
                      نشط 100%
                    </span>
                    <span className="font-ui text-[10px] text-neutral-500 dark:text-slate-400 font-bold">
                      حالة الصلاحية
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center min-w-24">
                    <span className="font-impact text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 block">
                      {user.points}
                    </span>
                    <span className="font-ui text-[10px] text-neutral-500 dark:text-slate-400 font-bold">
                      نقطة تفاعل (XP)
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-center min-w-24">
                    <span className="font-impact text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                      {enrolledProgressList.length}
                    </span>
                    <span className="font-ui text-[10px] text-neutral-500 dark:text-slate-400 font-bold">
                      كورسات مسجلة
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 rounded-full border text-xs font-bold font-ui hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer"
                style={{ borderColor: colors.borderColor }}
              >
                <Edit className="w-3.5 h-3.5 text-amber-500" />
                <span>تعديل البيانات</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="px-3 py-2 rounded-full border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-xs font-bold font-ui flex items-center gap-1 cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== TAB NAVIGATION BAR ===================== */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b font-ui text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none" style={{ borderColor: colors.borderColor }}>
        {isAdmin ? (
          <>
            <button
              onClick={() => setActiveTab('admin_overview')}
              className={`px-4 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'admin_overview'
                  ? 'bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>الصلاحيات ولوحة الإدارة</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-slate-400'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات الحساب والأمان</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'learning'
                  ? 'bg-neutral-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>مقرراتي ودراستي ({enrolledProgressList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-neutral-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-slate-400'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>الشهادات والأوسمة ({CERTIFICATES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-slate-400'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات الحساب والأمان</span>
            </button>
          </>
        )}
      </div>

      {/* ===================== ADMIN OVERVIEW TAB ===================== */}
      {isAdmin && activeTab === 'admin_overview' && (
        <div className="space-y-6">
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-xs"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b mb-6" style={{ borderColor: colors.borderColor }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-camel text-lg sm:text-xl font-black text-neutral-900 dark:text-slate-100">
                    بوابة الإدارة العامة والتحكم المركزي
                  </h2>
                  <p className="text-xs font-ui text-neutral-500 dark:text-slate-400 mt-0.5">
                    حسابك يملك أعلى رتبة إدارية مع صلاحيات كاملة لإدارة المنصة والكادر التعليمي والمقررات
                  </p>
                </div>
              </div>

              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm font-ui shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>الدخول إلى لوحة تحكم الإدارة</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Admin Capabilities Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-ui text-xs">
              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  إدارة الكورسات والمحاضرات
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  إضافة وتعديل وحذف المقررات، رفع المحاضرات ومذكرات الـ PDF، وتحديد الأسعار والمسارات الأكاديمية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  توزيع أرباح المعلمين (70% - 30%)
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  حساب نسب أرباح المعلمين تلقائياً وصرف المستحقات مع تقارير مالية تفصيلية لكل معلم.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  إدارة وتوليد أكواد الخصم
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  إنشاء كوبونات الخصم بنسب مئوية أو مبالغ ثابتة مع تحديد صلاحية الاستخدام وربطها بالمعلمين.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  صلاحيات المعلمين والمساعدين (RBAC)
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  تعيين حسابات المعلمين وإسناد المساعدين لكل معلم مع عزل تام للبيانات المالية عن المساعدين.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  سيرفرات وبث Bunny.net
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  تكامل مكتبات الفيديو السحابية عبر Bunny Stream لحماية المحتوى ومنع التحميل غير المصرح به.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border" style={{ borderColor: colors.borderColor }}>
                <div className="font-bold text-neutral-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  التقارير وسجلات الطلاب
                </div>
                <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
                  متابعة عمليات الشراء والدفع عبر ميسر/هايبرباي، وتتبع أداء واشتراكات الطلاب بجميع المقررات.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 1: MY LEARNING ===================== */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledProgressList.map((item) => (
              <div
                key={item.course.id}
                className="rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                {/* Course Header Banner */}
                <div className="p-4 sm:p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {item.course.level}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-impact">
                      {item.progressPercent}% مكتمل
                    </span>
                  </div>

                  <h3 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 line-clamp-2 mb-2">
                    {item.course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-ui text-neutral-500 dark:text-slate-400 mb-4">
                    <img
                      src={item.course.teacher.avatar}
                      alt={item.course.teacher.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>المعلم: {item.course.teacher.name}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-slate-400 font-ui">
                      <span>{item.completedLessons} من {item.totalLessons} محاضرات</span>
                      <span>باقي {item.totalLessons - item.completedLessons} محاضرات</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 border-t bg-black/2 dark:bg-white/2 flex items-center justify-between gap-3" style={{ borderColor: colors.borderColor }}>
                  <button
                    onClick={() => {
                      if (onOpenCourseDetail) onOpenCourseDetail(item.course);
                    }}
                    className="text-xs font-bold text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
                  >
                    تفاصيل الكورس
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenWatchLesson) onOpenWatchLesson(item.lastLessonId, item.course.id);
                    }}
                    className="px-4 py-2 rounded-full font-bold text-xs text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>استئناف المشاهدة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: CERTIFICATES & BADGES ===================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-8">
          {/* Certificates Section */}
          <div>
            <h2 className="font-camel text-lg font-bold text-neutral-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>شهادات التخرج والاجتياز المعتمدة</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl border shadow-xs relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-ui text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {cert.grade}
                      </span>
                      <span className="font-mono text-xs text-neutral-400">
                        {cert.credentialId}
                      </span>
                    </div>

                    <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100 mb-2">
                      {cert.courseTitle}
                    </h3>
                    <p className="font-ui text-xs text-neutral-500 dark:text-slate-400 mb-4">
                      المعلم المشرف: {cert.instructorName} • تاريخ الإصدار: {cert.issueDate}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: colors.borderColor }}>
                    <button
                      onClick={() => setSelectedCertForModal(cert)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>معاينة الشهادة</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => showToast(`جاري تنزيل شهادة: ${cert.courseTitle} (PDF)`)}
                      className="px-4 py-2 rounded-full border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                      style={{ borderColor: colors.borderColor }}
                    >
                      <Download className="w-3.5 h-3.5 text-amber-500" />
                      <span>تحميل PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Achievements Section */}
          <div className="pt-6 border-t" style={{ borderColor: colors.borderColor }}>
            <h2 className="font-camel text-lg font-bold text-neutral-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>أوسمة التميز والإنجازات الأكاديمية</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BADGES.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    b.unlocked ? '' : 'opacity-50 grayscale'
                  }`}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                  }}
                >
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100 mb-1">
                    {b.title}
                  </h4>
                  <p className="font-ui text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
                    {b.desc}
                  </p>
                  <span
                    className={`mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.unlocked
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-neutral-200 dark:bg-slate-800 text-neutral-500'
                    }`}
                  >
                    {b.unlocked ? '✓ تم الفتح' : '🔒 قيد الإنجاز'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: ACCOUNT SETTINGS ===================== */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Notifications Form */}
          <form
            onSubmit={handleSaveSettings}
            className="p-6 rounded-3xl border shadow-xs space-y-6"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center gap-2 pb-4 border-b" style={{ borderColor: colors.borderColor }}>
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100">
                تفضيلات الإشعارات والتنبيهات
              </h3>
            </div>

            <div className="space-y-4 font-ui text-xs">
              {[
                { key: 'emailAlerts', title: 'إشعارات البريد الإلكتروني', desc: 'تنبيهك فور رفع محاضرات ومذكرات جديدة بالمقررات المشترك بها.' },
                { key: 'smsReminders', title: 'رسائل الجوال النصية (SMS)', desc: 'تذكير بمواعيد الاختبارات الدورية وحصص البث المباشر.' },
                { key: 'weeklyReport', title: 'تقرير الإنجاز الأسبوعي', desc: 'ملخص أسبوعي بعدد الساعات ونسبة التقدم في مسارك الثانوي.' },
                { key: 'promotions', title: 'العروض وكوبونات الخصم', desc: 'إشعارك بالعروض الحصرية وباقات الكومبو التوفيرية.' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-black/2 dark:bg-white/2 cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-slate-100">{item.title}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={(settings as any)[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 mt-1 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full font-bold text-xs bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-xs cursor-pointer"
            >
              حفظ تفضيلات الإشعارات
            </button>
          </form>

          {/* Change Password & Connected Accounts */}
          <div className="space-y-8">
            {/* Password Form */}
            <form
              onSubmit={handleSavePassword}
              className="p-6 rounded-3xl border shadow-xs space-y-4 text-xs font-ui"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <div className="flex items-center gap-2 pb-4 border-b" style={{ borderColor: colors.borderColor }}>
                <Lock className="w-5 h-5 text-amber-500" />
                <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100">
                  تغيير كلمة المرور
                </h3>
              </div>

              <div>
                <label className="block font-bold mb-1.5">كلمة المرور الحالية</label>
                <input
                  type="password"
                  required
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  style={{
                    backgroundColor: colors.canvasBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    style={{
                      backgroundColor: colors.canvasBg,
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1.5">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    style={{
                      backgroundColor: colors.canvasBg,
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full font-bold text-xs bg-neutral-900 dark:bg-slate-700 text-white hover:bg-neutral-800 shadow-xs cursor-pointer"
              >
                تحديث كلمة المرور
              </button>
            </form>

            {/* Connected Social Accounts */}
            <div
              className="p-6 rounded-3xl border shadow-xs space-y-4"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100">
                الحسابات المرتبطة للدخول السريع
              </h4>
              <div className="space-y-3 font-ui text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/2 dark:bg-white/2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-red-500/15 text-red-500 font-bold flex items-center justify-center">
                      G
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-slate-200">
                      حساب Google ({user.email})
                    </span>
                  </div>
                  <span className="text-emerald-500 font-bold text-[11px]">متصل ✓</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/2 dark:bg-white/2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 text-neutral-700 dark:text-slate-200 font-bold flex items-center justify-center">
                      🍎
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-slate-200">
                      حساب Apple ID
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('تم ربط حساب Apple ID بنجاح ✓')}
                    className="text-amber-600 dark:text-amber-400 font-bold text-[11px] hover:underline cursor-pointer"
                  >
                    ربط الحساب
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone: Sign-Out */}
            <div
              className="p-6 rounded-3xl border border-rose-500/30 shadow-xs space-y-4"
              style={{
                backgroundColor: currentTheme === 'dark' ? 'rgba(58, 48, 40, 0.4)' : '#FFF5F5',
              }}
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-rose-500" />
                <h4 className="font-camel text-sm font-bold text-rose-600 dark:text-rose-400">
                  إدارة الجلسة وتسجيل الخروج
                </h4>
              </div>
              <p className="font-ui text-xs text-neutral-600 dark:text-[#E8D9C0] leading-relaxed">
                سيؤدي تسجيل الخروج إلى إنهاء جلستك الحالية على هذا المتصفح. يمكنك العودة وتسجيل الدخول في أي وقت باستخدام بريدك أو رقم جوالك.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  if (onNavigateHome) onNavigateHome();
                }}
                className="w-full py-3 rounded-full font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT PROFILE MODAL ===================== */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 text-right my-auto"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
              color: colors.textPrimary,
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: colors.borderColor }}>
              <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100">
                تعديل بيانات الحساب
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-ui">
              <div>
                <label className="block font-bold mb-1.5">الاسم الثلاثي الكامل *</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  style={{
                    backgroundColor: colors.canvasBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  style={{
                    backgroundColor: colors.canvasBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5">رقم الجوال (واتساب) *</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  style={{
                    backgroundColor: colors.canvasBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: colors.borderColor }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-5 py-2 rounded-full border text-neutral-600 dark:text-slate-300"
                  style={{ borderColor: colors.borderColor }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== CERTIFICATE PREVIEW MODAL ===================== */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 relative text-center"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
              color: colors.textPrimary,
            }}
          >
            <button
              onClick={() => setSelectedCertForModal(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-black/5 dark:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-amber-400/40 rounded-2xl p-6 sm:p-8 bg-amber-500/5">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <span className="font-ui text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">
                منصة نوح أكاديمي للتعليم الثانوي
              </span>
              <h3 className="font-camel text-2xl font-black text-neutral-900 dark:text-slate-100 mb-4">
                شهادة إتمام واجتياز مقرر دراسي
              </h3>

              <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mb-2">
                تشهد إدارة الأكاديمية بأن الطالب المتميز:
              </p>
              <h4 className="font-camel text-xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
                {user.fullName}
              </h4>

              <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mb-6 leading-relaxed">
                قد أتم بنجاح متطلبات مقرر: <strong>{selectedCertForModal.courseTitle}</strong> تحت إشراف {selectedCertForModal.instructorName} بتقدير عام {selectedCertForModal.grade}.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-400/30 text-xs font-ui">
                <span className="font-mono text-neutral-400">
                  رمز التحقق: {selectedCertForModal.credentialId}
                </span>
                <span className="font-bold text-neutral-700 dark:text-slate-300">
                  تاريخ الاعتماد: {selectedCertForModal.issueDate}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  showToast('جاري تجهيز وتنزيل ملف الشهادة عالي الجودة...');
                  setSelectedCertForModal(null);
                }}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الشهادة بصيغة PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
