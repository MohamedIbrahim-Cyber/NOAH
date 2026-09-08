import React from 'react';
import { BrandTheme } from '../types';
import { LogoBadge } from './LogoBadge';
import { getThemeColors } from '../lib/theme';
import { TRACK_FILTER_CHIPS } from '../data/mockData';
import { ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react';

interface FooterAndCtaProps {
  currentTheme: BrandTheme;
  onOpenSignup: () => void;
  onOpenLogin: () => void;
  onHelpClick: () => void;
  onSelectTrackChip?: (trackName: string) => void;
}

export const FooterAndCta: React.FC<FooterAndCtaProps> = ({
  currentTheme,
  onOpenSignup,
  onOpenLogin,
  onHelpClick,
  onSelectTrackChip,
}) => {
  const colors = getThemeColors(currentTheme);

  return (
    <div className="pt-6 sm:pt-8 pb-10 sm:pb-12 px-3 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16" dir="rtl">
      {/* SECTION 14: Track/Category Filter Chips Row */}
      <section className="overflow-hidden">
        <div className="text-right mb-3 sm:mb-4">
          <span className="font-camel text-xs sm:text-sm font-bold text-neutral-700 dark:text-slate-300">
            تصفح الكورسات والمذكرات حسب المسار التعليمي:
          </span>
        </div>

        {/* Horizontally scrollable row of pill-shaped cards */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {TRACK_FILTER_CHIPS.map((chip) => (
            <div
              key={chip.id}
              onClick={() => onSelectTrackChip && onSelectTrackChip(chip.trackName)}
              className="min-w-[220px] sm:min-w-[240px] p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#1E293B' : currentTheme === 'fresh' ? '#F9FADE' : '#EFE4D0',
                borderColor: colors.borderColor,
              }}
            >
              {/* 2 lines of small text describing benefit */}
              <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {chip.benefit}
              </p>

              {/* Track label at bottom */}
              <div
                className="font-camel text-xs font-bold pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between"
                style={{ color: currentTheme === 'dark' ? '#38BDF8' : colors.primary }}
              >
                <span>{chip.trackName}</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 15: Bottom CTA Banner */}
      <section>
        <div
          className="rounded-3xl p-6 sm:p-10 lg:p-12 border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-right"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#111C30' : currentTheme === 'fresh' ? '#FCFDE3' : '#F4EAD8',
            borderColor: colors.borderColor,
          }}
        >
          {/* Right Text Column */}
          <div className="max-w-xl">
            <h2 className="font-camel text-xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-slate-100 mb-3">
              ابدأ رحلة التفوق في مسارات الثانوية العامة الآن ✨
            </h2>
            <p className="font-ui text-xs sm:text-sm lg:text-base text-neutral-600 dark:text-slate-300 mb-6 leading-relaxed">
              جرّب أول محاضرة مجاناً وشوف الفرق بنفسك. انضم إلى أكثر من 25 ألف طالب وطالبة يحققون أعلى الدرجات مع نوح أكاديمي.
            </p>

            <button
              onClick={onOpenSignup}
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3"
              style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
            >
              <span>ابدأ رحلتك</span>
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>

          {/* Left Visual: Circular Logo Badge */}
          <div className="shrink-0 p-2 sm:p-4">
            <LogoBadge size="lg" showText={false} theme={currentTheme} />
          </div>
        </div>
      </section>

      {/* SECTION 16: Footer (4-Column, RTL) */}
      <footer
        className="pt-10 sm:pt-12 border-t text-right"
        style={{ borderColor: colors.borderColor }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {/* Column 1 (Far Right): Logo & Brand Wordmark in Gold & Copyright */}
          <div>
            <div className="mb-4">
              <span className="font-qahwa text-2xl sm:text-3xl font-black text-amber-400 block">
                نوح أكاديمي
              </span>
              <span className="font-old-standard text-xs text-neutral-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                NOHE ACADEMY SAUDI EDTECH
              </span>
            </div>
            <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 leading-relaxed mb-4">
              المنصة التعليمية الرائدة لطلاب مسارات الثانوية العامة في المملكة العربية السعودية.
            </p>
            <div className="text-xs text-neutral-500 dark:text-slate-400 font-medium">
              جميع الحقوق محفوظة © 2026
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 dark:text-slate-400 font-ui">
              <span>تصميم وبرمجة شركة Web Logic</span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
            </div>
          </div>

          {/* Column 2: Pages / "الصفحات" */}
          <div>
            <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100 mb-4 pb-1 border-b border-black/5 dark:border-white/10">
              الصفحات
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-600 dark:text-slate-300">
              <li>
                <a href="#hero-section" className="hover:text-amber-500 transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <button onClick={onOpenSignup} className="hover:text-amber-500 transition-colors text-right cursor-pointer">
                  انشاء حساب جديد
                </button>
              </li>
              <li>
                <button onClick={onOpenLogin} className="hover:text-amber-500 transition-colors text-right cursor-pointer">
                  تسجيل الدخول
                </button>
              </li>
              <li>
                <a href="#courses-section" className="hover:text-amber-500 transition-colors">
                  كورسات المسارات
                </a>
              </li>
              <li>
                <a href="#packages-section" className="hover:text-amber-500 transition-colors">
                  الباقات والكومبو
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media / "السوشيال ميديا" */}
          <div>
            <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100 mb-4 pb-1 border-b border-black/5 dark:border-white/10">
              السوشيال ميديا
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-600 dark:text-slate-300">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span>فيسبوك (+150K)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors flex items-center gap-2">
                  <span>انستجرام</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors flex items-center gap-2">
                  <span>يوتيوب (+250K)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors flex items-center gap-2">
                  <span>تيك توك</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 (Far Left): Support & "المساعدة" Button */}
          <div>
            <h4 className="font-camel text-sm font-bold text-neutral-900 dark:text-slate-100 mb-2">
              تواصل مع دعم منصة نوح التعليمية من هنا
            </h4>
            <div className="text-2xl mb-4 select-none">
              👇
            </div>
            <p className="font-ui text-xs text-neutral-600 dark:text-slate-300 mb-4">
              فريق الدعم الفني والأكاديمي متواجد للإجابة عن أسئلتكم على مدار الساعة.
            </p>
            <button
              onClick={onHelpClick}
              className="w-full py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: currentTheme === 'dark' ? '#0284C7' : colors.primary }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>المساعدة</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
