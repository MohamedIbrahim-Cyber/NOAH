import React, { useState } from 'react';
import { LogoBadge } from '../../components/LogoBadge';
import { BrandTheme, StudentUser, SaudiGradeLevel, SaudiTrack } from '../../types';
import { getThemeColors } from '../../lib/theme';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  GraduationCap,
} from 'lucide-react';

export interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  currentTheme?: BrandTheme;
  onSuccess?: (user: StudentUser) => void;
  onNavigateHome?: () => void;
}

export default function AuthPage({
  initialMode = 'signup',
  currentTheme = 'warm-earth',
  onSuccess,
  onNavigateHome,
}: AuthPageProps) {
  const colors = getThemeColors(currentTheme);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState<SaudiGradeLevel>('3rd_secondary');
  const [track, setTrack] = useState<SaudiTrack>('computing_engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signup') {
      if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
        setErrorMessage('يرجى تعبئة جميع الحقول المطلوبة');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('كلمتا المرور غير متطابقتين');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('يجب أن تكون كلمة المرور 6 خانات على الأقل');
        return;
      }
    } else {
      if (!identifier.trim() || !password) {
        setErrorMessage('يرجى إدخال البريد الإلكتروني/الجوال وكلمة المرور');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: StudentUser = {
        id: `usr_${Date.now()}`,
        fullName: mode === 'signup' ? fullName : (identifier.includes('@') ? identifier.split('@')[0] : 'عبدالله بن راشد الشمري'),
        phone: mode === 'signup' ? phone : '0558924110',
        email: mode === 'signup' ? email : (identifier.includes('@') ? identifier : 'student@noheacademy.sa'),
        gradeLevel: mode === 'signup' ? gradeLevel : '3rd_secondary',
        track: mode === 'signup' ? track : 'computing_engineering',
        enrolledCourseIds: ['c1', 'c2'],
        points: mode === 'signup' ? 50 : 480,
      };

      if (onSuccess) {
        onSuccess(authenticatedUser);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row transition-colors duration-300"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* ===================== RIGHT PANEL: AUTH FORM (Takes 1/3 of the page on desktop) ===================== */}
      <div
        className="w-full lg:w-1/3 min-h-screen p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-l shadow-2xl z-10"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
        }}
      >
        <div>
          {/* Top navigation back button & mobile logo */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold font-ui px-3.5 py-2 rounded-full border transition-colors cursor-pointer"
              style={{
                borderColor: colors.borderColor,
                color: colors.textPrimary,
              }}
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>

            <div className="lg:hidden flex items-center gap-1.5">
              <LogoBadge size="sm" theme={currentTheme} showText={false} />
            </div>
          </div>

          {/* Form Mode Selector Tabs */}
          <div
            className="p-1 rounded-2xl border flex items-center gap-1 mb-6"
            style={{
              backgroundColor: colors.canvasBg,
              borderColor: colors.borderColor,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-camel text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-neutral-900 text-white dark:bg-[#D6C3A3] dark:text-[#1C1712] shadow-sm'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:text-neutral-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-camel text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-neutral-900 text-white dark:bg-[#D6C3A3] dark:text-[#1C1712] shadow-sm'
                  : 'text-neutral-600 dark:text-[#E8D9C0] hover:text-neutral-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="mb-6">
            <h2 className="font-camel text-xl sm:text-2xl font-black mb-1.5">
              {mode === 'signup' ? 'انضم إلى مجتمع نوح التعليمي' : 'مرحباً بعودتك مجدداً!'}
            </h2>
            <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-[#E8D9C0] leading-relaxed">
              {mode === 'signup'
                ? 'أنشئ حسابك للوصول الفوري لكافة الشروحات، بنك الأسئلة، ونظام المتابعة التفاعلي.'
                : 'أدخل بيانات حسابك الأكاديمي لمتابعة دروسك واختباراتك الدورية.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-ui text-xs font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 font-ui text-xs">
            {mode === 'signup' ? (
              <>
                {/* Full Name */}
                <div>
                  <label className="block font-bold mb-1">الاسم الثلاثي للطالب *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: عبدالله بن راشد الشمري"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-bold mb-1">رقم الجوال (واتساب للتنبيهات) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui text-right"
                      dir="ltr"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-bold mb-1">البريد الإلكتروني *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui text-right"
                      dir="ltr"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Grade & Track Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold mb-1">المرحلة الدراسية *</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value as SaudiGradeLevel)}
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    >
                      <option value="1st_secondary">الأول الثانوي (مشتركة)</option>
                      <option value="2nd_secondary">الثاني الثانوي (مسارات)</option>
                      <option value="3rd_secondary">الثالث الثانوي (مسارات)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">المسار الأكاديمي *</label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value as SaudiTrack)}
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    >
                      <option value="computing_engineering">الحوسبة والهندسة</option>
                      <option value="natural_sciences">العلوم الطبيعية والصحية</option>
                      <option value="business_admin">إدارة الأعمال</option>
                      <option value="sharia_islamic_studies">العلوم الشرعية</option>
                      <option value="shared_year">السنة المشتركة</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold mb-1">كلمة المرور *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                        style={{
                          backgroundColor: colors.canvasBg,
                          borderColor: colors.borderColor,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">تأكيد كلمة المرور *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                        style={{
                          backgroundColor: colors.canvasBg,
                          borderColor: colors.borderColor,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login: Identifier */}
                <div>
                  <label className="block font-bold mb-1">البريد الإلكتروني أو رقم الجوال *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="student@example.com أو 05XXXXXXXX"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Login: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold">كلمة المرور *</label>
                    <button
                      type="button"
                      onClick={() => alert('يرجى التواصل مع الدعم الفني لاستعادة كلمة المرور عبر واتساب.')}
                      className="text-[11px] text-amber-600 dark:text-[#D6C3A3] font-bold hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 font-ui"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold text-xs sm:text-sm text-neutral-950 shadow-md transition-shadow cursor-pointer flex items-center justify-center gap-2 mt-2"
              style={{
                backgroundColor: '#D6C3A3',
              }}
            >
              {isLoading ? (
                <span>جاري المعالجة...</span>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>تأكيد إنشاء الحساب وبدء التعلم</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول إلى الحساب</span>
                </>
              )}
            </button>
          </form>

          {/* ===================== DATA PRIVACY & USAGE DISCLAIMER ===================== */}
          <div
            className="mt-6 p-3.5 rounded-2xl border text-[11px] font-ui leading-relaxed"
            style={{
              backgroundColor: currentTheme === 'dark' ? 'rgba(58, 48, 40, 0.4)' : '#FBF6EE',
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center gap-2 font-bold mb-1 text-neutral-900 dark:text-[#FFF9EF]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>إشعار خصوصية وحماية بيانات الطالب:</span>
            </div>
            <p className="text-neutral-600 dark:text-[#E8D9C0]">
              نلتزم في منصة نوح بحماية خصوصية بياناتك ومعالجتها بأعلى درجات الأمان وفقاً لنظام حماية البيانات الشخصية في المملكة. تُستخدم معلوماتك (الاسم، الجوال، البريد، والمسار) حصرياً لإنشاء سجلك الأكاديمي، متابعة تقدمك الدراسي، إصدار شهادات الإتمام، وتأمين حسابك. لا يتم بيع أو مشاركة بياناتك مع أي طرف ثالث إطلاقاً.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t mt-6 text-center text-[11px] text-neutral-500 dark:text-[#E8D9C0]" style={{ borderColor: colors.borderColor }}>
          جميع الحقوق محفوظة لمنصة نوح التعليمية © {new Date().getFullYear()}
        </div>
      </div>

      {/* ===================== LEFT PANEL: BRAND ATMOSPHERE (Takes 2/3 of the page on desktop) ===================== */}
      <div
        className="hidden lg:flex w-2/3 min-h-screen p-12 lg:p-16 flex-col justify-between relative overflow-hidden select-none"
        style={{
          backgroundColor: colors.canvasBg,
          color: colors.textPrimary,
        }}
      >
        {/* Subtle Decorative Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-grid)" />
          </svg>
        </div>

        {/* Top Header in Left Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: currentTheme === 'dark' ? 'rgba(58, 48, 40, 0.6)' : 'rgba(214, 195, 163, 0.25)',
              color: colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>الصرح التعليمي لطلاب المسارات</span>
          </div>

          <span className="font-ui text-xs font-bold text-neutral-500 dark:text-[#E8D9C0]">
            المملكة العربية السعودية • 2026
          </span>
        </div>

        {/* Center Brand Identity Display */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Large Stylized Logo Badge */}
          <div className="mb-8">
            <LogoBadge size="xl" theme={currentTheme} showText={false} />
          </div>

          <h1 className="font-qahwa text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">
            منصة <span style={{ color: '#D97706' }}>نوح</span> التعليمية
          </h1>

          <p className="font-ui text-base lg:text-lg text-neutral-600 dark:text-[#E8D9C0] leading-relaxed mb-8">
            نحو نحو جديد.. بيئة تعليمية ذكية ومتطورة تجمع نخبة من أفضل المعلمين والموجهين لتقديم شروحات شاملة وبنوك أسئلة ذكية تحاكي اختبارات الوزارة والقياس لجميع مسارات الثانوية العامة.
          </p>

          {/* 3 Core Highlights (Non-interactive display cards) */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div
              className="p-4 rounded-2xl border text-center"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <GraduationCap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="font-camel text-xs font-bold mb-0.5">نخبة المعلمين</div>
              <div className="font-ui text-[10px] text-neutral-500 dark:text-[#E8D9C0]">شروحات متخصصة</div>
            </div>

            <div
              className="p-4 rounded-2xl border text-center"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <BookOpen className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="font-camel text-xs font-bold mb-0.5">مسارات شاملة</div>
              <div className="font-ui text-[10px] text-neutral-500 dark:text-[#E8D9C0]">تغطية للمناهج 100%</div>
            </div>

            <div
              className="p-4 rounded-2xl border text-center"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <div className="font-camel text-xs font-bold mb-0.5">بث مشفر وآمن</div>
              <div className="font-ui text-[10px] text-neutral-500 dark:text-[#E8D9C0]">جودة فائقة Bunny CDN</div>
            </div>
          </div>
        </div>

        {/* Bottom Left Panel Footer Note */}
        <div className="relative z-10 flex items-center justify-between text-xs font-ui text-neutral-500 dark:text-[#E8D9C0]">
          <span>أكاديمية نوح للتدريب والتعليم عن بعد</span>
          <span>دعم فني وتوجيه أكاديمي متواصل</span>
        </div>
      </div>
    </div>
  );
}
