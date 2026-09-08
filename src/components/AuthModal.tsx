import React, { useState } from 'react';
import { BrandTheme, SaudiGradeLevel, SaudiTrack, StudentUser } from '../types';
import { api } from '../lib/api';
import { getThemeColors } from '../lib/theme';
import { X, User, Phone, Mail, Lock, GraduationCap, Compass, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  currentTheme: BrandTheme;
  onSuccess: (user: StudentUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  currentTheme,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [gradeLevel, setGradeLevel] = useState<SaudiGradeLevel>('3rd_secondary');
  const [track, setTrack] = useState<SaudiTrack>('computing_engineering');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const colors = getThemeColors(currentTheme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      if (mode === 'signup') {
        const res = await api.auth.signup({
          email,
          password,
          fullName: fullName || 'طالب نوح أكاديمي',
          phone: phone || '0551234567',
          gradeLevel,
          track,
        });
        onSuccess(res.user);
        onClose();
      } else if (mode === 'login') {
        const res = await api.auth.login({
          identifier: email || phone,
          password,
        });
        onSuccess(res.user);
        onClose();
      } else if (mode === 'forgot') {
        const res = await api.auth.forgotPassword(email || phone);
        setSuccessNotice(res.message);
        if (res.token) {
          setResetToken(res.token);
        }
        setMode('reset');
      } else if (mode === 'reset') {
        const res = await api.auth.resetPassword({
          email: email || phone,
          token: resetToken,
          password,
        });
        setSuccessNotice(res.message);
        setMode('login');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'فشلت العملية، يرجى مراجعة البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@noheacademy.sa');
      setPassword('nohe2026!');
      setPhone('0558924110');
      setMode('login');
    } else {
      setEmail('admin@noheacademy.sa');
      setPassword('admin2026!');
      setPhone('0550000000');
      setMode('login');
    }
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
      <div
        className="rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border relative my-6 sm:my-8 animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
          color: colors.textPrimary,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 left-4 sm:left-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-sm"
            style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
          >
            {mode === 'forgot' || mode === 'reset' ? (
              <KeyRound className="w-6 h-6 text-amber-300" />
            ) : (
              <GraduationCap className="w-6 h-6 text-amber-300" />
            )}
          </div>
          <h3 className="font-camel text-xl sm:text-2xl font-black text-neutral-900 dark:text-slate-100">
            {mode === 'signup' && 'إنشاء حساب طالب جديد'}
            {mode === 'login' && 'تسجيل الدخول إلى منصة نوح'}
            {mode === 'forgot' && 'استعادة كلمة المرور'}
            {mode === 'reset' && 'تعيين كلمة المرور الجديدة'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
            {mode === 'signup' && 'احصل على 100 نقطة ترحيبية فورية وتجربة مجانية'}
            {mode === 'login' && 'متابعة مساقاتك واختبارات قياس ومسارات الثانوي'}
            {mode === 'forgot' && 'أدخل بريدك أو رقم جوالك المسجل لاستلام رمز التحقق'}
            {mode === 'reset' && 'أدخل رمز الاستعادة وكلمة المرور الجديدة لتحديث حسابك'}
          </p>
        </div>

        {/* Mode Switcher */}
        {mode !== 'forgot' && mode !== 'reset' ? (
          <div className="flex bg-neutral-100 dark:bg-slate-800 p-1 rounded-2xl mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(null); setSuccessNotice(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-neutral-900 dark:text-slate-100 shadow-xs'
                  : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessNotice(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-neutral-900 dark:text-slate-100 shadow-xs'
                  : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200'
              }`}
            >
              حساب جديد
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(null); setSuccessNotice(null); }}
              className="text-xs font-bold text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              <span>العودة لصفحة تسجيل الدخول</span>
            </button>
          </div>
        )}

        {/* Quick Demo Credentials */}
        {mode === 'login' && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-400 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>بيانات تجريبية سريعة (Demo Quick Access):</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-300 font-semibold cursor-pointer text-2xs transition-colors border border-amber-300/40"
              >
                👤 دخول كطالب ثانوي
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-300 font-semibold cursor-pointer text-2xs transition-colors border border-amber-300/40"
              >
                ⚙️ دخول كمشرف المنصة
              </button>
            </div>
          </div>
        )}

        {/* Notices */}
        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>الاسم الكامل</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: سارة محمد الشمري"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100"
              />
            </div>
          )}

          {(mode === 'signup' || mode === 'login' || mode === 'forgot' || mode === 'reset') && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{mode === 'login' || mode === 'forgot' ? 'رقم الجوال أو البريد الإلكتروني' : 'البريد الإلكتروني'}</span>
              </label>
              <input
                type={mode === 'signup' ? 'email' : 'text'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signup' ? 'student@example.com' : '05xxxxxxxx أو student@example.com'}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>رقم الجوال السعودي</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 text-left"
                dir="ltr"
              />
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>رمز استعادة كلمة المرور (Reset Token)</span>
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="أدخل الرمز المستلم"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 text-left font-mono"
                dir="ltr"
              />
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{mode === 'reset' ? 'كلمة المرور الجديدة (8 خانات على الأقل)' : 'كلمة المرور'}</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(null); setSuccessNotice(null); }}
                    className="text-2xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 text-left"
                dir="ltr"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span>المرحلة الدراسية</span>
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value as SaudiGradeLevel)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100"
                >
                  <option value="1st_secondary">الصف الأول الثانوي</option>
                  <option value="2nd_secondary">الصف الثاني الثانوي</option>
                  <option value="3rd_secondary">الصف الثالث الثانوي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>المسار التعليمي</span>
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as SaudiTrack)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100"
                >
                  <option value="shared_year">السنة المشتركة (1 ث)</option>
                  <option value="computing_engineering">مسار الحوسبة والهندسة</option>
                  <option value="natural_sciences">مسار العلوم الطبيعية</option>
                  <option value="business_admin">مسار الإدارة والأعمال</option>
                  <option value="sharia_islamic_studies">مسار الشريعة والدراسات</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-101 cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري معالجة الطلب...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup' && 'تأكيد التسجيل والدخول'}
                  {mode === 'login' && 'تسجيل الدخول'}
                  {mode === 'forgot' && 'إرسال رابط التحقق'}
                  {mode === 'reset' && 'حفظ كلمة المرور والدخول'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
