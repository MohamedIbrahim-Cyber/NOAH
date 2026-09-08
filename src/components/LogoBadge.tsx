import React from 'react';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  theme?: 'fresh' | 'warm-earth' | 'dark';
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  size = 'md',
  showText = true,
  textColor,
  theme = 'fresh',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-13 sm:h-13',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40',
  };

  const ringColor = theme === 'dark' ? '#38BDF8' : theme === 'fresh' ? '#F5D278' : '#D6C3A3';
  const primaryText = theme === 'dark' ? 'text-[#F8FAFC]' : theme === 'fresh' ? 'text-[#6F384F]' : 'text-[#3A3028]';

  return (
    <div className="flex items-center gap-3 select-none" dir="rtl">
      {/* Circular Navy Badge with Gold Details */}
      <div className={`relative ${sizeMap[size]} rounded-full bg-[#182035] flex items-center justify-center shadow-md shrink-0 border-2 border-[#F5D278]/40`}>
        {/* Decorative Geometric Star Pattern Ring */}
        <svg
          className="absolute inset-0 w-full h-full p-0.5 opacity-60"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="46" stroke={ringColor} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="42" stroke={ringColor} strokeWidth="0.75" opacity="0.5" />
          {/* Subtle 8-point geometric star accents */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <circle
              key={i}
              cx={50 + 44 * Math.cos((angle * Math.PI) / 180)}
              cy={50 + 44 * Math.sin((angle * Math.PI) / 180)}
              r="1.2"
              fill={ringColor}
            />
          ))}
        </svg>

        {/* Graduation Cap atop "نوح" */}
        <div className="absolute top-1.5 md:top-2 flex justify-center">
          <svg
            className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-[#F5D278] drop-shadow`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.8" />
          </svg>
        </div>

        {/* Central Gold "نوح" Text */}
        <div className="text-center pt-2 flex flex-col items-center">
          <span
            className={`font-qahwa font-black text-[#F5D278] leading-none drop-shadow-sm ${
              size === 'sm'
                ? 'text-sm'
                : size === 'md'
                ? 'text-lg'
                : size === 'lg'
                ? 'text-2xl'
                : 'text-4xl md:text-5xl'
            }`}
          >
            نوح
          </span>
          {/* Tiny Script Tagline inside Circle */}
          <span
            className={`text-[#F5D278]/90 font-medium tracking-tighter ${
              size === 'sm'
                ? 'hidden'
                : size === 'md'
                ? 'text-[7px]'
                : size === 'lg'
                ? 'text-[9px]'
                : 'text-[11px] mt-0.5'
            }`}
          >
            نحو نحو جديد
          </span>
        </div>
      </div>

      {/* Brand Text Lockup */}
      {showText && (
        <div className="flex flex-col text-right min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-qahwa font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight truncate ${textColor || primaryText}`}>
              نوح أكاديمي
            </span>
          </div>
          <span className="font-old-standard text-[9px] sm:text-[11px] tracking-wider text-[#A997B2] font-normal uppercase hidden xs:block truncate">
            Nohe EdTech Academy
          </span>
        </div>
      )}
    </div>
  );
};
