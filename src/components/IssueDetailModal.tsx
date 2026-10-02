import React, { useState } from 'react';
import {
  X,
  MapPin,
  Users,
  Coins,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CivicIssue } from '../types.ts';
import { playTechChime } from '../utils/audio.ts';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
  onSupport: (id: string) => void;
  onJoin: (issue: CivicIssue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onSupport,
  onJoin,
}) => {
  if (!issue) return null;

  const [copied, setCopied] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleCopyLink = () => {
    playTechChime('click');
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinAction = () => {
    playTechChime('unlock');
    setHasJoined(true);
    onJoin(issue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-2xl border border-cyan-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            playTechChime('click');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Header */}
        <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 backdrop-blur-md">
                {issue.category}
              </span>
              <span
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold border backdrop-blur-md ${
                  issue.urgency === 'Critical'
                    ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                }`}
              >
                {issue.urgency} Urgency
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
              {issue.status}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
              {issue.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {issue.location} ({issue.ward})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Reported {issue.createdAt}
              </span>
            </div>
          </div>

          {/* Author Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={issue.author.avatar}
                alt={issue.author.name}
                className="w-9 h-9 rounded-full object-cover border border-cyan-500/40"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {issue.author.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {issue.author.badge} • Local Citizen Lead
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Ward Verified</span>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
              Civic Challenge Details
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Progress Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Volunteers Mobilized:
                </span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {issue.volunteersJoined} / {issue.volunteersTarget}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min((issue.volunteersJoined / issue.volunteersTarget) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" /> Community Pledge (NPR):
                </span>
                <span className="font-mono text-emerald-300 font-semibold">
                  Rs {issue.fundsRaisedNPR.toLocaleString()} / Rs {issue.fundsGoalNPR.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${Math.min((issue.fundsRaisedNPR / Math.max(issue.fundsGoalNPR, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* RAZA Action Plan Preview if attached */}
          {issue.actionPlan && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
              <h4 className="text-xs font-display font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Attached RAZA AI Action Blueprint
              </h4>
              <p className="text-xs text-slate-300 mb-3">
                {issue.actionPlan.summary}
              </p>
              <div className="space-y-2">
                {issue.actionPlan.actionPlan.slice(0, 2).map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="font-semibold text-white">{p.phase}:</span> {p.title} ({p.duration})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Endorse Button */}
              <button
                onClick={() => {
                  playTechChime('success');
                  onSupport(issue.id);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                  issue.hasSupported
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${issue.hasSupported ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{issue.hasSupported ? 'Endorsed' : 'Endorse'} ({issue.supportersCount})</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Share link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Join as Volunteer Button */}
            <button
              onClick={handleJoinAction}
              disabled={hasJoined}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg transition transform active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Users className="w-4 h-4" />
              <span>{hasJoined ? 'Enrolled in Ground Squad' : 'Enlist as Volunteer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
