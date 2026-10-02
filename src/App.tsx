import React, { useState, useEffect } from 'react';
import { BackgroundSystem } from './components/BackgroundSystem.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ConnectionVisual } from './components/ConnectionVisual.tsx';
import { RazaAiSection } from './components/RazaAiSection.tsx';
import { InitiativesFeed } from './components/InitiativesFeed.tsx';
import { CivicMap } from './components/CivicMap.tsx';
import { ImpactDashboard } from './components/ImpactDashboard.tsx';
import { CreateInitiativeModal } from './components/CreateInitiativeModal.tsx';
import { IssueDetailModal } from './components/IssueDetailModal.tsx';
import { AchievementModal } from './components/AchievementModal.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { SamyojLogo } from './components/SamyojLogo.tsx';

import { CivicIssue, RazaPlan, RazaStructuredOutput, Category, UrgencyLevel, CivicAchievement } from './types.ts';
import { INITIAL_ISSUES, CIVIC_ACHIEVEMENTS } from './data/mockData.ts';
import { setAudioEnabled, isAudioEnabled, playTechChime } from './utils/audio.ts';
import { Sparkles, Shield, Heart, Radio, ArrowUp } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);

  // Motion and Audio settings
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);

  // Modals & Active items
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<CivicIssue | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<CivicAchievement | null>(null);

  // Transition data when converting RAZA plan -> Initiative
  const [prefillPlan, setPrefillPlan] = useState<RazaPlan | null>(null);
  const [prefillStructured, setPrefillStructured] = useState<RazaStructuredOutput | null>(null);
  const [prefillMeta, setPrefillMeta] = useState<{ title: string; location: string; category: Category; urgency: UrgencyLevel } | null>(null);
  const [razaProblemQuery, setRazaProblemQuery] = useState('');

  // Audio sync
  const handleSetSoundEnabled = (enabled: boolean) => {
    setAudioEnabled(enabled);
    setSoundEnabledState(enabled);
  };

  // Support / Upvote issue
  const handleSupportIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          const hasSupported = !iss.hasSupported;
          return {
            ...iss,
            hasSupported,
            supportersCount: hasSupported ? iss.supportersCount + 1 : iss.supportersCount - 1,
          };
        }
        return iss;
      })
    );
  };

  // Join as volunteer
  const handleJoinVolunteer = (issue: CivicIssue) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issue.id) {
          return {
            ...iss,
            volunteersJoined: iss.volunteersJoined + 1,
          };
        }
        return iss;
      })
    );

    // Trigger achievement celebration for first volunteer action
    const catalystBadge = CIVIC_ACHIEVEMENTS[0];
    setUnlockedBadge(catalystBadge);
    setIsAchievementModalOpen(true);
  };

  // Create new issue
  const handleCreateIssue = (newIssue: CivicIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    // Switch to initiatives tab to view it
    setActiveTab('initiatives');
  };

  // Quick diagnosis from Hero
  const handleHeroDiagnose = (problemText: string) => {
    setRazaProblemQuery(problemText);
    setActiveTab('raza');
  };

  // Convert RAZA plan into live initiative
  const handleConvertToInitiative = (
    structured: RazaStructuredOutput,
    meta: { title: string; location: string; category: Category; urgency: UrgencyLevel }
  ) => {
    setPrefillStructured(structured);
    setPrefillMeta(meta);
    setIsCreateModalOpen(true);
  };

  const handleOpenBlankCreate = () => {
    setPrefillPlan(null);
    setPrefillStructured(null);
    setPrefillMeta(null);
    setIsCreateModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playTechChime('click');
  };

  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Futuristic Background System */}
      <BackgroundSystem reducedMotion={reducedMotion} />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          soundEnabled={soundEnabled}
          setSoundEnabled={handleSetSoundEnabled}
          onOpenCreateModal={handleOpenBlankCreate}
          onOpenAchievements={() => {
            setUnlockedBadge(null);
            setIsAchievementModalOpen(true);
          }}
        />

        {/* Dynamic Views */}
        <main className="flex-1 pb-24 md:pb-16">
          {activeTab === 'home' && (
            <div className="space-y-4">
              <HeroSection
                onQuickDiagnose={handleHeroDiagnose}
                onExploreInitiatives={() => setActiveTab('initiatives')}
                onOpenFlow={() => setActiveTab('flow')}
                reducedMotion={reducedMotion}
              />

              {/* The Signature SAMYOJ Connection Visual */}
              <ConnectionVisual
                onLaunchRaza={() => setActiveTab('raza')}
                reducedMotion={reducedMotion}
              />

              {/* Highlights from Initiatives Feed */}
              <InitiativesFeed
                issues={issues.slice(0, 3)}
                onSupportIssue={handleSupportIssue}
                onJoinVolunteer={handleJoinVolunteer}
                onSelectIssue={(iss) => setSelectedIssueDetail(iss)}
                onOpenCreateModal={handleOpenBlankCreate}
                reducedMotion={reducedMotion}
              />

              {/* Live Impact Preview */}
              <ImpactDashboard reducedMotion={reducedMotion} />
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="pt-6">
              <ConnectionVisual
                onLaunchRaza={() => setActiveTab('raza')}
                reducedMotion={reducedMotion}
              />
              <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    How The SAMYOJ Civic Loop Works
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    In traditional municipal reporting, citizen grievances get buried in static spreadsheets. SAMYOJ acts as an active digital neural bridge:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <strong className="text-cyan-300 block mb-1">1. Intelligent Structuring</strong>
                      <span className="text-slate-400">
                        RAZA breaks ambiguous complaints into specific tasks, tool requirements, safety measures, and estimated costs in NPR.
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <strong className="text-emerald-300 block mb-1">2. Local Ward Alignment</strong>
                      <span className="text-slate-400">
                        Instead of opposing municipal offices, initiatives directly involve local ward representatives and tol committees for resources and official verification.
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <strong className="text-indigo-300 block mb-1">3. Mobilized Citizens</strong>
                      <span className="text-slate-400">
                        Neighbors can pledge funds, enlist for on-ground slots, or provide technical skills (carpentry, water testing, electrical wiring).
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <strong className="text-teal-300 block mb-1">4. Permanent Civic Ledger</strong>
                      <span className="text-slate-400">
                        Every action is timestamped with photographic evidence, creating a verifiable public record of community renewal.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raza' && (
            <RazaAiSection
              initialProblemText={razaProblemQuery}
              onConvertToInitiative={handleConvertToInitiative}
              reducedMotion={reducedMotion}
            />
          )}

          {activeTab === 'initiatives' && (
            <InitiativesFeed
              issues={issues}
              onSupportIssue={handleSupportIssue}
              onJoinVolunteer={handleJoinVolunteer}
              onSelectIssue={(iss) => setSelectedIssueDetail(iss)}
              onOpenCreateModal={handleOpenBlankCreate}
              reducedMotion={reducedMotion}
            />
          )}

          {activeTab === 'map' && (
            <CivicMap
              issues={issues}
              onSelectIssue={(iss) => setSelectedIssueDetail(iss)}
              onSupportIssue={handleSupportIssue}
              onJoinVolunteer={handleJoinVolunteer}
              reducedMotion={reducedMotion}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactDashboard reducedMotion={reducedMotion} />
          )}
        </main>

        {/* Futuristic Footer */}
        <footer className="border-t border-cyan-950/60 bg-[#04060d] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <SamyojLogo size="sm" />
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                Next-generation community operating system uniting grassroots citizens, ward liaisons, and RAZA AI for verified civic impact across Nepal.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
              <button
                onClick={() => setIsLoading(true)}
                className="hover:text-cyan-300 transition cursor-pointer"
              >
                Replay Emblem Intro
              </button>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ward Grid: Online
              </span>
              <span>•</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 hover:text-cyan-300 transition cursor-pointer"
              >
                <span>Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Modals */}
      <CreateInitiativeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateIssue}
        prefillPlan={prefillPlan}
        prefillStructured={prefillStructured}
        prefillMeta={prefillMeta}
        reducedMotion={reducedMotion}
      />

      <IssueDetailModal
        issue={selectedIssueDetail}
        onClose={() => setSelectedIssueDetail(null)}
        onSupport={handleSupportIssue}
        onJoin={handleJoinVolunteer}
      />

      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        unlockedBadge={unlockedBadge}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
