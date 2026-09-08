import React from 'react';
import { BrandTheme } from '../types';
import { LogoBadge } from './LogoBadge';
import { getThemeColors } from '../lib/theme';
import { GraduationCap, Sparkles, BookOpen, CheckCircle2, ArrowLeft, Award, BookCheck, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  currentTheme: BrandTheme;
  onCtaClick: () => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentTheme,
  onCtaClick,
  onExploreCourses,
}) => {
  const colors = getThemeColors(currentTheme);

  return (
    <section id="hero-section" className="pt-4 sm:pt-6 pb-12 sm:pb-14 px-3 sm:px-6 max-w-7xl mx-auto" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Right Column: Hero Content & Stats (in RTL, Right is the first column visually) */}
        <div className="lg:col-span-7 flex flex-col items-start text-right">
          {/* Large Bold Heading */}
          <h1 className="font-qahwa text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.2] mb-4 sm:mb-5 tracking-tight text-[#1C1712] dark:text-[#FFF9EF]">
            منصة <span style={{ color: '#D97706' }}>نوح</span> التعليمية
          </h1>

          {/* Paragraph Description with Darker High-Contrast Text */}
          <p className="font-ui text-sm sm:text-base lg:text-lg text-[#2A1F17] dark:text-[#FFF9EF] font-medium leading-relaxed max-w-2xl mb-6 sm:mb-8">
            منصة تعليمية متكاملة لطلاب المرحلة الثانوية والمسارات في المملكة العربية السعودية، تجمع نخبة من أفضل المعلمين لشرح كافة المواد الدراسية بأسلوب يجمع بين التبسيط والعمق الأكاديمي.
          </p>

          {/* Primary CTA Button & Secondary action */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
            <button
              id="hero-cta-button"
              onClick={onCtaClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-3 text-neutral-950"
              style={{
                backgroundColor: '#D6C3A3',
              }}
            >
              <span>أنشئ حسابك الآن!</span>
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>

            <button
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-base border transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-center gap-2"
              style={{
                borderColor: colors.borderColor,
                color: colors.primary,
              }}
            >
              <BookCheck className="w-4 h-4" />
              <span>استعرض الكورسات المتاحة</span>
            </button>
          </div>

          {/* Academic Excellence Stats Row Below CTA */}
          <div className="w-full pt-4 border-t" style={{ borderColor: colors.borderSubtle }}>
            <h2 className="font-camel text-xs sm:text-sm font-bold text-neutral-800 dark:text-[#FFF9EF] mb-3 sm:mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>طلاب اليوم .. قادة الغد!</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full">
              {/* Stat 1: +25K */}
              <div
                className="rounded-2xl p-3.5 sm:p-4 border flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <div className="font-impact text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-[#FFF9EF]" dir="ltr">
                    +25,000
                  </div>
                  <div className="font-ui text-xs font-semibold text-neutral-700 dark:text-[#E8D9C0]">
                    طالب حققوا التميز
                  </div>
                </div>
              </div>

              {/* Stat 2: +180 */}
              <div
                className="rounded-2xl p-3.5 sm:p-4 border flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <BookOpen className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <div className="font-impact text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-[#FFF9EF]" dir="ltr">
                    +180
                  </div>
                  <div className="font-ui text-xs font-semibold text-neutral-700 dark:text-[#E8D9C0]">
                    كورس ومحاضرة تخصصية
                  </div>
                </div>
              </div>

              {/* Stat 3: 99% */}
              <div
                className="rounded-2xl p-3.5 sm:p-4 border flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <div className="font-impact text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-[#FFF9EF]" dir="ltr">
                    99%
                  </div>
                  <div className="font-ui text-xs font-semibold text-neutral-700 dark:text-[#E8D9C0]">
                    نسبة رضا واجتياز الطلاب
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Visual Circular Badge + "عن المنصة" Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          {/* Large Circular Logo Badge */}
          <div className="relative p-4 sm:p-6 flex justify-center items-center">
            {/* Soft Ambient Glow */}
            <div
              className="absolute inset-0 rounded-full filter blur-2xl opacity-20 transition-colors"
              style={{
                backgroundColor: colors.secondary,
              }}
            />
            <div className="relative z-10">
              <LogoBadge size="xl" showText={false} theme={currentTheme} />
            </div>
          </div>

          {/* White Rounded Card: "عن المنصة" */}
          <div
            id="about-section"
            className="w-full mt-3 sm:mt-4 rounded-3xl p-5 sm:p-7 border shadow-md hover:shadow-lg transition-shadow text-right"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: colors.primary }}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
              </div>
              <h2 className="font-camel text-base sm:text-lg font-bold text-neutral-950 dark:text-[#FFF9EF]">
                عن المنصة
              </h2>
            </div>
            <p className="font-ui text-xs sm:text-sm lg:text-base text-neutral-700 dark:text-[#E8D9C0] leading-relaxed">
              نوح أكاديمي بيئة تعليمية ذكية صُممت خصيصاً لمواكبة نظام مسارات الثانوية العامة في المملكة. نوفر لطلابنا شروحات مرئية فائقة الجودة، بنك أسئلة واختبارات تفاعلية محاكية لنمط القياس، مع منظومة متابعة دقيقة تضمن تحقيق أعلى الدرجات بإذن الله.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

