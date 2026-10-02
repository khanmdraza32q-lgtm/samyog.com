import React from 'react';
import { X, Sparkles, Award, ShieldCheck, Sun, Leaf, Zap, CheckCircle2 } from 'lucide-react';
import { CivicAchievement } from '../types.ts';
import { CIVIC_ACHIEVEMENTS } from '../data/mockData.ts';
import { playTechChime } from '../utils/audio.ts';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadge?: CivicAchievement | null;
  onTriggerDemoUnlock?: (badge: CivicAchievement) => void;
  reducedMotion?: boolean;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  unlockedBadge = null,
  onTriggerDemoUnlock,
  reducedMotion = false,
}) => {
  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-300" />;
      case 'Leaf':
        return <Leaf className="w-6 h-6 text-emerald-400" />;
      case 'Sun':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      default:
        return <Award className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel-glow p-6 sm:p-8 rounded-2xl border border-emerald-500/40 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            playTechChime('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If celebrating an unlock */}
        {unlockedBadge ? (
          <div className="text-center py-6">
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              {/* Soft glow ring */}
              {!reducedMotion && (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-orbit" />
                </>
              )}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                {getIcon(unlockedBadge.icon)}
              </div>
            </div>

            <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400">
              CIVIC BADGE UNLOCKED
            </span>
            <h3 className="font-display font-extrabold text-2xl text-white mt-1 mb-2">
              {unlockedBadge.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-6">
              {unlockedBadge.description}
            </p>

            <button
              onClick={() => {
                playTechChime('click');
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-lg cursor-pointer"
            >
              Claim Civic Credential
            </button>
          </div>
        ) : (
          /* List of all Civic Achievements */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Civic Credentials & Badges
                </h3>
                <p className="text-xs text-slate-400">
                  Earn recognition for ground participation, reports, and ward leadership.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {CIVIC_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = ach.progress >= ach.maxProgress;

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                      isUnlocked
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isUnlocked
                            ? 'bg-slate-900 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-950 border-slate-800 text-slate-600'
                        }`}
                      >
                        {getIcon(ach.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white">
                            {ach.title}
                          </h4>
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {ach.rarity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-500">
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
