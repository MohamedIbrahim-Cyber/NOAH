import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  Tag,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Zap,
  Trash2,
  Sparkles,
  ShoppingBag,
  Clock,
  Play,
  Share2,
} from 'lucide-react';
import { BrandTheme, Course, StudentUser } from '../../types';
import { COURSES } from '../../data/mockData';
import { getThemeColors } from '../../lib/theme';

export interface CheckoutPageProps {
  cartItems?: Course[];
  currentUser?: StudentUser | null;
  currentTheme?: BrandTheme;
  onRemoveCartItem?: (courseId: string) => void;
  onPaymentSuccess?: (enrolledCourseIds: string[]) => void;
  onNavigateHome?: () => void;
  onStartLearning?: (courseId: string) => void;
}

type PaymentMethodType = 'mada' | 'apple_pay' | 'credit_card' | 'stc_pay' | 'tamara';

export default function CheckoutPage({
  cartItems: propCartItems,
  currentUser,
  currentTheme = 'warm-earth',
  onRemoveCartItem,
  onPaymentSuccess,
  onNavigateHome,
  onStartLearning,
}: CheckoutPageProps) {
  const colors = getThemeColors(currentTheme);

  // Default items if cart is empty
  const [items, setItems] = useState<Course[]>(
    propCartItems && propCartItems.length > 0 ? propCartItems : [COURSES[0], COURSES[1]]
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mada');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Card form state
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || 'عبدالله بن راشد الشمري');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [stcPhone, setStcPhone] = useState(currentUser?.phone || '0558924110');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const subtotal = items.reduce((acc, c) => acc + c.price, 0);
  const discountAmount = appliedDiscount
    ? appliedDiscount.amount > 0
      ? appliedDiscount.amount
      : Math.round(subtotal * (appliedDiscount.percent / 100))
    : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    // Load static and dynamically created discount codes from admin portal
    let customCodes: any[] = [];
    try {
      const stored = localStorage.getItem('nohe_discount_codes');
      if (stored) customCodes = JSON.parse(stored);
    } catch {
      // ignore
    }

    const defaultCodes = [
      { code: 'NOHE20', type: 'percentage', value: 20 },
      { code: 'ARABIC30', type: 'percentage', value: 30 },
      { code: 'KADI50', type: 'fixed', value: 50 },
      { code: 'COMBO100', type: 'fixed', value: 100 },
      { code: 'SAVE50', type: 'fixed', value: 50 },
      { code: 'STUDENT10', type: 'percentage', value: 10 },
    ];

    const allCodes = [...customCodes, ...defaultCodes];
    const match = allCodes.find((c) => c.code.toUpperCase() === code);

    if (match) {
      if (match.discountType === 'percentage' || match.type === 'percentage') {
        const percent = match.discountValue || match.value || 20;
        setAppliedDiscount({ code, percent, amount: 0 });
      } else {
        const fixedAmt = match.discountValue || match.value || 50;
        setAppliedDiscount({ code, percent: 0, amount: fixedAmt });
      }
    } else {
      setCouponError('كود الخصم المدخل غير صالح أو منتهي الصلاحية');
    }
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    if (onRemoveCartItem) onRemoveCartItem(id);
  };

  const handleFormatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomRef = `NOHE-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReference(randomRef);
      setIsCompleted(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(items.map((i) => i.id));
      }
    }, 2200);
  };

  // SUCCESS SCREEN
  if (isCompleted) {
    return (
      <div
        className="min-h-screen transition-colors duration-300 py-12 px-4 max-w-4xl mx-auto flex items-center justify-center selection:bg-amber-300 selection:text-neutral-900"
        dir="rtl"
        style={{
          backgroundColor: colors.canvasBg,
          color: colors.textPrimary,
        }}
      >
        <div
          className="w-full rounded-3xl p-8 sm:p-12 border shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="font-ui text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              عملية دفع ناجحة ومؤكدة ✓
            </span>
            <h1 className="font-camel text-2xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100 mt-3 mb-2">
              تهانينا! تم تفعيل اشتراكك بنجاح
            </h1>
            <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 max-w-md mx-auto">
              تم إرسال فاتورة الشراء ورابط الانضمام لمجموعة التليجرام الأكاديمية إلى جوالك عبر رسالة SMS وواتساب.
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border bg-black/2 dark:bg-white/2 max-w-md mx-auto text-xs font-ui space-y-2"
            style={{ borderColor: colors.borderColor }}
          >
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">رقم الطلب المرجعي:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-slate-100">{orderReference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">المبلغ المدفوع:</span>
              <span className="font-impact font-bold text-neutral-900 dark:text-slate-100">{grandTotal} ر.س</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">عدد المقررات المفعلة:</span>
              <span className="font-bold text-emerald-600">{items.length} مقررات</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                if (onStartLearning && items.length > 0) {
                  onStartLearning(items[0].id);
                } else if (onNavigateHome) {
                  onNavigateHome();
                }
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ابدأ مشاهدة المحاضرات فوراً</span>
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs border text-neutral-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: colors.borderColor }}
              >
                العودة للرئيسية
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-amber-300 selection:text-neutral-900"
      dir="rtl"
      style={{
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-slate-400 font-ui mb-1">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>بوابة الدفع المشفرة والآمنة (256-bit SSL)</span>
          </div>
          <h1 className="font-camel text-2xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100">
            إتمام طلب الاشتراك والتفعيل
          </h1>
        </div>

        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-bold font-ui text-neutral-600 dark:text-slate-300 hover:underline cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>العودة للمتجر</span>
          </button>
        )}
      </div>

      {/* Main Grid: Payment Details (7 Cols) + Order Summary (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================== LEFT: PAYMENT CHANNELS & DETAILS (7 Cols) ===================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Method Selector */}
          <div
            className="p-6 rounded-3xl border shadow-xs space-y-5"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <h2 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100">
              اختر وسيلة الدفع المناسبة:
            </h2>

            {/* Channels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'mada', label: 'بطاقة مدى', badge: 'الأكثر استخداماً', icon: '💳' },
                { id: 'apple_pay', label: 'Apple Pay', badge: 'سريع وآمن', icon: '🍎' },
                { id: 'credit_card', label: 'فيزا / ماستركارد', badge: 'بطاقات بنكية', icon: '🌐' },
                { id: 'stc_pay', label: 'stc pay / urpay', badge: 'محفظة رقمية', icon: '📱' },
                { id: 'tamara', label: 'تمارا / تابي', badge: 'قسطها على 4 دفعات', icon: '⚡' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30'
                      : 'border-neutral-200 dark:border-slate-800 hover:border-neutral-400'
                  }`}
                  style={{
                    backgroundColor: paymentMethod === m.id ? undefined : colors.canvasBg,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{m.icon}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === m.id
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-neutral-400'
                      }`}
                    >
                      {paymentMethod === m.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <div>
                    <span className="font-camel font-bold text-xs block text-neutral-900 dark:text-slate-100">
                      {m.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-slate-400 font-ui">
                      {m.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Channel Specific Fields */}
            {(paymentMethod === 'mada' || paymentMethod === 'credit_card') && (
              <div className="pt-4 border-t space-y-4 font-ui text-xs" style={{ borderColor: colors.borderColor }}>
                <div>
                  <label className="block font-bold mb-1.5 text-neutral-800 dark:text-slate-200">
                    اسم حامل البطاقة (كما يظهر على البطاقة) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="مثال: ABDULLAH R ALSHAMMARI"
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none uppercase"
                    style={{
                      backgroundColor: colors.canvasBg,
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-neutral-800 dark:text-slate-200">
                    رقم البطاقة المكون من 16 رقماً *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => handleFormatCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono text-left tracking-wider"
                    dir="ltr"
                    style={{
                      backgroundColor: colors.canvasBg,
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1.5 text-neutral-800 dark:text-slate-200">
                      تاريخ الانتهاء (شهر / سنة) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => handleFormatExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono text-center"
                      dir="ltr"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-neutral-800 dark:text-slate-200">
                      رمز التحقق (CVV) *
                    </label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.substring(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono text-center"
                      dir="ltr"
                      style={{
                        backgroundColor: colors.canvasBg,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="pt-4 border-t text-center py-6 space-y-3" style={{ borderColor: colors.borderColor }}>
                <span className="text-3xl">🍎</span>
                <h4 className="font-camel font-bold text-sm text-neutral-900 dark:text-slate-100">
                  الدفع السريع بنقرة واحدة عبر Apple Pay
                </h4>
                <p className="font-ui text-xs text-neutral-500 max-w-sm mx-auto">
                  سيتم فتح نافذة المصادقة ببصمة الوجه Face ID أو بصمة الإصبع لإتمام العملية بأعلى معايير الأمان البنكي.
                </p>
              </div>
            )}

            {paymentMethod === 'stc_pay' && (
              <div className="pt-4 border-t space-y-3 font-ui text-xs" style={{ borderColor: colors.borderColor }}>
                <label className="block font-bold text-neutral-800 dark:text-slate-200">
                  أدخل رقم الجوال المسجل في محفظة stc pay *
                </label>
                <input
                  type="tel"
                  required
                  value={stcPhone}
                  onChange={(e) => setStcPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                  style={{
                    backgroundColor: colors.canvasBg,
                    borderColor: colors.borderColor,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            )}

            {paymentMethod === 'tamara' && (
              <div className="pt-4 border-t p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs font-ui space-y-2">
                <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-slate-100">
                  <span>خطة الدفع بالتقسيط:</span>
                  <span>4 دفعات شهرية بقيمة {(grandTotal / 4).toFixed(1)} ر.س / شهر</span>
                </div>
                <p className="text-neutral-600 dark:text-slate-300 text-[11px]">
                  بدون فوائد، وبدون رسوم تأخير متوافقة مع الشريعة الإسلامية. الدفعة الأولى اليوم وباقي الدفعات شهرياً.
                </p>
              </div>
            )}
          </div>

          {/* Student Info Verification Banner */}
          <div
            className="p-5 rounded-3xl border shadow-xs text-xs font-ui space-y-2"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-slate-100">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>تأكيد بيانات الطالب المستفيد:</span>
            </div>
            <p className="text-neutral-500 dark:text-slate-400 leading-relaxed">
              سيتم ربط الاشتراكات فوراً بالحساب المسجل باسم: <strong>{cardHolder}</strong> ورقم الجوال: <strong>{currentUser?.phone || '0558924110'}</strong>.
            </p>
          </div>
        </div>

        {/* ===================== RIGHT: ORDER SUMMARY PANEL (5 Cols) ===================== */}
        <aside className="lg:col-span-5 space-y-6 sticky top-20">
          <div
            className="p-6 rounded-3xl border shadow-xl space-y-6"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: colors.borderColor }}>
              <h3 className="font-camel text-base font-bold text-neutral-900 dark:text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>ملخص السلة ({items.length} مقررات)</span>
              </h3>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 divide-y" style={{ borderColor: colors.borderColor }}>
              {items.map((it) => (
                <div key={it.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-camel text-xs font-bold text-neutral-900 dark:text-slate-100 line-clamp-1">
                      {it.title}
                    </h4>
                    <span className="font-ui text-[11px] text-neutral-500 dark:text-slate-400 block">
                      المعلم: {it.teacher.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-impact font-bold text-xs text-neutral-900 dark:text-slate-100">
                      {it.price} ر.س
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-4 border-t font-ui text-xs" style={{ borderColor: colors.borderColor }}>
              <label className="block font-bold text-neutral-800 dark:text-slate-200">
                لديك كود خصم أو قسيمة ترويجية؟
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="جرب كود: NOHE20"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border focus:ring-2 focus:ring-amber-400 focus:outline-none uppercase"
                    style={{
                      backgroundColor: colors.canvasBg,
                      borderColor: colors.borderColor,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-slate-700 text-white font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  تطبيق
                </button>
              </div>

              {couponError && (
                <span className="text-[11px] text-rose-500 font-bold block">{couponError}</span>
              )}
              {appliedDiscount && (
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between text-[11px]">
                  <span>✓ تم تطبيق كود الخصم ({appliedDiscount.code})</span>
                  <span>- {discountAmount} ر.س</span>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="pt-4 border-t space-y-2.5 font-ui text-xs" style={{ borderColor: colors.borderColor }}>
              <div className="flex items-center justify-between text-neutral-600 dark:text-slate-400">
                <span>المجموع الفرعي:</span>
                <span>{subtotal} ر.س</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>قيمة الخصم:</span>
                  <span>- {discountAmount} ر.س</span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600 dark:text-slate-400">
                <span>ضريبة القيمة المضافة (15% شاملة):</span>
                <span>مشمولة بالسعر</span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t font-camel text-neutral-900 dark:text-slate-100" style={{ borderColor: colors.borderColor }}>
                <span className="font-bold text-sm">المبلغ الإجمالي النهائي:</span>
                <div className="flex items-baseline gap-1" dir="rtl">
                  <span className="font-impact text-2xl sm:text-3xl font-black text-amber-500">
                    {grandTotal}
                  </span>
                  <span className="font-ui text-xs font-bold text-neutral-500">ريال سعودي</span>
                </div>
              </div>
            </div>

            {/* Data Usage & Privacy Security Disclaimer */}
            <div
              className="p-4 rounded-2xl border border-amber-500/20 text-right space-y-1.5"
              style={{
                backgroundColor: currentTheme === 'dark' ? 'rgba(58, 48, 40, 0.5)' : '#FEFDFB',
              }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-[#FFF9EF]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>إشعار الخصوصية وحماية البيانات المالية</span>
              </div>
              <p className="font-ui text-[11px] text-neutral-600 dark:text-[#E8D9C0] leading-relaxed">
                نلتزم في منصة نوح أكاديمي بأعلى معايير الأمان والتشفير المصرفي (PCI-DSS & SSL 256-bit). لا نقوم بتخزين أو مشاركة أرقام بطاقتك الائتمانية أو بياناتك الحساسة مع أي طرف ثالث، ويقتصر استخدام بياناتك الشخصية على تفعيل اشتراكك الأكاديمي وإصدار فواتيرك الضريبية المعتمدة فقط.
              </p>
            </div>

            {/* Complete Payment CTA Button */}
            <button
              onClick={handleCompletePayment}
              disabled={isProcessing || items.length === 0}
              className="w-full py-4 rounded-full font-bold text-sm sm:text-base text-neutral-950 shadow-xl hover:scale-102 transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: '#F5D278' }}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  <span>جاري معالجة الدفع والتحقق البنكي...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-neutral-950" />
                  <span>إتمام الدفع الآمن ({grandTotal} ر.س)</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-neutral-400 font-ui text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                دفع آمن ومحمي
              </span>
              <span>•</span>
              <span>ضمان استرجاع 30 يوماً</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
