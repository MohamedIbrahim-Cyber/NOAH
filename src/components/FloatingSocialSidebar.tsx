import React, { useState } from 'react';
import { BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import { MessageCircle, Send, X, ExternalLink } from 'lucide-react';

interface FloatingSocialSidebarProps {
  currentTheme: BrandTheme;
}

export const FloatingSocialSidebar: React.FC<FloatingSocialSidebarProps> = ({ currentTheme }) => {
  const [supportModal, setSupportModal] = useState<'whatsapp' | 'telegram' | null>(null);
  const colors = getThemeColors(currentTheme);

  const modalBg = colors.cardBg;
  const modalBorder = colors.borderColor;
  const textTitle = currentTheme === 'dark' ? 'text-[#FFF9EF]' : 'text-neutral-900';
  const textSub = currentTheme === 'dark' ? 'text-[#E8D9C0]' : 'text-neutral-600';

  return (
    <>
      {/* Lower Circular Floating Action Buttons (Telegram & WhatsApp) */}
      <div
        id="floating-chat-buttons"
        className="fixed right-3 bottom-6 z-40 flex flex-col gap-3 select-none"
      >
        {/* Telegram Button */}
        <button
          onClick={() => setSupportModal('telegram')}
          title="قناة التيليجرام الرسمية"
          className="w-12 h-12 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 text-neutral-950 cursor-pointer relative group"
          style={{ backgroundColor: '#D6C3A3' }}
        >
          <Send className="w-5 h-5 -translate-x-0.5" />
          <span className="absolute right-14 bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            قناة التليجرام
          </span>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => setSupportModal('whatsapp')}
          title="تواصل معنا عبر واتساب"
          className="w-12 h-12 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 text-white cursor-pointer relative group"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-700 rounded-full border-2 border-white" />
          <span className="absolute right-14 bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            واتساب الدعم السريع
          </span>
        </button>
      </div>

      {/* Support Chat Modal */}
      {supportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" dir="rtl">
          <div
            className="rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: modalBg,
              borderColor: modalBorder,
            }}
          >
            <button
              onClick={() => setSupportModal(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-200 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {supportModal === 'whatsapp' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className={`font-camel text-xl font-bold ${textTitle} mb-2`}>
                  دعم نوح أكاديمي عبر واتساب
                </h3>
                <p className={`text-sm ${textSub} mb-4 font-ui`}>
                  فريق التوجيه والدعم الأكاديمي جاهز للرد على استفسارات الطلاب وأولياء الأمور طوال أيام الأسبوع.
                </p>
                <div
                  className="rounded-xl p-3 border mb-5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-center font-impact tracking-wider"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#2C241E' : '#ECFDF5',
                    borderColor: currentTheme === 'dark' ? '#3A3028' : '#A7F3D0',
                  }}
                >
                  +966 55 892 4110
                </div>
                <a
                  href="https://wa.me/966558924110?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%85%D9%86%D8%B5%D8%A9%20%D9%86%D9%88%D8%AD%20%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%83%D9%88%D8%B1%D8%B3%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  بدء المحادثة الفورية
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-950 shadow-md"
                  style={{ backgroundColor: '#D6C3A3' }}
                >
                  <Send className="w-8 h-8 -translate-x-0.5" />
                </div>
                <h3 className={`font-camel text-xl font-bold ${textTitle} mb-2`}>
                  قناة التليجرام التعليمية
                </h3>
                <p className={`text-sm ${textSub} mb-4 font-ui`}>
                  ملخصات PDF مجانية، بنك أسئلة الوزارة، وجداول مواعيد الحصص المباشرة والاختبارات الدورية.
                </p>
                <div
                  className="rounded-xl p-3 border mb-5 text-sm font-semibold text-center font-impact"
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#2C241E' : '#F7EFE3',
                    borderColor: modalBorder,
                    color: colors.primary,
                  }}
                >
                  @NoheAcademy_SA
                </div>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: '#D6C3A3' }}
                >
                  <Send className="w-5 h-5" />
                  الانضمام للقناة مجاناً
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
