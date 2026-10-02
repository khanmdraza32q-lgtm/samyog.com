import React, { useState, useEffect } from 'react';
import { AlertCircle, Cpu, FileCheck2, Users, TrendingUp, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { playTechChime } from '../utils/audio.ts';

interface ConnectionVisualProps {
  onLaunchRaza?: () => void;
  reducedMotion?: boolean;
}

export const ConnectionVisual: React.FC<ConnectionVisualProps> = ({ onLaunchRaza, reducedMotion = false }) => {
  const [activeStep, setActiveStep] = useState<number>(1); // 0 to 4
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulatedImpactCount, setSimulatedImpactCount] = useState<number>(84200);

  const stages = [
    {
      id: 0,
      name: 'Problem',
      nepaliTag: 'समस्या पहिचान',
      badge: 'Step 01',
      icon: AlertCircle,
      color: 'from-amber-500 to-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      summary: 'Citizen reports localized civic issue (pothole, waste pile, dark alley, contaminated well) with geo-tag.',
      metricLabel: 'Reported in Ward 16',
      metricVal: 'Bagmati plastic surge',
    },
    {
      id: 1,
      name: 'RAZA AI',
      nepaliTag: 'बुद्धिमान विश्लेषण',
      badge: 'Step 02',
      icon: Cpu,
      color: 'from-cyan-400 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.5)',
      summary: 'RAZA analyzes root causes, maps ward jurisdiction, estimates costs in NPR, and drafts multi-phase action plans.',
      metricLabel: 'Processing Neural Core',
      metricVal: '3 Phases + 4 Roles',
    },
    {
      id: 2,
      name: 'Action Plan',
      nepaliTag: 'कार्य योजना',
      badge: 'Step 03',
      icon: FileCheck2,
      color: 'from-teal-400 to-emerald-500',
      glowColor: 'rgba(20, 184, 166, 0.4)',
      summary: 'Action plan transformed into a structured community mission with transparent tasks, safety kits, and equipment lists.',
      metricLabel: 'Procurement & Protocols',
      metricVal: '25 Kits • Rs 48.5k',
    },
    {
      id: 3,
      name: 'People',
      nepaliTag: 'जनसहभागिता',
      badge: 'Step 04',
      icon: Users,
      color: 'from-indigo-400 to-purple-500',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      summary: 'Neighborhood volunteers, youth clubs, ward committees, and local technicians mobilize on the ground together.',
      metricLabel: 'Volunteers Connected',
      metricVal: '34 Active Nodes',
    },
    {
      id: 4,
      name: 'Impact',
      nepaliTag: 'स्थायी प्रभाव',
      badge: 'Step 05',
      icon: TrendingUp,
      color: 'from-emerald-400 to-teal-300',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      summary: 'Civic verification, measurable outcome logged on-chain/ledger, ward handover complete, clean streets restored.',
      metricLabel: 'Verified Citizens Benefited',
      metricVal: `${simulatedImpactCount.toLocaleString()} Citizens`,
    },
  ];

  // Auto-play the pipeline flow
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 5;
        playTechChime(next === 1 ? 'processing' : next === 4 ? 'success' : 'node');
        if (next === 4) {
          setSimulatedImpactCount((c) => c + 15);
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying, reducedMotion]);

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setActiveStep(index);
    playTechChime(index === 1 ? 'processing' : index === 4 ? 'success' : 'click');
  };

  const handleTogglePlay = () => {
    playTechChime('click');
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playTechChime('click');
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient container glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-slate-900/30 to-emerald-950/20 rounded-3xl blur-xl -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SIGNATURE ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            The SAMYOJ Civic Flow Engine
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mt-1">
            Real-time digital transformation pipeline converting isolated neighborhood problems into verified collective community victories.
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 fill-emerald-400' : ''}`} />
            <span>{isPlaying ? 'Pause Simulation' : 'Auto Play'}</span>
          </button>
          <button
            onClick={handleReset}
            title="Restart flow"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The 5-Stage Animated Pipeline Grid */}
      <div className="relative glass-panel rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-800 shadow-2xl">
        {/* Subtle connecting pulse line for desktop */}
        <div className="hidden lg:block absolute top-20 left-16 right-16 h-1 bg-slate-800/80 -z-0">
          {/* Animated active gradient bar */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${(activeStep / 4) * 100}%` }}
          />

          {/* Traveling energy photon */}
          {!reducedMotion && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#38bdf8] transition-all duration-700 ease-out -ml-2 border-2 border-cyan-400"
              style={{ left: `${(activeStep / 4) * 100}%` }}
            />
          )}
        </div>

        {/* 5 Stage Node Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {stages.map((st, idx) => {
            const isCurrent = activeStep === idx;
            const isCompleted = activeStep > idx;
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                onClick={() => handleStepClick(idx)}
                className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer text-left border ${
                  isCurrent
                    ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.25)] scale-[1.02]'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-90'
                }`}
              >
                {/* Node icon circle */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? `bg-gradient-to-br ${st.color} text-slate-950 shadow-lg`
                        : isCompleted
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400">
                    {st.badge}
                  </span>
                </div>

                {/* Stage Title */}
                <div className="flex items-baseline gap-2 mb-1">
                  <h3
                    className={`font-display font-bold text-base transition-colors ${
                      isCurrent ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {st.name}
                  </h3>
                  <span className="text-[11px] font-sans text-cyan-400/80">{st.nepaliTag}</span>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
                  {st.summary}
                </p>

                {/* Live Node Metric Pill */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col">
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    {st.metricLabel}
                  </span>
                  <span className="text-xs font-semibold text-cyan-300 truncate">
                    {st.metricVal}
                  </span>
                </div>

                {/* Active Indicator Pulse Ring */}
                {isCurrent && !reducedMotion && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Focus Bar for Selected Stage */}
        <div className="mt-6 pt-5 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div className="text-xs text-slate-300">
              <span className="text-slate-400 font-mono uppercase mr-2">Current Active Node:</span>
              <strong className="text-white font-semibold">{stages[activeStep].name}</strong> —{' '}
              {stages[activeStep].summary}
            </div>
          </div>

          {onLaunchRaza && (
            <button
              onClick={() => {
                playTechChime('success');
                onLaunchRaza();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-medium transition cursor-pointer flex-shrink-0"
            >
              <span>Launch RAZA AI Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
