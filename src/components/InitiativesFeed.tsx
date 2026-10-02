import React, { useState } from 'react';
import {
  Search,
  Filter,
  Heart,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Coins,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CivicIssue, Category, UrgencyLevel } from '../types.ts';
import { playTechChime } from '../utils/audio.ts';

interface InitiativesFeedProps {
  issues: CivicIssue[];
  onSupportIssue: (id: string) => void;
  onJoinVolunteer: (issue: CivicIssue) => void;
  onSelectIssue: (issue: CivicIssue) => void;
  onOpenCreateModal: () => void;
  reducedMotion?: boolean;
}

export const InitiativesFeed: React.FC<InitiativesFeedProps> = ({
  issues,
  onSupportIssue,
  onJoinVolunteer,
  onSelectIssue,
  onOpenCreateModal,
  reducedMotion = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [justSupportedId, setJustSupportedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Waste & Ecology',
    'Clean Water',
    'Solar & Lighting',
    'Heritage & Culture',
    'Digital & Youth',
    'Road Safety & Mobility',
  ];

  const statuses = ['All', 'Active', 'In Progress', 'Action Planned', 'Resolved'];

  const filteredIssues = issues.filter((iss) => {
    const matchesSearch =
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || iss.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || iss.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSupportClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playTechChime('success');
    setJustSupportedId(id);
    setTimeout(() => setJustSupportedId(null), 800);
    onSupportIssue(id);
  };

  const handleJoinClick = (e: React.MouseEvent, issue: CivicIssue) => {
    e.stopPropagation();
    playTechChime('unlock');
    onJoinVolunteer(issue);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            LIVE COMMUNITY NETWORK
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Active Civic Initiatives
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real civic interventions organized by citizens and wards across Nepal. Endorse, join, or fund ground action.
          </p>
        </div>

        <button
          onClick={() => {
            playTechChime('click');
            onOpenCreateModal();
          }}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold tracking-wide transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Post New Civic Problem</span>
        </button>
      </div>

      {/* Search & Filter Cluster */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives by title, ward, tags (e.g. Bagmati, Patan, Water)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-slate-400 pl-1">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => {
                  playTechChime('click');
                  setSelectedStatus(st);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playTechChime('click');
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Issues */}
      {filteredIssues.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
          <Filter className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="font-display font-semibold text-base text-white mb-1">
            No initiatives found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Try adjusting your search criteria or create a new community initiative to begin.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="text-xs text-cyan-400 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((iss) => {
            const isSupported = iss.hasSupported;
            const isJustPopped = justSupportedId === iss.id;
            const volunteerPercent = Math.min(
              Math.round((iss.volunteersJoined / iss.volunteersTarget) * 100),
              100
            );

            return (
              <div
                key={iss.id}
                onClick={() => {
                  playTechChime('click');
                  onSelectIssue(iss);
                }}
                className="group relative glass-panel rounded-2xl border border-slate-800 hover:border-cyan-500/40 glass-card-hover overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Image header with zoom on hover */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={iss.imageUrl}
                    alt={iss.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Urgency Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider backdrop-blur-md border ${
                        iss.urgency === 'Critical'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                          : iss.urgency === 'High'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      }`}
                    >
                      {iss.urgency}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-slate-900/80 text-slate-300 backdrop-blur-md border border-slate-700">
                      {iss.ward}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                      {iss.status}
                    </span>
                  </div>

                  {/* Location badge on bottom of photo */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1 text-[11px] text-slate-300 drop-shadow truncate">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{iss.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category */}
                    <span className="text-[10px] font-mono uppercase text-cyan-400/90 font-medium">
                      {iss.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base text-white mt-1 mb-2 line-clamp-2 group-hover:text-cyan-200 transition-colors">
                      {iss.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {iss.description}
                    </p>
                  </div>

                  <div>
                    {/* Volunteer Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          Volunteers:
                        </span>
                        <span className="font-mono text-cyan-300 font-semibold">
                          {iss.volunteersJoined} / {iss.volunteersTarget}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                          style={{ width: `${volunteerPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Funding / Resources indicator if applicable */}
                    {iss.fundsGoalNPR > 0 && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-slate-800/80 mb-3">
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-emerald-400" /> Community Pledge:
                        </span>
                        <span className="text-emerald-300 font-medium">
                          Rs {iss.fundsRaisedNPR.toLocaleString()} / Rs {iss.fundsGoalNPR.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Author */}
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={iss.author.avatar}
                          alt={iss.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-cyan-500/30 flex-shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-xs text-slate-200 font-medium truncate block">
                            {iss.author.name}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Support / Upvote Button */}
                        <button
                          onClick={(e) => handleSupportClick(e, iss.id)}
                          title="Endorse this civic issue"
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition transform active:scale-90 cursor-pointer ${
                            isSupported
                              ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                          } ${isJustPopped ? 'scale-110 shadow-[0_0_12px_rgba(244,63,94,0.5)]' : ''}`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSupported ? 'fill-rose-400 text-rose-400' : ''
                            } ${isJustPopped ? 'scale-125' : ''}`}
                          />
                          <span>{iss.supportersCount}</span>
                        </button>

                        {/* Join Button */}
                        <button
                          onClick={(e) => handleJoinClick(e, iss)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition cursor-pointer"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
