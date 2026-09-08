import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Download,
  X,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckSquare,
  Square,
  Percent,
  Tag,
  Wallet,
  UserCheck,
  UserPlus,
  Lock,
  ChevronDown,
  ArrowLeft,
  Video,
  FileText,
  BadgePercent,
  Coins,
  Send,
  UserCog,
  Sun,
  Moon,
  LogOut,
  User,
} from 'lucide-react';
import { BrandTheme, StudentUser, Course, DiscountCode, StaffAccount } from '../../types';
import { COURSES } from '../../data/mockData';
import { INITIAL_STAFF_ACCOUNTS, INITIAL_DISCOUNT_CODES } from '../../data/adminData';
import { getThemeColors } from '../../lib/theme';

export interface AdminPageProps {
  currentTheme?: BrandTheme;
  currentUser?: StudentUser | null;
  onPreviewCourse?: (course: Course) => void;
  onNavigateHome?: () => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  onNavigateProfile?: () => void;
}

interface AdminCourseRow {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  enrolledStudents: number;
  price: number;
  status: 'published' | 'draft' | 'archived';
  category: string;
  level: string;
  createdAt: string;
  rating: number;
  bunnyLibraryId?: string;
  bunnyVideoId?: string;
  bunnyStreamUrl?: string;
}

const INITIAL_ADMIN_COURSES: AdminCourseRow[] = [
  {
    id: 'c1',
    title: 'الصف الثالث الثانوي – لغة عربية شاملة وبلاغة ونحو',
    instructor: 'أ/ محمود عبداللطيف',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 4820,
    price: 300,
    status: 'published',
    category: 'اللغة العربية',
    level: 'الصف الثالث الثانوي',
    createdAt: '2026-08-15',
    rating: 4.9,
    bunnyLibraryId: '248190',
    bunnyVideoId: 'd719e8a2-9b2f-4c89-a1b4-8e12f5a67890',
    bunnyStreamUrl: 'https://iframe.mediadelivery.net/embed/248190/d719e8a2-9b2f-4c89-a1b4-8e12f5a67890',
  },
  {
    id: 'c2',
    title: 'الصف الثاني الثانوي – مسار الحوسبة والهندسة (بايثون وذكاء اصطناعي)',
    instructor: 'م/ محمد القاضي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 3410,
    price: 280,
    status: 'published',
    category: 'البرمجة والذكاء الاصطناعي',
    level: 'الصف الثاني الثانوي',
    createdAt: '2026-08-20',
    rating: 4.8,
    bunnyLibraryId: '248190',
    bunnyVideoId: 'f930a1c3-8e41-4b11-92b1-12f3456789ab',
    bunnyStreamUrl: 'https://iframe.mediadelivery.net/embed/248190/f930a1c3-8e41-4b11-92b1-12f3456789ab',
  },
  {
    id: 'c3',
    title: 'الصف الأول الثانوي (السنة المشتركة) – التأسيس الوزاري الشامل',
    instructor: 'نخبة معلمي نوح',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 5920,
    price: 250,
    status: 'published',
    category: 'المواد المشتركة',
    level: 'الصف الأول الثانوي',
    createdAt: '2026-08-22',
    rating: 4.7,
  },
  {
    id: 'c4',
    title: 'مختبر البرمجة التطبيقية وهندسة النظم 2 ث',
    instructor: 'م/ محمد القاضي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 1890,
    price: 320,
    status: 'published',
    category: 'البرمجة والذكاء الاصطناعي',
    level: 'الصف الثاني الثانوي',
    createdAt: '2026-09-01',
    rating: 4.9,
  },
  {
    id: 'c5',
    title: 'أساسيات التفكير الحاسوبي والمنطق الرقمي 1 ث',
    instructor: 'م/ محمد القاضي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 1200,
    price: 220,
    status: 'draft',
    category: 'تقنية المعلومات',
    level: 'الصف الأول الثانوي',
    createdAt: '2026-09-04',
    rating: 4.6,
  },
  {
    id: 'c6',
    title: 'الفيزياء المتقدمة وبنك أسئلة التحصيلي 3 ث',
    instructor: 'أ/ بدر المنصور',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    enrolledStudents: 940,
    price: 290,
    status: 'archived',
    category: 'الفيزياء',
    level: 'الصف الثالث الثانوي',
    createdAt: '2026-07-10',
    rating: 4.8,
  },
];

type ActiveRoleMode = 'admin' | 'teacher_mahmoud' | 'teacher_kadi' | 'assistant_faisal';

export default function AdminDashboardPage({
  currentTheme = 'warm-earth',
  currentUser,
  onPreviewCourse,
  onNavigateHome,
  onToggleTheme,
  onLogout,
  onNavigateProfile,
}: AdminPageProps) {
  const colors = getThemeColors(currentTheme);

  // Active Role State (Allows live switching between Super Admin, Teacher, and Assistant)
  const [roleMode, setRoleMode] = useState<ActiveRoleMode>('admin');

  // Navigation tab inside admin portal
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'discounts' | 'finance' | 'staff'>('overview');

  // State
  const [coursesList, setCoursesList] = useState<AdminCourseRow[]>(INITIAL_ADMIN_COURSES);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => {
    try {
      const stored = localStorage.getItem('nohe_discount_codes');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_DISCOUNT_CODES;
  });
  const [staffList, setStaffList] = useState<StaffAccount[]>(INITIAL_STAFF_ACCOUNTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourseRow | null>(null);
  const [isCreateDiscountOpen, setIsCreateDiscountOpen] = useState(false);
  const [isCreateStaffOpen, setIsCreateStaffOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Define Current Session Context based on roleMode
  const activeRoleConfig = {
    admin: {
      role: 'admin',
      displayName: 'المدير العام (Super Admin)',
      instructorName: null,
      assignedTeacherName: null,
      canViewFinance: true,
      canManageStaff: true,
      canManageAllCourses: true,
      canManageAllDiscounts: true,
    },
    teacher_mahmoud: {
      role: 'teacher',
      displayName: 'أ/ محمود عبداللطيف (معلم لغة عربية)',
      instructorName: 'أ/ محمود عبداللطيف',
      assignedTeacherName: null,
      canViewFinance: true,
      canManageStaff: false,
      canManageAllCourses: false,
      canManageAllDiscounts: false,
    },
    teacher_kadi: {
      role: 'teacher',
      displayName: 'م/ محمد القاضي (معلم حوسبة وذكاء اصطناعي)',
      instructorName: 'م/ محمد القاضي',
      assignedTeacherName: null,
      canViewFinance: true,
      canManageStaff: false,
      canManageAllCourses: false,
      canManageAllDiscounts: false,
    },
    assistant_faisal: {
      role: 'assistant',
      displayName: 'م/ فيصل العتيبي (مساعد م/ محمد القاضي)',
      instructorName: null,
      assignedTeacherName: 'م/ محمد القاضي',
      canViewFinance: false,
      canManageStaff: false,
      canManageAllCourses: false,
      canManageAllDiscounts: false,
    },
  }[roleMode];

  // Helper to filter courses by role
  const getVisibleCourses = () => {
    let list = coursesList;
    if (activeRoleConfig.role === 'teacher') {
      list = list.filter((c) => c.instructor === activeRoleConfig.instructorName);
    } else if (activeRoleConfig.role === 'assistant') {
      list = list.filter((c) => c.instructor === activeRoleConfig.assignedTeacherName);
    }

    if (statusFilter !== 'all') {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const visibleCourses = getVisibleCourses();

  // Helper to filter discount codes by role
  const getVisibleDiscounts = () => {
    if (activeRoleConfig.role === 'admin') {
      return discountCodes;
    }
    if (activeRoleConfig.role === 'teacher') {
      return discountCodes.filter(
        (d) => d.teacherName?.includes(activeRoleConfig.instructorName || '') || d.scope === 'all'
      );
    }
    return [];
  };

  // Profit & Metrics Calculation for Teacher
  const teacherCourses = coursesList.filter((c) =>
    activeRoleConfig.role === 'teacher'
      ? c.instructor === activeRoleConfig.instructorName
      : true
  );
  const totalStudentsCount = teacherCourses.reduce((acc, c) => acc + c.enrolledStudents, 0);
  const totalGrossRevenue = teacherCourses.reduce((acc, c) => acc + c.enrolledStudents * c.price, 0);
  const teacherNetProfit = Math.round(totalGrossRevenue * 0.7); // 70% share for teacher
  const platformCommission = totalGrossRevenue - teacherNetProfit; // 30% platform fee
  const paidPayouts = Math.round(teacherNetProfit * 0.65);
  const availablePayout = teacherNetProfit - paidPayouts;

  // New Course Form State
  const defaultInstructor = activeRoleConfig.role === 'assistant'
    ? (activeRoleConfig.assignedTeacherName || 'م/ محمد القاضي')
    : activeRoleConfig.role === 'teacher'
    ? (activeRoleConfig.instructorName || 'أ/ محمود عبداللطيف')
    : 'أ/ محمود عبداللطيف';

  const [courseFormData, setCourseFormData] = useState({
    title: '',
    instructor: defaultInstructor,
    price: 280,
    category: 'البرمجة والذكاء الاصطناعي',
    level: 'الصف الثاني الثانوي',
    status: 'published' as 'published' | 'draft' | 'archived',
    description: '',
    bunnyLibraryId: '',
    bunnyVideoId: '',
    bunnyStreamUrl: '',
  });

  // Discount Form State
  const [discountFormData, setDiscountFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 20,
    scope: 'all' as 'all' | 'course' | 'bundle',
    targetId: '',
    targetTitle: 'جميع الكورسات',
    maxUses: 100,
    expiresAt: '2026-12-31',
  });

  // Staff Form State
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'teacher' as 'teacher' | 'assistant',
    subject: '',
    assignedTeacherName: 'أ/ محمود عبداللطيف',
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.title.trim()) return;

    const assignedInstructor = activeRoleConfig.role === 'assistant'
      ? (activeRoleConfig.assignedTeacherName || 'م/ محمد القاضي')
      : activeRoleConfig.role === 'teacher'
      ? (activeRoleConfig.instructorName || 'أ/ محمود عبداللطيف')
      : courseFormData.instructor;

    if (editingCourse) {
      setCoursesList((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: courseFormData.title,
                instructor: assignedInstructor,
                price: Number(courseFormData.price),
                category: courseFormData.category,
                level: courseFormData.level,
                status: courseFormData.status,
                bunnyLibraryId: courseFormData.bunnyLibraryId,
                bunnyVideoId: courseFormData.bunnyVideoId,
                bunnyStreamUrl: courseFormData.bunnyStreamUrl,
              }
            : c
        )
      );
      showNotification('تم تحديث بيانات الكورس وإعدادات الفيديو بنجاح');
    } else {
      const newCourse: AdminCourseRow = {
        id: `c_${Date.now()}`,
        title: courseFormData.title,
        instructor: assignedInstructor,
        instructorAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        enrolledStudents: 0,
        price: Number(courseFormData.price),
        status: courseFormData.status,
        category: courseFormData.category,
        level: courseFormData.level,
        createdAt: new Date().toISOString().split('T')[0],
        rating: 5.0,
        bunnyLibraryId: courseFormData.bunnyLibraryId,
        bunnyVideoId: courseFormData.bunnyVideoId,
        bunnyStreamUrl: courseFormData.bunnyStreamUrl,
      };
      setCoursesList((prev) => [newCourse, ...prev]);
      showNotification(
        activeRoleConfig.role === 'assistant'
          ? `تمت إضافة الكورس بنجاح تحت حساب المعلم: ${assignedInstructor}`
          : 'تم نشر الكورس الجديد بنجاح في المنصة'
      );
    }

    setIsCreateModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountFormData.code.trim()) return;

    const newDiscount: DiscountCode = {
      id: `disc_${Date.now()}`,
      code: discountFormData.code.trim().toUpperCase(),
      discountType: discountFormData.discountType,
      discountValue: Number(discountFormData.discountValue),
      scope: discountFormData.scope,
      targetId: discountFormData.targetId,
      targetTitle:
        discountFormData.scope === 'all'
          ? 'جميع الكورسات'
          : coursesList.find((c) => c.id === discountFormData.targetId)?.title || 'كورس محدد',
      teacherName:
        activeRoleConfig.role === 'teacher'
          ? activeRoleConfig.instructorName || 'المعلم'
          : 'إدارة المنصة (Super Admin)',
      usageCount: 0,
      maxUses: Number(discountFormData.maxUses),
      expiresAt: discountFormData.expiresAt,
      status: 'active',
    };

    const updated = [newDiscount, ...discountCodes];
    setDiscountCodes(updated);
    try {
      localStorage.setItem('nohe_discount_codes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsCreateDiscountOpen(false);
    setDiscountFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 20,
      scope: 'all',
      targetId: '',
      targetTitle: 'جميع الكورسات',
      maxUses: 100,
      expiresAt: '2026-12-31',
    });
    showNotification(`تم تفعيل كود الخصم الجديد "${newDiscount.code}" بنجاح وربطه بالدفع`);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormData.name.trim()) return;

    const newStaff: StaffAccount = {
      id: `stf_${Date.now()}`,
      name: staffFormData.name,
      email: staffFormData.email,
      phone: staffFormData.phone,
      role: staffFormData.role,
      subject: staffFormData.subject || 'مواد دراسية',
      assignedTeacherName: staffFormData.role === 'assistant' ? staffFormData.assignedTeacherName : undefined,
      coursesCount: 0,
      totalStudents: 0,
      totalRevenue: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStaffList((prev) => [newStaff, ...prev]);
    setIsCreateStaffOpen(false);
    showNotification(
      newStaff.role === 'assistant'
        ? `تم إضافة المساعد "${newStaff.name}" وتعيينه للمعلم "${newStaff.assignedTeacherName}"`
        : `تم إنشاء حساب المعلم "${newStaff.name}" بنجاح`
    );
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
      setCoursesList((prev) => prev.filter((c) => c.id !== id));
      showNotification('تم حذف الكورس بنجاح');
    }
  };

  const handleToggleDiscountStatus = (id: string) => {
    const updated = discountCodes.map((d) =>
      d.id === id ? { ...d, status: (d.status === 'active' ? 'disabled' : 'active') as 'active' | 'disabled' } : d
    );
    setDiscountCodes(updated);
    try {
      localStorage.setItem('nohe_discount_codes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 pb-24"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* ===================== ADMIN TOP HEADER BAR ===================== */}
      <header
        className="border-b sticky top-0 z-50 transition-colors shadow-xs"
        style={{
          backgroundColor: currentTheme === 'dark' ? '#1C1712' : '#F7EFE4',
          borderColor: colors.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Right side: Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-right cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-lg shadow-sm">
                ن
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-camel text-base sm:text-lg font-black" style={{ color: colors.textPrimary }}>
                    أكاديمية نوح
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    لوحة تحكم الإدارة 🛡️
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Left side (Top Right in RTL): Actions (Theme, Profile, Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icon-Only Theme Switcher */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#2A1F17' : '#EFE4D0',
                  borderColor: colors.borderColor,
                  color: currentTheme === 'dark' ? '#FDE047' : colors.primary,
                }}
                aria-label="تبديل النمط اللوني"
                title={currentTheme === 'dark' ? 'التحويل للنمط النهاري' : 'التحويل للنمط الليلي'}
              >
                {currentTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-[#3A3028]" />
                )}
              </button>
            )}

            {/* Profile Button */}
            {onNavigateProfile && (
              <button
                onClick={onNavigateProfile}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border font-bold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#2A1F17' : '#FFFFFF',
                  borderColor: colors.borderColor,
                  color: colors.textPrimary,
                }}
                title="الملف الشخصي للمدير"
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-black text-[11px] flex items-center justify-center">
                  {currentUser?.fullName?.charAt(0) || 'م'}
                </div>
                <span className="hidden sm:inline font-ui">{currentUser?.fullName || 'الملف الشخصي'}</span>
                <span className="sm:hidden font-ui">الملف</span>
              </button>
            )}

            {/* Direct Logout Button */}
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-xs font-bold font-ui cursor-pointer min-h-[40px]"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Role Switching Simulator Header Bar */}
      <div className="bg-[#2A1F17] text-[#FFF9EF] py-2.5 px-4 sm:px-8 border-b border-amber-900/40 shadow-sm sticky top-[61px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#D6C3A3]">بوابة الإدارة وصلاحيات المستخدمين (RBAC):</span>
            <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {activeRoleConfig.displayName}
            </span>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#E8D9C0] hidden md:inline">التبديل بين الحسابات:</span>
            <button
              onClick={() => {
                setRoleMode('admin');
                setActiveTab('overview');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                roleMode === 'admin'
                  ? 'bg-[#D6C3A3] text-[#1C1712] shadow-xs'
                  : 'bg-white/10 text-[#FFF9EF] hover:bg-white/20'
              }`}
            >
              المدير العام (Admin)
            </button>
            <button
              onClick={() => {
                setRoleMode('teacher_mahmoud');
                setActiveTab('overview');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                roleMode === 'teacher_mahmoud'
                  ? 'bg-[#D6C3A3] text-[#1C1712] shadow-xs'
                  : 'bg-white/10 text-[#FFF9EF] hover:bg-white/20'
              }`}
            >
              معلم: أ/ محمود
            </button>
            <button
              onClick={() => {
                setRoleMode('teacher_kadi');
                setActiveTab('overview');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                roleMode === 'teacher_kadi'
                  ? 'bg-[#D6C3A3] text-[#1C1712] shadow-xs'
                  : 'bg-white/10 text-[#FFF9EF] hover:bg-white/20'
              }`}
            >
              معلم: م/ القاضي
            </button>
            <button
              onClick={() => {
                setRoleMode('assistant_faisal');
                setActiveTab('courses');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                roleMode === 'assistant_faisal'
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                  : 'bg-white/10 text-[#FFF9EF] hover:bg-white/20'
              }`}
            >
              مساعد المعلم (م/ فيصل)
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {/* Assistant Notice Banner */}
        {activeRoleConfig.role === 'assistant' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-sm sm:text-base">
                  حساب مساعد تعليمي معتمد للمعلم: {activeRoleConfig.assignedTeacherName}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  صلاحياتك محصورة في إضافة وتعديل كورسات ومحتوى المعلم {activeRoleConfig.assignedTeacherName} فقط. تم تقييد الاطلاع على الأرباح والبيانات المالية.
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-500 text-neutral-950 font-extrabold text-xs rounded-full shrink-0">
              صلاحية مساعد
            </span>
          </div>
        )}

        {/* Teacher Profit Spotlight Header (Shown for Teachers) */}
        {activeRoleConfig.role === 'teacher' && (
          <div className="mb-6 p-6 rounded-3xl bg-[#3A3028] text-[#FFF9EF] border border-[#D6C3A3]/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D6C3A3] text-[#1C1712] flex items-center justify-center font-black text-2xl shadow-md">
                <Wallet className="w-7 h-7 text-[#1C1712]" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-[#D6C3A3] font-bold mb-1">
                  <span>لوحة المعلم المعتمد</span>
                  <span>•</span>
                  <span>نسبة أرباح المعلم: 70% صافي</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black font-camel">
                  أهلاً بك، {activeRoleConfig.instructorName}
                </h1>
                <p className="text-xs sm:text-sm text-[#E8D9C0]">
                  تابع أداء كورساتك ومبيعاتك وصافي أرباحك وإدارة أكواد الخصم لطلابك
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10 text-center min-w-[130px]">
                <div className="text-xs text-[#E8D9C0]">صافي أرباحك (70%)</div>
                <div className="text-lg font-black text-amber-300 font-mono">
                  {teacherNetProfit.toLocaleString()} ر.س
                </div>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#D6C3A3] text-[#1C1712] font-black text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Coins className="w-4 h-4" />
                <span>طلب سحب الأرباح</span>
              </button>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {notificationMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 shadow-md animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Header Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-camel">
              {activeRoleConfig.role === 'admin'
                ? 'لوحة إدارة المنصة والكادر التعليمي'
                : activeRoleConfig.role === 'teacher'
                ? `بوابة المحتوى والأرباح – ${activeRoleConfig.instructorName}`
                : `إدارة محتوى المعلم: ${activeRoleConfig.assignedTeacherName}`}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#E8D9C0] mt-1 font-medium">
              {activeRoleConfig.role === 'admin'
                ? 'إدارة شاملة للكورسات، المعلمين، المساعدين، نسب الأرباح وأكواد الخصم'
                : 'تحكم في فيديوهات Bunny.net، بنك الأسئلة، الأكواد الترويجية والمبيعات'}
            </p>
          </div>

          {/* Action Buttons based on Role */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseFormData({
                  title: '',
                  instructor: defaultInstructor,
                  price: 280,
                  category: 'البرمجة والذكاء الاصطناعي',
                  level: 'الصف الثاني الثانوي',
                  status: 'published',
                  description: '',
                  bunnyLibraryId: '248190',
                  bunnyVideoId: '',
                  bunnyStreamUrl: '',
                });
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712] font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>

            {activeRoleConfig.role !== 'assistant' && (
              <button
                onClick={() => setIsCreateDiscountOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-amber-700 transition-all cursor-pointer"
              >
                <BadgePercent className="w-4 h-4" />
                <span>إضافة كود خصم</span>
              </button>
            )}

            {activeRoleConfig.canManageStaff && (
              <button
                onClick={() => setIsCreateStaffOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-[#FFF9EF] font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة معلم / مساعد</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-6 overflow-x-auto">
          {activeRoleConfig.role !== 'assistant' && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712]'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>نظرة عامة والتحليلات</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712]'
                : 'text-neutral-600 dark:text-[#E8D9C0] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الكورسات ومحتوى Bunny.net ({visibleCourses.length})</span>
          </button>

          {activeRoleConfig.role !== 'assistant' && (
            <button
              onClick={() => setActiveTab('discounts')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'discounts'
                  ? 'bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712]'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <BadgePercent className="w-4 h-4" />
              <span>أكواد الخصم والكوبونات ({getVisibleDiscounts().length})</span>
            </button>
          )}

          {activeRoleConfig.canViewFinance && (
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'finance'
                  ? 'bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712]'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>
                {activeRoleConfig.role === 'admin' ? 'المالية وإيرادات الأكاديمية' : 'أرباحي ومستحقاتي (70%)'}
              </span>
            </button>
          )}

          {activeRoleConfig.canManageStaff && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-[#3A3028] dark:bg-[#D6C3A3] text-white dark:text-[#1C1712]'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>المعلمون والمساعدون ({staffList.length})</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 dark:text-[#E8D9C0] mb-2 text-xs font-bold">
                  <span>
                    {activeRoleConfig.role === 'admin' ? 'إجمالي طلاب المنصة' : 'الطلاب المشتركون في كورساتك'}
                  </span>
                  <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-black font-mono">
                  {totalStudentsCount.toLocaleString()} طالب
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% نمو هذا الشهر</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 dark:text-[#E8D9C0] mb-2 text-xs font-bold">
                  <span>الكورسات النشطة</span>
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-black font-mono">
                  {visibleCourses.length} كورس
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  محدثة ومتصلة بـ Bunny.net
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 dark:text-[#E8D9C0] mb-2 text-xs font-bold">
                  <span>
                    {activeRoleConfig.role === 'admin' ? 'إجمالي المبيعات' : 'صافي ربح المعلم (70%)'}
                  </span>
                  <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {activeRoleConfig.role === 'admin'
                    ? `${totalGrossRevenue.toLocaleString()} ر.س`
                    : `${teacherNetProfit.toLocaleString()} ر.س`}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {activeRoleConfig.role === 'admin' ? 'مبيعات جميع المسارات' : 'مستحق للسحب الفوري'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 dark:text-[#E8D9C0] mb-2 text-xs font-bold">
                  <span>أكواد الخصم النشطة</span>
                  <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-black font-mono">
                  {getVisibleDiscounts().length} كود ترويجي
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                  فعالة في صفحة الدفع
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>نظرة على الكورسات التي تديرها</span>
                </h3>
                <div className="space-y-3">
                  {visibleCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#2C241E] border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-sm">{course.title}</div>
                        <div className="text-xs text-neutral-500 dark:text-[#E8D9C0] flex items-center gap-3 mt-1">
                          <span>{course.instructor}</span>
                          <span>•</span>
                          <span>{course.enrolledStudents} طالب</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-300 font-bold">{course.price} ر.س</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        نشط
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>أكواد الخصم الحالية</span>
                </h3>
                <div className="space-y-3">
                  {getVisibleDiscounts().slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-neutral-50 dark:bg-[#2C241E] border border-dashed border-amber-400/40 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-300">
                          {d.code}
                        </span>
                        <div className="text-xs text-neutral-500 dark:text-[#E8D9C0]">
                          خصم {d.discountValue} {d.discountType === 'percentage' ? '%' : 'ر.س'}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-500">
                        استُخدم {d.usageCount} مرة
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES MANAGEMENT & BUNNY.NET STREAM */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث عن كورس أو مادة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#2C241E] border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 font-bold shrink-0">الحالة:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#2C241E] border border-neutral-200 dark:border-neutral-700 text-xs font-bold focus:outline-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>

            {/* Courses Table */}
            <div className="rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-neutral-100/70 dark:bg-[#2C241E] text-xs font-bold text-neutral-600 dark:text-[#E8D9C0] border-b border-neutral-200 dark:border-neutral-700">
                      <th className="p-4">الكورس</th>
                      <th className="p-4">المعلم المعتمد</th>
                      <th className="p-4">سيرفر Bunny.net</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">الطلاب المسجلين</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/60">
                    {visibleCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold">
                          <div className="text-neutral-900 dark:text-[#FFF9EF]">{course.title}</div>
                          <div className="text-xs text-neutral-500 dark:text-[#E8D9C0] mt-0.5">{course.level} • {course.category}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-neutral-800 dark:text-[#FFF9EF]">
                            {course.instructor}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs">
                          {course.bunnyLibraryId || course.bunnyVideoId ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                              <Video className="w-3.5 h-3.5" />
                              <span>Lib: {course.bunnyLibraryId || '248190'}</span>
                            </span>
                          ) : (
                            <span className="text-neutral-400">غير مربوط</span>
                          )}
                        </td>
                        <td className="p-4 font-bold font-mono text-amber-600 dark:text-amber-300">
                          {course.price} ر.س
                        </td>
                        <td className="p-4 font-mono">
                          {course.enrolledStudents.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              course.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : course.status === 'draft'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-neutral-500/10 text-neutral-500'
                            }`}
                          >
                            {course.status === 'published' ? 'منشور' : course.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                setCourseFormData({
                                  title: course.title,
                                  instructor: course.instructor,
                                  price: course.price,
                                  category: course.category,
                                  level: course.level,
                                  status: course.status,
                                  description: '',
                                  bunnyLibraryId: course.bunnyLibraryId || '248190',
                                  bunnyVideoId: course.bunnyVideoId || '',
                                  bunnyStreamUrl: course.bunnyStreamUrl || '',
                                });
                                setIsCreateModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-[#E8D9C0] cursor-pointer"
                              title="تعديل الكورس وسيرفر الفيديو"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISCOUNT CODES & COUPONS */}
        {activeTab === 'discounts' && activeRoleConfig.role !== 'assistant' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
              <div>
                <h3 className="font-bold text-lg">أكواد الخصم النشطة لصفحة الدفع</h3>
                <p className="text-xs text-neutral-500 dark:text-[#E8D9C0]">
                  {activeRoleConfig.role === 'admin'
                    ? 'يمكنك إنشاء أكواد عامة أو أكواد مخصصة لكورس أو باقة معينة'
                    : `يمكنك إنشاء أكواد خصم ترويجية لكورساتك (${activeRoleConfig.instructorName})`}
                </p>
              </div>
              <button
                onClick={() => setIsCreateDiscountOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-amber-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كود خصم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getVisibleDiscounts().map((d) => (
                <div
                  key={d.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-lg font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                        {d.code}
                      </span>
                      <button
                        onClick={() => handleToggleDiscountStatus(d.id)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer ${
                          d.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-neutral-500/20 text-neutral-400'
                        }`}
                      >
                        {d.status === 'active' ? 'مفعل' : 'معطل'}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-600 dark:text-[#E8D9C0] mb-4">
                      <div>
                        <strong>قيمة الخصم:</strong> {d.discountValue} {d.discountType === 'percentage' ? '%' : 'ر.س'}
                      </div>
                      <div>
                        <strong>النطاق:</strong> {d.targetTitle || 'جميع الكورسات'}
                      </div>
                      <div>
                        <strong>صاحب الكود:</strong> {d.teacherName || 'إدارة المنصة'}
                      </div>
                      <div>
                        <strong>مرات الاستخدام:</strong> {d.usageCount} / {d.maxUses || 'غير محدود'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-400">
                    <span>ينتهي: {d.expiresAt}</span>
                    <button
                      onClick={() => {
                        setDiscountCodes((prev) => prev.filter((item) => item.id !== d.id));
                        showNotification('تم حذف كود الخصم');
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      حذف الكود
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER PROFITS & FINANCIALS */}
        {activeTab === 'finance' && activeRoleConfig.canViewFinance && (
          <div className="space-y-6">
            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
                <div className="text-xs text-neutral-500 dark:text-[#E8D9C0] font-bold mb-1">
                  إجمالي قيمة المبيعات (Gross Sales)
                </div>
                <div className="text-2xl font-black font-mono">
                  {totalGrossRevenue.toLocaleString()} ر.س
                </div>
                <div className="text-xs text-neutral-400 mt-1">100% من مبيعات الكورسات</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
                <div className="text-xs text-neutral-500 dark:text-[#E8D9C0] font-bold mb-1">
                  {activeRoleConfig.role === 'admin' ? 'عمولة المنصة (30%)' : 'صافي ربح المعلم (70%)'}
                </div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {(activeRoleConfig.role === 'admin' ? platformCommission : teacherNetProfit).toLocaleString()} ر.س
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1">نسبة الشراكة المعتمدة</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
                <div className="text-xs text-neutral-500 dark:text-[#E8D9C0] font-bold mb-1">
                  الرصيد المتاح للسحب الفوري
                </div>
                <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {availablePayout.toLocaleString()} ر.س
                </div>
                <button
                  onClick={() => setIsPayoutModalOpen(true)}
                  className="mt-2 text-xs font-bold text-amber-700 dark:text-[#D6C3A3] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>طلب تحويل للآيبان البنكي</span>
                </button>
              </div>
            </div>

            {/* Courses Profit Detail Table */}
            <div className="rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 font-bold text-base">
                تفاصيل الأرباح لكل كورس
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-[#2C241E] text-xs font-bold text-neutral-500">
                      <th className="p-4">الكورس</th>
                      <th className="p-4">سعر الكورس</th>
                      <th className="p-4">الطلاب المسجلين</th>
                      <th className="p-4">إجمالي الدخل</th>
                      <th className="p-4">صافي حصة المعلم (70%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {teacherCourses.map((c) => {
                      const courseGross = c.enrolledStudents * c.price;
                      const courseTeacherNet = Math.round(courseGross * 0.7);
                      return (
                        <tr key={c.id} className="hover:bg-neutral-50/40 dark:hover:bg-white/5">
                          <td className="p-4 font-bold">{c.title}</td>
                          <td className="p-4 font-mono">{c.price} ر.س</td>
                          <td className="p-4 font-mono">{c.enrolledStudents.toLocaleString()}</td>
                          <td className="p-4 font-mono font-bold">{courseGross.toLocaleString()} ر.س</td>
                          <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                            {courseTeacherNet.toLocaleString()} ر.س
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STAFF & ASSISTANTS MANAGEMENT (Super Admin Only) */}
        {activeTab === 'staff' && activeRoleConfig.canManageStaff && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700">
              <div>
                <h3 className="font-bold text-lg">الكادر التعليمي ومساعدو المعلمين</h3>
                <p className="text-xs text-neutral-500 dark:text-[#E8D9C0]">
                  إدارة حسابات المعلمين وتعيين المساعدين للوصول لكورسات المعلم المحدد فقط
                </p>
              </div>
              <button
                onClick={() => setIsCreateStaffOpen(true)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-[#D6C3A3] dark:text-[#1C1712] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة كادر جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((stf) => (
                <div
                  key={stf.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#3A3028] border border-neutral-200 dark:border-neutral-700 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          stf.role === 'teacher'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {stf.role === 'teacher' ? 'معلم أساسي' : 'مساعد معلم'}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold">نشط ✓</span>
                    </div>

                    <h4 className="font-bold text-base mb-1">{stf.name}</h4>
                    <p className="text-xs text-neutral-500 dark:text-[#E8D9C0] mb-3">
                      {stf.subject}
                    </p>

                    {stf.role === 'assistant' && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 mb-3">
                        <strong>يعمل مع المعلم:</strong> {stf.assignedTeacherName}
                      </div>
                    )}

                    <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                      <div>📧 {stf.email}</div>
                      <div>📱 {stf.phone}</div>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">انضم: {stf.createdAt}</span>
                    <button
                      onClick={() => {
                        setStaffList((prev) => prev.filter((x) => x.id !== stf.id));
                        showNotification('تم تعطيل حساب الكادر');
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      إلغاء التعيين
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
          <div className="bg-white dark:bg-[#2C241E] text-[#1C1712] dark:text-[#FFF9EF] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 border border-neutral-200 dark:border-neutral-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700 mb-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-lg">
                  {editingCourse ? 'تعديل الكورس وسيرفر الفيديو' : 'إضافة كورس جديد'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">عنوان الكورس</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الصف الثاني الثانوي – مسار الحوسبة والهندسة"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Instructor Selector / Locked based on Role */}
              <div>
                <label className="block text-xs font-bold mb-1">المعلم المسؤول</label>
                {activeRoleConfig.role === 'assistant' ? (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                    <span>{activeRoleConfig.assignedTeacherName}</span>
                    <span className="text-[10px] bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-md">
                      مقفل لمساعد المعلم
                    </span>
                  </div>
                ) : activeRoleConfig.role === 'teacher' ? (
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-bold">
                    {activeRoleConfig.instructorName}
                  </div>
                ) : (
                  <select
                    value={courseFormData.instructor}
                    onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                  >
                    <option value="أ/ محمود عبداللطيف">أ/ محمود عبداللطيف (لغة عربية)</option>
                    <option value="م/ محمد القاضي">م/ محمد القاضي (حوسبة وذكاء اصطناعي)</option>
                    <option value="أ/ بدر المنصور">أ/ بدر المنصور (فيزياء وتحصيلي)</option>
                    <option value="نخبة معلمي نوح">نخبة معلمي نوح (مشترك)</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={courseFormData.price}
                    onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                  <select
                    value={courseFormData.level}
                    onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                  >
                    <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  </select>
                </div>
              </div>

              {/* Bunny.net Integration Fields */}
              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-purple-700 dark:text-purple-300">
                  <Video className="w-4 h-4" />
                  <span>ربط سيرفر الفيديو المشفر (Bunny.net Stream)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Bunny Library ID</label>
                    <input
                      type="text"
                      placeholder="248190"
                      value={courseFormData.bunnyLibraryId}
                      onChange={(e) => setCourseFormData({ ...courseFormData, bunnyLibraryId: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Video GUID / ID</label>
                    <input
                      type="text"
                      placeholder="d719e8a2-9b2f-4c89..."
                      value={courseFormData.bunnyVideoId}
                      onChange={(e) => setCourseFormData({ ...courseFormData, bunnyVideoId: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">أو رابط التضمين المباشر (Embed URL)</label>
                  <input
                    type="url"
                    placeholder="https://iframe.mediadelivery.net/embed/248190/..."
                    value={courseFormData.bunnyStreamUrl}
                    onChange={(e) => setCourseFormData({ ...courseFormData, bunnyStreamUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md cursor-pointer"
                >
                  {editingCourse ? 'حفظ التعديلات' : 'نشر الكورس'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DISCOUNT CODE MODAL */}
      {isCreateDiscountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
          <div className="bg-white dark:bg-[#2C241E] text-[#1C1712] dark:text-[#FFF9EF] rounded-3xl w-full max-w-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700 mb-5">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-lg">إنشاء كود خصم جديد</h3>
              </div>
              <button
                onClick={() => setIsCreateDiscountOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">رمز الكوبون (الرمز الإنجليزي)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: NOHE30, ARABIC25, KADI50"
                  value={discountFormData.code}
                  onChange={(e) => setDiscountFormData({ ...discountFormData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono font-bold tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">نوع الخصم</label>
                  <select
                    value={discountFormData.discountType}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-bold"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">القيمة</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountFormData.discountValue}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">نطاق تطبيق الخصم</label>
                <select
                  value={discountFormData.scope}
                  onChange={(e) => setDiscountFormData({ ...discountFormData, scope: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs font-bold"
                >
                  <option value="all">جميع الكورسات والباقات</option>
                  <option value="course">كورس محدد فقط</option>
                  <option value="bundle">باقات الكومبو والترم</option>
                </select>
              </div>

              {discountFormData.scope === 'course' && (
                <div>
                  <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف</label>
                  <select
                    value={discountFormData.targetId}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, targetId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-xs"
                  >
                    <option value="">اختر كورس...</option>
                    {visibleCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.instructor})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">حد مرات الاستخدام</label>
                  <input
                    type="number"
                    min="1"
                    value={discountFormData.maxUses}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, maxUses: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={discountFormData.expiresAt}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsCreateDiscountOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md cursor-pointer"
                >
                  تفعيل كود الخصم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE STAFF ACCOUNT MODAL (Super Admin Only) */}
      {isCreateStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
          <div className="bg-white dark:bg-[#2C241E] text-[#1C1712] dark:text-[#FFF9EF] rounded-3xl w-full max-w-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700 mb-5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-lg">إضافة حساب كادر تعليمي جديد</h3>
              </div>
              <button
                onClick={() => setIsCreateStaffOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">نوع الحساب والصلاحية</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStaffFormData({ ...staffFormData, role: 'teacher' })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      staffFormData.role === 'teacher'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                        : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    👨‍🏫 معلم أساسي
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffFormData({ ...staffFormData, role: 'assistant' })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                      staffFormData.role === 'assistant'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30'
                        : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    🤝 مساعد معلم
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م/ سعد العتيبي"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                />
              </div>

              {staffFormData.role === 'assistant' && (
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <label className="block text-xs font-bold mb-1 text-purple-800 dark:text-purple-300">
                    تعيين المساعد للمعلم:
                  </label>
                  <select
                    value={staffFormData.assignedTeacherName}
                    onChange={(e) => setStaffFormData({ ...staffFormData, assignedTeacherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1C1712] border border-purple-300 dark:border-purple-700 text-xs font-bold"
                  >
                    <option value="أ/ محمود عبداللطيف">أ/ محمود عبداللطيف (لغة عربية)</option>
                    <option value="م/ محمد القاضي">م/ محمد القاضي (حوسبة وذكاء اصطناعي)</option>
                    <option value="أ/ بدر المنصور">أ/ بدر المنصور (فيزياء)</option>
                  </select>
                  <p className="text-[11px] text-purple-600 dark:text-purple-300 mt-1">
                    * سيتمكن المساعد فقط من إدارة وإضافة الكورسات المخصصة لهذا المعلم المحدد.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@nohe.sa"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم الجوال</label>
                  <input
                    type="tel"
                    required
                    placeholder="05xxxxxxxx"
                    value={staffFormData.phone}
                    onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">المادة أو التخصص</label>
                <input
                  type="text"
                  placeholder="مثال: مسار الحوسبة والهندسة"
                  value={staffFormData.subject}
                  onChange={(e) => setStaffFormData({ ...staffFormData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsCreateStaffOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md cursor-pointer"
                >
                  إنشاء الحساب وتفعيل الصلاحيات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
          <div className="bg-white dark:bg-[#2C241E] text-[#1C1712] dark:text-[#FFF9EF] rounded-3xl w-full max-w-md p-6 border border-neutral-200 dark:border-neutral-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700 mb-5">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-lg">طلب سحب أرباح المعلم</h3>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-xs text-neutral-600 dark:text-[#E8D9C0] mb-1">الرصيد المتاح للتحويل الفوري</div>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {availablePayout.toLocaleString()} ر.س
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">الآيبان البنكي (IBAN)</label>
                <input
                  type="text"
                  defaultValue="SA44 8000 0201 6080 1011 2233"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">اسم البنك</label>
                <input
                  type="text"
                  defaultValue="مصرف الراجحي - فرع الرياض"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1C1712] border border-neutral-300 dark:border-neutral-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPayoutModalOpen(false);
                    showNotification('تم رفع طلب السحب بنجاح، ستصلك الحوالة خلال 24 ساعة عمل');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تأكيد طلب التحويل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
