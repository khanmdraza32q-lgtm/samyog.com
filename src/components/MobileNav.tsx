import React from 'react';
import { Home, Workflow, Sparkles, Compass, TrendingUp, Users } from 'lucide-react';
import { playTechChime } from '../utils/audio.ts';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Network', icon: Home },
    { id: 'flow', label: 'Flow', icon: Workflow },
    { id: 'raza', label: 'RAZA AI', icon: Sparkles },
    { id: 'initiatives', label: 'Action', icon: Users },
    { id: 'map', label: 'Radar', icon: Compass },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
  ];

  const handleTabClick = (id: string) => {
    playTechChime('click');
    setActiveTab(id);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05070e]/95 backdrop-blur-2xl border-t border-cyan-950/60 px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Soft Active Pill Indicator */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              )}

              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
