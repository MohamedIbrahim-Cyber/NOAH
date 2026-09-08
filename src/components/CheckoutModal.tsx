import React, { useState } from 'react';
import { Course, PackageBundle, BrandTheme, StudentUser } from '../types';
import { api } from '../lib/api';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, Smartphone, ArrowLeft, Tag, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Course | PackageBundle | null;
  currentTheme: BrandTheme;
  currentUser: StudentUser | null;
  onPaymentComplete: (itemId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  currentTheme,
  currentUser,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'stc_pay' | 'apple_pay' | 'card'>('mada');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [stcPhone, setStcPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const basePrice = item.price;
  const discountAmount = discountApplied ? Math.round(basePrice * 0.2) : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const primaryBrandColor = currentTheme === 'fresh' ? '#6F384F' : '#3A3028';

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'NOHE2026' || couponCode.trim() === 'نوح') {
      setDiscountApplied(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('كوبون غير صالح. جرب كود NOHE2026 للحصول على خصم 20%');
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const itemType = 'lecturesCount' in item ? 'course' : 'package';
      
      // 1. Create Checkout Session on backend
      const session = await api.checkout.createSession({
        itemType,
        itemId: item.id,
        paymentMethod,
        couponCode: discountApplied ? 'NOHE2026' : undefined,
      });

      // 2. Simulate gateway authorization & webhook callback
      const fulfillment = await api.checkout.simulateSuccess(session.orderId);

      setConfirmedOrderId(session.orderId);
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentComplete(item.id);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'تعذر إتمام الدفع، يرجى المحاولة لاحقاً');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border relative my-8 animate-in fade-in zoom-in-95 duration-200 text-right">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-camel text-2xl font-black text-neutral-900 mb-2">
              تم الاشتراك بنجاح! 🎉
            </h3>
            <p className="font-ui text-sm text-neutral-600 mb-6 leading-relaxed">
              تم تفعيل اشتراكك في <span className="font-bold text-neutral-900">"{item.title}"</span> فورياً. يمكنك الآن بدء مشاهدة المحاضرات وحل الاختبارات الدورية.
            </p>
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 mb-6 text-xs text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>رقم العملية في قاعدة البيانات:</span>
                <span className="font-mono font-bold text-neutral-900" dir="ltr">#{confirmedOrderId || 'ORD-NOHE-1447'}</span>
              </div>
              <div className="flex justify-between">
                <span>المبلغ المدفوع:</span>
                <span className="font-bold text-emerald-700 font-mono">{finalPrice} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>بوابة الدفع المعتمدة:</span>
                <span className="font-semibold">Moyasar (ميسر) - مرخصة من البنك المركزي السعودي</span>
              </div>
              <div className="flex justify-between">
                <span>وسيلة الدفع:</span>
                <span className="font-bold">
                  {paymentMethod === 'mada'
                    ? 'مدى (Mada)'
                    : paymentMethod === 'stc_pay'
                    ? 'STC Pay'
                    : paymentMethod === 'apple_pay'
                    ? 'Apple Pay'
                    : 'بطاقة ائتمان'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-transform hover:scale-101 cursor-pointer"
              style={{ backgroundColor: primaryBrandColor }}
            >
              الانتقال إلى لوحة الطالب والدروس
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: primaryBrandColor }}
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-camel text-xl font-bold text-neutral-900">
                  إتمام الاشتراك والطلب
                </h3>
                <span className="text-xs text-neutral-500 font-ui flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  بوابة الدفع الآمنة (Moyasar Gateway - SAMA)
                </span>
              </div>
            </div>

            {/* Item summary card */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 mb-6">
              <div className="text-xs text-neutral-500 font-semibold mb-1">
                عنصر الاشتراك:
              </div>
              <div className="font-camel text-base font-bold text-neutral-900 mb-1">
                {item.title}
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-200 mt-2">
                <span className="text-xs text-neutral-600">السعر الأساسي:</span>
                <span className="font-impact text-lg font-bold text-neutral-900" dir="ltr">
                  {basePrice} ر.س
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>كوبون خصم إضافي</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود الخصم (مثال: NOHE2026)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-grow px-3 py-2 rounded-xl border border-neutral-300 text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={discountApplied || !couponCode.trim()}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {discountApplied ? 'تم التفعيل ✓' : 'تطبيق'}
                </button>
              </div>
              {discountApplied && (
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  تم تطبيق خصم 20% بنجاح (-{discountAmount} ر.س)
                </div>
              )}
            </div>

            {/* Payment Method Selector (Saudi payment options) */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-700 mb-2">
                اختر وسيلة الدفع (بالريال السعودي):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Mada */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mada')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'mada'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500 font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-7 h-4 bg-emerald-700 text-white text-[9px] font-black rounded flex items-center justify-center tracking-tighter">
                    mada
                  </span>
                  <span className="text-xs text-neutral-800">مدى</span>
                </button>

                {/* STC Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stc_pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'stc_pay'
                      ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500 font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-700" />
                  <span className="text-xs text-neutral-800">STC Pay</span>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-neutral-900 bg-neutral-100 shadow-xs ring-1 ring-neutral-900 font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-sm"></span>
                  <span className="text-xs text-neutral-800">Apple Pay</span>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-neutral-800">بطاقة بنكية</span>
                </button>
              </div>
            </div>

            {/* Payment Fields */}
            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'stc_pay' ? (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    رقم جوال حساب STC Pay
                  </label>
                  <input
                    type="tel"
                    required
                    value={stcPhone}
                    onChange={(e) => setStcPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    ستصلك رسالة تأكيد الدفع عبر تطبيق STC Pay للموافقة.
                  </span>
                </div>
              ) : paymentMethod === 'apple_pay' ? (
                <div className="bg-neutral-900 text-white rounded-2xl p-4 text-center cursor-pointer hover:bg-neutral-800 transition-colors">
                  <span className="font-semibold text-sm">
                    الدفع السريع بواسطة Pay
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      رقم البطاقة
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      dir="ltr"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-impact focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        dir="ltr"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        رمز الأمان (CVV)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        dir="ltr"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Data Usage & Privacy Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>حماية البيانات والمدفوعات</span>
                </div>
                <p className="font-ui text-[11px] text-neutral-600 leading-relaxed">
                  بياناتك المالية محمية بالكامل بتشفير SSL عالي الأمان. لا نقوم بتخزين أو مشاركة أرقام بطاقتك الائتمانية مع أي طرف، وتُستخدم بياناتك فقط لتفعيل اشتراكك وإصدار الفواتير.
                </p>
              </div>

              {/* Total Price Bar */}
              <div className="pt-4 border-t flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-semibold block">
                    المبلغ الإجمالي المستحق:
                  </span>
                  <div className="flex items-baseline gap-1" dir="rtl">
                    <span className="font-impact text-2xl font-black text-blue-600">
                      {finalPrice}
                    </span>
                    <span className="font-ui text-sm font-bold text-neutral-800">
                      ريال سعودي (ر.س)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-7 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: primaryBrandColor }}
                >
                  {isProcessing ? (
                    <span>جاري معالجة الدفع...</span>
                  ) : (
                    <>
                      <span>تأكيد ودفع {finalPrice} ر.س</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
