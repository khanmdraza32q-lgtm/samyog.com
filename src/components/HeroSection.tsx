import React, { useState } from 'react';
import { ArrowRight, Sparkles, MapPin, CheckCircle2, Shield, Users } from 'lucide-react';
import { playTechChime } from '../utils/audio.ts';

interface HeroSectionProps {
  onQuickDiagnose: (problemText: string) => void;
  onExploreInitiatives: () => void;
  onOpenFlow: () => void;
  reducedMotion?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickDiagnose,
  onExploreInitiatives,
  onOpenFlow,
  reducedMotion = false,
}) => {
  const [problemQuery, setProblemQuery] = useState('');

  const quickPresets = [
    'Plastic blockages near Teku Ghats',
    'Dark alleys in Patan Ward 16',
    'Contaminated drinking water sprout',
    'Heritage Falcha wood repair',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemQuery.trim()) return;
    playTechChime('processing');
    onQuickDiagnose(problemQuery.trim());
  };

  const handleSelectPreset = (text: string) => {
    setProblemQuery(text);
    playTechChime('click');
    onQuickDiagnose(text);
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Centered Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-600/15 via-blue-500/10 to-emerald-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid overlay for hero depth */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Futuristic Status Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wider uppercase font-semibold">SAMYOJ CIVIC OS v2.4</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" /> Nepal Community Grid
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.12] mb-6">
          The Community Operating System for{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
            Collective Action
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
          Bridge citizen voices with intelligent action. Powered by{' '}
          <span className="text-cyan-300 font-medium">RAZA AI</span> to transform local civic
          challenges into verified neighborhood initiatives, volunteer mobilizations, and measurable impact.
        </p>

        {/* Quick Problem Diagnosis Launcher Input */}
        <div className="w-full max-w-2xl mb-6">
          <form
            onSubmit={handleSubmit}
            className="relative glass-panel-glow p-2 rounded-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
              <input
                type="text"
                value={problemQuery}
                onChange={(e) => setProblemQuery(e.target.value)}
                placeholder="What civic challenge does your neighborhood face? (e.g. Broken water tap, dark alley)"
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 cursor-pointer flex-shrink-0"
            >
              <span>Diagnose with RAZA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Scenarios:</span>
            {quickPresets.map((pr) => (
              <button
                key={pr}
                onClick={() => handleSelectPreset(pr)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 transition cursor-pointer"
              >
                {pr}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <button
            onClick={() => {
              playTechChime('click');
              onExploreInitiatives();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-medium tracking-wide transition cursor-pointer shadow-lg"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Explore Active Initiatives (6)</span>
          </button>

          <button
            onClick={() => {
              playTechChime('click');
              onOpenFlow();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <span>How SAMYOJ Works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Mini Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-4xl">
          <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 font-display">RAZA AI Civic Engine</h4>
              <p className="text-[11px] text-slate-400">Automates 3-phase action plans & resource budgeting</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 font-display">Ward Committee Liaison</h4>
              <p className="text-[11px] text-slate-400">Direct municipal alignment and civic verification</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 font-display">Proof of Real Impact</h4>
              <p className="text-[11px] text-slate-400">Photographic tracking & verified community outcomes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
