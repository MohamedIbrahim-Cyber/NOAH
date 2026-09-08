import React from 'react';
import { PackageBundle, BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import { Check, Sparkles, ArrowLeft, Layers, Zap } from 'lucide-react';

interface PackagesSectionProps {
  packages: PackageBundle[];
  comboPackage: PackageBundle;
  currentTheme: BrandTheme;
  onSelectPackage: (pkg: PackageBundle) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  comboPackage,
  currentTheme,
  onSelectPackage,
}) => {
  const colors = getThemeColors(currentTheme);

  return (
    <div id="packages-section" className="py-10 sm:py-14 px-3 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16" dir="rtl">
      {/* SECTION 12: Term & Full-Year Packages */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-camel text-xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100 mb-2">
            باقات الترم والسنة الكاملة
          </h2>
          <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300">
            وفّر وقتك وجهدك واشترك في باقات المنهج الكاملة بخصم حصري ومزايا متابعة فردية مستمرة
          </p>
        </div>

        {/* 2-Column Large Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
            >
              {/* Banner Area */}
              <div className="relative h-44 sm:h-52 bg-gradient-to-l from-amber-900 via-rose-950 to-slate-900 p-5 sm:p-6 flex flex-col justify-between text-white overflow-hidden">
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Top badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-amber-400 text-neutral-950 font-black text-xs px-3 py-1 rounded-full shadow">
                    {pkg.badge}
                  </span>
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="font-impact text-base sm:text-lg font-bold text-amber-300 leading-none" dir="ltr">
                      {pkg.price}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-200">ر.س</span>
                  </div>
                </div>

                {/* Bundle Big Title */}
                <div className="relative z-10">
                  <h3 className="font-camel text-lg sm:text-2xl font-black text-white leading-snug drop-shadow-md">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              {/* Package Body */}
              <div className="p-5 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  {/* Tag Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {pkg.tag1 && (
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-md"
                        style={{
                          backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#EAEEC3' : '#E5D8C3',
                          color: currentTheme === 'dark' ? '#38BDF8' : colors.primary,
                        }}
                      >
                        {pkg.tag1}
                      </span>
                    )}
                    {pkg.tag2 && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-md bg-black/5 dark:bg-slate-800 text-neutral-700 dark:text-slate-300">
                        {pkg.tag2}
                      </span>
                    )}
                  </div>

                  <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Checklist with Green Checkmarks */}
                  <div className="space-y-3 mb-6">
                    {pkg.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Subscribe Footer */}
                <div className="pt-5 sm:pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-slate-400 font-semibold mb-0.5">
                      السعر الموحد:
                    </div>
                    <div className="flex items-baseline gap-2" dir="rtl">
                      <span className="font-impact text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">
                        {pkg.price} ر.س
                      </span>
                      <span className="font-ui text-xs text-red-500 line-through">
                        {pkg.originalPrice} ر.س
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                    style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
                  >
                    <span>اشترك الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: Combo Packages (الكومبو) */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h2 className="font-camel text-xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
            <span>🎓 باقات الكورسات المشتركة (الكومبو)</span>
          </h2>
          <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300">
            اجمع أكثر من مادة في اشتراك واحد ووفر نصف التكلفة مع مزايا الدخول الشامل
          </p>
        </div>

        {/* Large Single Wide Card */}
        <div
          className="rounded-3xl border shadow-lg overflow-hidden max-w-5xl mx-auto"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Banner: Instructors Graphic (Spans 5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1E1B4B] via-[#31103F] to-[#4C0519] p-5 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Ribbon Badge Top-Right: "باقة التوفير" */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-md border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  {comboPackage.badge}
                </span>
              </div>

              {/* Graphic background */}
              <div className="my-auto py-6 sm:py-8 text-center relative z-10">
                <div className="font-qahwa text-2xl sm:text-4xl font-extrabold text-[#F5D278] mb-2 drop-shadow">
                  كومبو الشهر الحالي
                </div>
                <p className="text-xs text-neutral-200 font-medium max-w-xs mx-auto">
                  حزمة متكاملة من اللغة العربية والبرمجة والتأسيس الشامل لطلاب المسارات
                </p>
              </div>

              {/* Savings callout in banner */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
                <span className="text-xs text-amber-300 font-bold block">
                  خصم استثنائي لطلاب دفعة 2026
                </span>
                <span className="font-impact text-lg sm:text-xl font-bold text-white">
                  50% توفير فوري
                </span>
              </div>
            </div>

            {/* Content Body (Spans 7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-camel text-lg sm:text-2xl font-black text-neutral-900 dark:text-slate-100 mb-2">
                  {comboPackage.title}
                </h3>
                <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mb-5 sm:mb-6 leading-relaxed">
                  {comboPackage.description}
                </p>

                {/* Bulleted list */}
                <div className="mb-6">
                  <div className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>الوحدات المشمولة بالباقة:</span>
                  </div>
                  <ul className="space-y-2.5">
                    {comboPackage.includedUnits?.map((unit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 dark:text-slate-200 font-medium">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                          •
                        </span>
                        <span>{unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price Block & CTA Button */}
              <div className="pt-5 sm:pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-500 dark:text-slate-400 font-semibold mb-1">
                    السعر الموحد:
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-ui text-xs sm:text-sm text-red-500 line-through font-bold">
                      {comboPackage.originalPrice} ر.س
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      وفر 300 ر.س
                    </span>
                    <span className="font-impact text-xl sm:text-3xl font-black text-sky-600 dark:text-sky-400" dir="ltr">
                      {comboPackage.price} ر.س
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPackage(comboPackage)}
                  className="px-6 sm:px-8 py-3 rounded-full font-bold text-xs sm:text-base text-neutral-950 shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  style={{ backgroundColor: '#F5D278' }}
                >
                  <Zap className="w-4 h-4 text-amber-900" />
                  <span>اشترك في الكومبو الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
