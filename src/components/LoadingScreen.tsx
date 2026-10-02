import React, { useEffect, useState } from 'react';
import { SamyojLogo } from './SamyojLogo.tsx';

interface LoadingScreenProps {
  onComplete?: () => void;
  reducedMotion?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, reducedMotion = false }) => {
  const [step, setStep] = useState<number>(0); // 0: initial, 1: logo in, 2: tagline in, 3: fade out

  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 650);
    const t3 = setTimeout(() => setStep(3), 1600);
    const t4 = setTimeout(() => onComplete?.(), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [reducedMotion, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070e] transition-opacity duration-500 ${
        step === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Futuristic concentric grid circles */}
      <div className="absolute w-80 h-80 rounded-full border border-cyan-500/10 animate-orbit pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full border border-emerald-500/15 animate-orbit-reverse pointer-events-none" />

      {/* Centered content */}
      <div className="relative flex flex-col items-center text-center px-4">
        {/* Animated emblem & Logo */}
        <div
          className={`transform transition-all duration-700 ease-out ${
            step >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}
        >
          <SamyojLogo size="hero" showSubtitle={false} />
        </div>

        {/* Tagline: Connect. Act. Grow. */}
        <div
          className={`mt-6 font-display text-sm md:text-base tracking-[0.3em] uppercase text-cyan-200/90 font-medium transition-all duration-700 delay-100 ${
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-cyan-400">Connect</span>
          <span className="mx-2 text-slate-500">•</span>
          <span className="text-emerald-400">Act</span>
          <span className="mx-2 text-slate-500">•</span>
          <span className="text-indigo-400">Grow</span>
        </div>

        {/* Minimal futuristic progress loader bar */}
        <div className="w-48 h-[2px] bg-slate-800 rounded-full mt-8 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 transition-all duration-1000 ease-out rounded-full"
            style={{ width: step === 0 ? '5%' : step === 1 ? '45%' : '100%' }}
          />
        </div>

        {/* Status text */}
        <span className="font-mono text-[11px] text-slate-400 mt-3 tracking-widest uppercase">
          Initializing Civic OS & Core v2.4
        </span>
      </div>
    </div>
  );
};
