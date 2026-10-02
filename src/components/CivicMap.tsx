import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ShieldAlert, Users, Heart, ArrowUpRight, Compass, Maximize2 } from 'lucide-react';
import { CivicIssue, Category } from '../types.ts';
import { playTechChime } from '../utils/audio.ts';

interface CivicMapProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
  onSupportIssue: (id: string) => void;
  onJoinVolunteer: (issue: CivicIssue) => void;
  reducedMotion?: boolean;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  issues,
  onSelectIssue,
  onSupportIssue,
  onJoinVolunteer,
  reducedMotion = false,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(issues[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [mapZoom, setMapZoom] = useState<number>(1);

  const filteredIssues = issues.filter(
    (iss) => categoryFilter === 'All' || iss.category === categoryFilter
  );

  const handleMarkerClick = (issue: CivicIssue) => {
    playTechChime('node');
    setSelectedIssue(issue);
  };

  const getMarkerColor = (category: Category) => {
    switch (category) {
      case 'Waste & Ecology':
        return '#10b981'; // emerald
      case 'Clean Water':
        return '#06b6d4'; // cyan
      case 'Solar & Lighting':
        return '#eab308'; // amber/yellow
      case 'Heritage & Culture':
        return '#f97316'; // orange
      case 'Digital & Youth':
        return '#8b5cf6'; // violet
      case 'Road Safety & Mobility':
        return '#ef4444'; // rose/red
      default:
        return '#38bdf8';
    }
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            GEOSPATIAL WARD RADAR
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Interactive Community Map
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time geospatial visualization of civic priorities, volunteer clusters, and municipal ward nodes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start md:self-auto bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {['All', 'Waste & Ecology', 'Clean Water', 'Solar & Lighting', 'Road Safety & Mobility'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playTechChime('click');
                setCategoryFilter(cat);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Wards' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Map Surface (8 Cols) */}
          <div className="lg:col-span-8 relative bg-[#040814] overflow-hidden min-h-[420px] lg:min-h-[520px] flex items-center justify-center">
            {/* Tech grid & coordinates styling */}
            <div className="absolute inset-0 tech-grid opacity-30" />

            {/* Stylized topographic rings representing Kathmandu Valley basin */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="50%" cy="50%" rx="44%" ry="38%" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              <ellipse cx="50%" cy="50%" rx="32%" ry="26%" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
              <ellipse cx="50%" cy="50%" rx="20%" ry="16%" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 4" />
              {/* Bagmati river trajectory curve */}
              <path
                d="M 10 180 Q 250 240, 450 300 T 800 480"
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </svg>

            {/* Ward Territory Labels in Background */}
            <div className="absolute top-6 left-8 text-[11px] font-mono text-slate-400 select-none">
              ZONE A • KATHMANDU METROPOLIS
            </div>
            <div className="absolute bottom-8 left-10 text-[11px] font-mono text-slate-400 select-none">
              ZONE B • LALITPUR SUB-METRO
            </div>
            <div className="absolute top-12 right-10 text-[11px] font-mono text-slate-400 select-none">
              ZONE C • BHAKTAPUR HISTORIC
            </div>

            {/* Map Interactive Nodes */}
            <div
              className="relative w-full h-full p-8 transition-transform duration-500 ease-out"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {filteredIssues.map((iss) => {
                const isSelected = selectedIssue?.id === iss.id;
                const markerColor = getMarkerColor(iss.category);
                const isCritical = iss.urgency === 'Critical';

                return (
                  <div
                    key={iss.id}
                    onClick={() => handleMarkerClick(iss)}
                    className="absolute cursor-pointer transition-transform duration-300 group z-20"
                    style={{
                      left: `${iss.coordinates.x}%`,
                      top: `${iss.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Only pulse if isCritical and reducedMotion is false */}
                    {isCritical && !reducedMotion && (
                      <span
                        className="absolute -inset-2 rounded-full animate-ping opacity-60"
                        style={{ backgroundColor: markerColor }}
                      />
                    )}

                    {/* Outer selection ring */}
                    {isSelected && (
                      <div
                        className="absolute -inset-3 rounded-full border-2 animate-pulse"
                        style={{ borderColor: markerColor }}
                      />
                    )}

                    {/* Main Node Pin */}
                    <div
                      className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                        isSelected
                          ? 'scale-125 shadow-lg'
                          : 'group-hover:scale-115'
                      }`}
                      style={{
                        backgroundColor: isSelected ? markerColor : '#0b1329',
                        border: `1.5px solid ${markerColor}`,
                        boxShadow: `0 0 15px ${markerColor}66`,
                      }}
                    >
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: isSelected ? '#05070e' : markerColor }}
                      />
                    </div>

                    {/* Hover tooltip label */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-slate-950/95 border border-slate-700 text-[10px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-30 shadow-xl">
                      {iss.ward} • {iss.category}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Overlay Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  playTechChime('click');
                  setMapZoom((z) => Math.min(z + 0.15, 1.45));
                }}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-mono cursor-pointer"
              >
                +
              </button>
              <button
                onClick={() => {
                  playTechChime('click');
                  setMapZoom((z) => Math.max(z - 0.15, 0.85));
                }}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-mono cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => {
                  playTechChime('click');
                  setMapZoom(1);
                }}
                className="px-2 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 flex items-center justify-center cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Selected Node Details Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
            {selectedIssue ? (
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {selectedIssue.ward}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${
                        selectedIssue.urgency === 'Critical'
                          ? 'bg-rose-950/80 border-rose-800/60 text-rose-300'
                          : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
                      }`}
                    >
                      {selectedIssue.urgency}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">
                    {selectedIssue.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{selectedIssue.location}</span>
                  </p>
                </div>

                {/* Preview Image */}
                <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={selectedIssue.imageUrl}
                    alt={selectedIssue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>

                {/* Short snippet */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {selectedIssue.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Volunteers
                    </span>
                    <span className="text-xs font-semibold text-cyan-300">
                      {selectedIssue.volunteersJoined} / {selectedIssue.volunteersTarget} joined
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Endorsements
                    </span>
                    <span className="text-xs font-semibold text-rose-300">
                      {selectedIssue.supportersCount} citizens
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      playTechChime('unlock');
                      onJoinVolunteer(selectedIssue);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold tracking-wide shadow-lg transition transform active:scale-95 cursor-pointer"
                  >
                    Join Ground Action Squad
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        playTechChime('success');
                        onSupportIssue(selectedIssue.id);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Endorse</span>
                    </button>
                    <button
                      onClick={() => {
                        playTechChime('click');
                        onSelectIssue(selectedIssue);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <span>Full Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select any node on the radar to inspect.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
