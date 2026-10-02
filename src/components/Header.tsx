import React from 'react';
import { SamyojLogo } from './SamyojLogo.tsx';
import { Volume2, VolumeX, Sparkles, PlusCircle, Activity, Zap } from 'lucide-react';
import { playTechChime } from '../utils/audio.ts';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenCreateModal: () => void;
  onOpenAchievements: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  reducedMotion,
  setReducedMotion,
  soundEnabled,
  setSoundEnabled,
  onOpenCreateModal,
  onOpenAchievements,
}) => {
  const navItems = [
    { id: 'home', label: 'Network' },
    { id: 'flow', label: 'SAMYOJ Flow' },
    { id: 'raza', label: 'RAZA AI Brain' },
    { id: 'initiatives', label: 'Initiatives' },
    { id: 'map', label: 'Civic Map' },
    { id: 'impact', label: 'Impact' },
  ];

  const handleNavClick = (id: string) => {
    playTechChime('click');
    setActiveTab(id);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playTechChime('success');
  };

  const toggleMotion = () => {
    playTechChime('click');
    setReducedMotion(!reducedMotion);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-950/50 bg-[#05070e]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          <SamyojLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-cyan-500/15 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]" />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.id === 'raza' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right utility cluster */}
        <div className="flex items-center gap-2.5">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Disable futuristic audio chimes' : 'Enable audio tactile chimes'}
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              soundEnabled
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleMotion}
            title={reducedMotion ? 'Enable smooth animations' : 'Reduce animations for accessibility'}
            aria-label="Toggle motion reduction"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-all cursor-pointer ${
              reducedMotion
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{reducedMotion ? 'Reduced Motion' : 'Motion: FX'}</span>
          </button>

          {/* Achievements badge button */}
          <button
            onClick={() => {
              playTechChime('click');
              onOpenAchievements();
            }}
            title="View Civic Achievements"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-900/30 text-xs font-medium transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Badges</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* New Initiative / Report button */}
          <button
            onClick={() => {
              playTechChime('click');
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold tracking-wide hover:shadow-[0_0_18px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Launch Initiative</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
