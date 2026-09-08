import React from 'react';
import { BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import {
  Sparkles,
  Brain,
  FileQuestion,
  Headphones,
  LineChart,
  Gift,
  PhoneCall,
  CheckCircle2,
  BookOpen,
  PlayCircle,
  CalendarCheck,
} from 'lucide-react';

interface FeaturesGridsProps {
  currentTheme: BrandTheme;
}

export const FeaturesGrids: React.FC<FeaturesGridsProps> = ({ currentTheme }) => {
  const colors = getThemeColors(currentTheme);

  // Section 9: 6 Features
  const features6 = [
    {
      num: 3,
      badge: 'خرائط ذهنية وتأسيس',
      title: 'الشرح التفصيلي العميق',
      description: 'شرح مبسّط وموجّه لكل درس مع خرائط مفاهيمية تلخص القواعد والأفكار في صفحة واحدة لتسهيل الاستذكار والاسترجاع.',
      iconColor: 'maroon',
      icon: <Brain className="w-5 h-5 text-white" />,
    },
    {
      num: 1,
      badge: 'بنك أسئلة وامتحانات',
      title: 'الحل المكثف وبنك الأسئلة',
      description: 'آلاف الأسئلة المتدرجة من السهل إلى أصعب التحديات مع الحل بالفيديو وتوضيح سبب استبعاد الخيارات الخاطئة.',
      iconColor: 'gold',
      icon: <FileQuestion className="w-5 h-5 text-neutral-900" />,
    },
    {
      num: 5,
      badge: 'متابعة واستفسارات',
      title: 'مساعدون متخصصون للمتابعة',
      description: 'فريق من المساعدين المتفوقين للإجابة عن أسئلتك على مدار 24 ساعة ومتابعة إنجاز واجباتك أسبوعياً أولاً بأول.',
      iconColor: 'maroon',
      icon: <Headphones className="w-5 h-5 text-white" />,
    },
    {
      num: 2,
      badge: 'تقارير أداء دورية',
      title: 'المتابعة الدورية الشاملة',
      description: 'لوحة تحكم ذكية ترصد مستواك وترسل تقارير أداء دورية لولي الأمر توضح نسبة مشاهدة الدروس ودرجات الاختبارات.',
      iconColor: 'gold',
      icon: <LineChart className="w-5 h-5 text-neutral-900" />,
    },
    {
      num: 6,
      badge: 'دعم فني وأكاديمي',
      title: 'الدعم الأكاديمي والفني الفوري',
      description: 'خط ساخن عبر واتساب (+966 55 892 4110) لأي استفسار تقني أو إرشادي طوال العام الدراسي لضمان تجربة تعليمية سلسة.',
      iconColor: 'maroon',
      icon: <PhoneCall className="w-5 h-5 text-white" />,
    },
    {
      num: 4,
      badge: 'جوائز وهدايا',
      title: 'جوائز وهدايا تحفيزية قيمة',
      description: 'تكريم أوائل المنصة برحلات عمرة، وأجهزة لابتوب حديثة، وهواتف ذكية، ومكافآت مالية نقدية وشهادات شكر وتقدير.',
      iconColor: 'gold',
      icon: <Gift className="w-5 h-5 text-neutral-900" />,
    },
  ];

  return (
    <div className="py-10 sm:py-14 px-3 sm:px-6 max-w-7xl mx-auto space-y-16 sm:space-y-20" dir="rtl">
      {/* SECTION 9: "Why choose our platform" (6-item Laptop Grid) */}
      <section id="why-us-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border shadow-2xs"
            style={{
              borderColor: currentTheme === 'dark' ? '#38BDF8' : colors.secondary,
              backgroundColor: currentTheme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : currentTheme === 'fresh' ? 'rgba(245, 210, 120, 0.2)' : 'rgba(214, 195, 163, 0.2)',
              color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>مميزات نوح أكاديمي</span>
          </div>

          <h2 className="font-camel text-xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100 relative inline-block">
            إيه اللي هتلاقيه على المنصة؟
            <span
              className="absolute -bottom-2 right-0 w-full h-[4px] rounded-full"
              style={{ backgroundColor: '#F5D278' }}
            />
          </h2>
          <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mt-4">
            تجربة دراسية متكاملة ترتقي بمهاراتك وتحقق أهدافك في نظام مسارات الثانوية العامة
          </p>
        </div>

        {/* 6-item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {features6.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-5 sm:p-6 border shadow-xs hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between group"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              {/* Number Badge */}
              <div
                className="absolute top-4 sm:top-5 left-4 sm:left-5 w-8 h-8 rounded-full flex items-center justify-center font-impact text-sm font-black shadow-xs border"
                style={{
                  backgroundColor: '#F5D278',
                  borderColor: '#EBBF50',
                  color: '#1F1914',
                }}
              >
                0{item.num}
              </div>

              {/* Laptop-shaped Frame */}
              <div className="mb-5 flex items-start">
                <div className="relative w-28 h-20 bg-slate-900 rounded-lg p-1.5 shadow-md flex flex-col items-center justify-center border-2 border-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mb-1" />

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-inner mb-1"
                    style={{
                      backgroundColor: item.iconColor === 'maroon' ? (currentTheme === 'dark' ? '#0284C7' : '#6F384F') : '#F5D278',
                    }}
                  >
                    {item.icon}
                  </div>

                  <span className="text-[9px] font-bold text-amber-200 text-center truncate max-w-[90%]">
                    {item.badge}
                  </span>

                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-slate-400 rounded-b-md shadow-xs" />
                </div>
              </div>

              {/* Text content */}
              <div>
                <h3 className="font-camel text-base sm:text-lg font-bold text-[#1C1712] dark:text-[#FFF9EF] mb-2 group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
                <p className="font-ui text-xs sm:text-sm text-[#2A1F17] dark:text-[#E8D9C0] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: Asymmetric Grid */}
      <section id="what-you-find-section" className="pt-4 sm:pt-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border shadow-2xs"
            style={{
              borderColor: currentTheme === 'dark' ? '#38BDF8' : colors.secondary,
              backgroundColor: currentTheme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : currentTheme === 'fresh' ? 'rgba(245, 210, 120, 0.2)' : 'rgba(214, 195, 163, 0.2)',
              color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>مميزات نوح أكاديمي</span>
          </div>

          <h2 className="font-camel text-xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100">
            إيه اللي هتلاقيه على المنصة؟
          </h2>
        </div>

        {/* Mixed-size feature grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: 4 Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div
              className="p-4 sm:p-5 rounded-3xl border shadow-xs flex items-start gap-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: '#F5D278' }}
              >
                <LineChart className="w-6 h-6 text-neutral-900" />
              </div>
              <div>
                <h4 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  متابعة دورية وتقييم مستمر
                </h4>
                <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 leading-relaxed">
                  اختبارات أسبوعية وشهرية ترصد نقاط القوة والضعف لتطوير مستواك بدقة واحترافية.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="p-4 sm:p-5 rounded-3xl border shadow-xs flex items-start gap-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white"
                style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : '#6F384F' }}
              >
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  نماذج امتحانات بنفس النظام
                </h4>
                <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 leading-relaxed">
                  نماذج تحاكي اختبارات وزارة التعليم والقياس بنفس الصياغة ومؤقت زمني معتمد.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="p-4 sm:p-5 rounded-3xl border shadow-xs flex items-start gap-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white"
                style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : '#6F384F' }}
              >
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  تفاعل مباشر مع المعلمين
                </h4>
                <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 leading-relaxed">
                  حصص لايف أسبوعية للإجابة عن أصعب التساؤلات وحل المعضلات اللغوية والبرمجية.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div
              className="p-4 sm:p-5 rounded-3xl border shadow-xs flex items-start gap-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: '#F5D278' }}
              >
                <CalendarCheck className="w-6 h-6 text-neutral-900" />
              </div>
              <div>
                <h4 className="font-camel text-sm sm:text-base font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  خطة مذاكرة منظمة
                </h4>
                <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 leading-relaxed">
                  جدول زمني مقسم وفق أسابيع الفصل الدراسي يضمن إنهاء ومراجعة المنهج مرتين.
                </p>
              </div>
            </div>
          </div>

          {/* Right: One Tall Card */}
          <div
            className="lg:col-span-5 p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div>
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-5 sm:mb-6 shadow-xs border border-amber-500/30">
                <BookOpen className="w-6 sm:w-8 h-6 sm:h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 mb-3 border border-amber-500/30">
                المنهج الوزاري الحديث
              </div>
              <h3 className="font-camel text-xl sm:text-2xl font-black text-neutral-900 dark:text-slate-100 mb-3">
                شرح مبسط ومركز
              </h3>
              <p className="font-ui text-xs sm:text-sm lg:text-base text-neutral-600 dark:text-slate-300 leading-relaxed">
                لا نعتمد على الحفظ الأعمى؛ بل نبسط المفاهيم العلمية واللغوية بأسلوب تطبيقي ممتع يربط بين النظرية والتطبيق الواقعي لتصل إلى الفهم الكامل والدرجة النهائية.
              </p>
            </div>

            <div className="pt-5 sm:pt-6 border-t border-black/5 dark:border-white/10 mt-6 flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>أكثر من 200 ساعة تدريبية مسجلة ومفهرسة</span>
            </div>
          </div>

          {/* Full-width Card Below */}
          <div
            className="lg:col-span-12 p-5 sm:p-7 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white"
                style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
              >
                <PlayCircle className="w-6 sm:w-8 h-6 sm:h-8 text-amber-300" />
              </div>
              <div>
                <h3 className="font-camel text-base sm:text-xl font-bold text-neutral-900 dark:text-slate-100 mb-1">
                  فيديوهات مراجعة مركزة لليالي الامتحان
                </h3>
                <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300">
                  معسكرات ختامية مكثفة تلخص المنهج كاملاً في ساعات وجيزة ليلة الاختبار لضمان التثبيت الذهني التام.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                متاحة مجاناً للمشتركين
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
