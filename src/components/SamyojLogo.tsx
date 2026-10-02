import React from 'react';

interface SamyojLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
}

export const SamyojLogo: React.FC<SamyojLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-base font-bold', sub: 'text-[9px]' },
    md: { icon: 34, text: 'text-xl font-bold', sub: 'text-[10px]' },
    lg: { icon: 46, text: 'text-2xl font-bold', sub: 'text-xs' },
    hero: { icon: 68, text: 'text-4xl md:text-5xl font-black', sub: 'text-sm tracking-[0.28em]' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Ambient aura glow */}
        {animate && (
          <div
            className="absolute inset-0 rounded-2xl bg-cyan-500/25 blur-md animate-pulse"
            style={{ width: current.icon + 10, height: current.icon + 10, margin: -5 }}
          />
        )}

        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="samyojGrad1" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="samyojCore" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <radialGradient id="ringGlow" cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer geometric shield */}
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            stroke="url(#samyojGrad1)"
            strokeWidth="3.5"
            fill="rgba(8, 14, 26, 0.75)"
            strokeLinejoin="round"
          />

          {/* Rotating node orbit ring */}
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Tri-connection arcs: Problem, Action, Impact */}
          <path
            d="M 50 20 L 50 50 L 76 65"
            stroke="url(#samyojGrad1)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 50 50 L 24 65"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Node points */}
          <circle cx="50" cy="20" r="4.5" fill="#38BDF8" className={animate ? 'animate-pulse' : ''} />
          <circle cx="76" cy="65" r="4.5" fill="#06B6D4" />
          <circle cx="24" cy="65" r="4.5" fill="#10B981" />

          {/* RAZA Central Core */}
          <circle cx="50" cy="50" r="7.5" fill="url(#samyojCore)" />
          <circle cx="50" cy="50" r="11" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.8" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent ${current.text}`}>
            SAMYOJ
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </div>
        {showSubtitle && (
          <span className={`font-mono text-cyan-400/80 uppercase font-medium tracking-[0.2em] ${current.sub}`}>
            Community OS
          </span>
        )}
      </div>
    </div>
  );
};
