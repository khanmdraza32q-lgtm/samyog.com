import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Users,
  Clock,
  Building,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ActivityEvent } from '../types.ts';
import { RECENT_ACTIVITIES } from '../data/mockData.ts';
import { playTechChime } from '../utils/audio.ts';

interface ImpactDashboardProps {
  reducedMotion?: boolean;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ reducedMotion = false }) => {
  // Animated counters
  const [solvedCount, setSolvedCount] = useState(0);
  const [hoursCount, setHoursCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [wardsCount, setWardsCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Targets
  const targetSolved = 142;
  const targetHours = 18450;
  const targetPeople = 84200;
  const targetWards = 24;

  useEffect(() => {
    if (reducedMotion) {
      setSolvedCount(targetSolved);
      setHoursCount(targetHours);
      setPeopleCount(targetPeople);
      setWardsCount(targetWards);
      setHasAnimated(true);
      return;
    }

    const duration = 1400; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // easeOutQuad
      const factor = 1 - (1 - progress) * (1 - progress);

      setSolvedCount(Math.floor(targetSolved * factor));
      setHoursCount(Math.floor(targetHours * factor));
      setPeopleCount(Math.floor(targetPeople * factor));
      setWardsCount(Math.floor(targetWards * factor));

      if (step >= steps) {
        clearInterval(timer);
        setSolvedCount(targetSolved);
        setHoursCount(targetHours);
        setPeopleCount(targetPeople);
        setWardsCount(targetWards);
        setHasAnimated(true);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [reducedMotion]);

  const monthlyData = [
    { month: 'Apr', resolved: 14, hours: 1400 },
    { month: 'May', resolved: 18, hours: 2100 },
    { month: 'Jun', resolved: 22, hours: 2900 },
    { month: 'Jul', resolved: 28, hours: 3800 },
    { month: 'Aug', resolved: 31, hours: 4200 },
    { month: 'Sep', resolved: 29, hours: 4050 },
  ];

  const categoryBreakdown = [
    { name: 'Waste & Ecology', percent: 34, color: 'bg-emerald-400', count: '48 Initiatives' },
    { name: 'Clean Water', percent: 26, color: 'bg-cyan-400', count: '37 Initiatives' },
    { name: 'Solar & Lighting', percent: 18, color: 'bg-amber-400', count: '26 Initiatives' },
    { name: 'Heritage & Culture', percent: 12, color: 'bg-purple-400', count: '17 Initiatives' },
    { name: 'Digital & Youth', percent: 10, color: 'bg-indigo-400', count: '14 Initiatives' },
  ];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            PROOF OF CIVIC VALUE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Verified Community Impact Ledger
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Quantified outcomes from citizens, ward liaisons, and volunteer deployments across Nepal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>All metrics backed by photographic verification</span>
        </div>
      </div>

      {/* Top 4 Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat 1: Problems Solved */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Problems Solved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {solvedCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
            <span>+18 this month</span>
            <span className="text-slate-500">• 98.4% verified</span>
          </p>
        </div>

        {/* Stat 2: Volunteer Hours */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Volunteer Hours
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-cyan-400 flex items-center justify-center border border-cyan-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {hoursCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-cyan-400 font-mono mt-2 flex items-center gap-1">
            <span>Grassroots action logged</span>
          </p>
        </div>

        {/* Stat 3: People Impacted */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Citizens Impacted
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {peopleCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-indigo-400 font-mono mt-2 flex items-center gap-1">
            <span>Direct community beneficiaries</span>
          </p>
        </div>

        {/* Stat 4: Wards Active */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Municipal Wards
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center border border-purple-800/40">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {wardsCount}
          </div>
          <p className="text-[11px] text-purple-400 font-mono mt-2 flex items-center gap-1">
            <span>Kathmandu, Lalitpur, Bhaktapur</span>
          </p>
        </div>
      </div>

      {/* Middle Grid: Charts & Category Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* SVG Resolution Trend Chart (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-sm text-white">
                Monthly Civic Problem Resolutions
              </h3>
              <p className="text-xs text-slate-400">
                Number of verified civic actions completed month-over-month
              </p>
            </div>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
              2026 Trend
            </span>
          </div>

          {/* SVG Chart Graphic */}
          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {monthlyData.map((d, idx) => {
              const maxVal = 35;
              const heightPercent = hasAnimated ? (d.resolved / maxVal) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition">
                    {d.resolved}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-800/60 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 via-teal-500 to-emerald-400 rounded-t-lg transition-all duration-1000 ease-out group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2">
            <span>Average resolution time: <strong className="text-white">6.8 days</strong></span>
            <span>Civic satisfaction rate: <strong className="text-emerald-400">96.2%</strong></span>
          </div>
        </div>

        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">
              Action Distribution by Sector
            </h3>
            <span className="font-mono text-[11px] text-slate-400">Total: 142</span>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{cat.count} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
                  <div
                    className={`h-full ${cat.color} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: hasAnimated ? `${cat.percent}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Waste & Ecology leads community volunteer mobilization this season.</span>
          </div>
        </div>
      </div>

      {/* Live Civic Activity Ticker */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Real-Time Community Activity Stream
          </h3>
          <span className="font-mono text-[10px] text-slate-400">Live Web Feed</span>
        </div>

        <div className="space-y-2.5">
          {RECENT_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 transition"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-white">{act.user}</span>
                <span className="text-slate-400">{act.action}</span>
                <span className="text-cyan-300 font-medium truncate">{act.target}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap">
                {act.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
