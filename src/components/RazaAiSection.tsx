import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  Send,
  Image as ImageIcon,
  X,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Bookmark,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  Trash2,
  AlertTriangle,
  Flame,
  Layers,
  Users,
  Wrench,
  Building2,
  TrendingUp,
  Globe,
  CornerDownRight,
  Info
} from 'lucide-react';
import {
  RazaMessage,
  RazaConversation,
  RazaStructuredOutput,
  Category,
  UrgencyLevel
} from '../types.ts';
import {
  loadUserConversations,
  persistConversation,
  removeConversation
} from '../utils/supabase.ts';
import { playTechChime } from '../utils/audio.ts';

interface RazaAiSectionProps {
  initialProblemText?: string;
  onConvertToInitiative: (
    structured: RazaStructuredOutput,
    meta: { title: string; location: string; category: Category; urgency: UrgencyLevel }
  ) => void;
  reducedMotion?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  'There is too much garbage near my school',
  'hamro area ko road bigreko xa, community le k garna sakcha?',
  'Pitch-dark inner gallis between Patan courtyards',
  'I just want to know what community development means',
];

export const RazaAiSection: React.FC<RazaAiSectionProps> = ({
  initialProblemText = '',
  onConvertToInitiative,
  reducedMotion = false,
}) => {
  // Conversation Management
  const [conversations, setConversations] = useState<RazaConversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Active chat state
  const [messages, setMessages] = useState<RazaMessage[]>([]);
  const [inputText, setInputText] = useState<string>(initialProblemText || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [languagePreference, setLanguagePreference] = useState<string>('Auto');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<Record<string, boolean>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const processingLabels = [
    'Understanding problem & intent...',
    'Thinking & mapping community nodes...',
    'Building actionable community plan...',
  ];

  // Initial load: Load conversations from Supabase / LocalStore
  useEffect(() => {
    async function initConversations() {
      const loaded = await loadUserConversations();
      if (loaded.length > 0) {
        setConversations(loaded);
        setCurrentConvoId(loaded[0].id);
        setMessages(loaded[0].messages);
      } else {
        // Create initial default welcome conversation
        const initialConvo: RazaConversation = {
          id: `convo-${Date.now()}`,
          title: 'Civic Action Consultation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'msg-welcome',
              sender: 'raza',
              text: "Namaste! I'm RAZA, your community action assistant inside SAMYOJ. Tell me about any civic issue in your neighborhood — garbage build-up, broken roads, dark alleys, water issues, or heritage spaces — in English, Nepali, or Hinglish. I'll help you transform it into a practical, volunteer-ready community initiative!",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
        setConversations([initialConvo]);
        setCurrentConvoId(initialConvo.id);
        setMessages(initialConvo.messages);
        persistConversation(initialConvo);
      }
    }
    initConversations();
  }, []);

  // If initialProblemText comes from hero, set into input
  useEffect(() => {
    if (initialProblemText && initialProblemText !== inputText) {
      setInputText(initialProblemText);
    }
  }, [initialProblemText]);

  // Auto scroll to latest message
  useEffect(() => {
    if (!reducedMotion) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  // Handle switching conversations
  const handleSelectConversation = (convo: RazaConversation) => {
    playTechChime('click');
    setCurrentConvoId(convo.id);
    setMessages(convo.messages);
    setIsSidebarOpen(false);
  };

  // Handle starting a new conversation
  const handleNewConversation = () => {
    playTechChime('unlock');
    const newConvo: RazaConversation = {
      id: `convo-${Date.now()}`,
      title: 'New Civic Consultation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'raza',
          text: "What civic challenge or neighborhood idea are you exploring today? Describe the problem, upload a photo, or ask how your community can organize.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setConversations((prev) => [newConvo, ...prev]);
    setCurrentConvoId(newConvo.id);
    setMessages(newConvo.messages);
    persistConversation(newConvo);
    setIsSidebarOpen(false);
  };

  // Handle deleting a conversation
  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playTechChime('click');
    await removeConversation(id);
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (currentConvoId === id) {
      if (updated.length > 0) {
        setCurrentConvoId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        handleNewConversation();
      }
    }
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      alert('Image size exceeds 12MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      playTechChime('click');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    playTechChime('click');
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text && !imagePreview) return;

    playTechChime('click');

    const userMsg: RazaMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      imageUrl: imagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    const uploadedImage = imagePreview;
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsProcessing(true);
    setProcessingStage(0);

    // Staged processing indicator
    const timer1 = setTimeout(() => {
      setProcessingStage(1);
      playTechChime('pulse');
    }, 800);
    const timer2 = setTimeout(() => {
      setProcessingStage(2);
      playTechChime('pulse');
    }, 1800);

    try {
      // Build history payload (last 8 turns for context memory)
      const historyPayload = messages.slice(-8).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/raza/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          imageBase64: uploadedImage || undefined,
          languagePreference: languagePreference !== 'Auto' ? languagePreference : undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Server error');
      }

      const razaMsg: RazaMessage = {
        id: `raza-${Date.now()}`,
        sender: 'raza',
        text: data.text || 'I have analyzed the community situation.',
        structuredPlan: data.structuredPlan || undefined,
        detectedLanguage: data.detectedLanguage || 'Auto',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, razaMsg];
      setMessages(finalMessages);
      playTechChime(razaMsg.structuredPlan ? 'unlock' : 'success');

      // Update conversation title if first meaningful turn
      let convoTitle = 'Civic Consultation';
      if (razaMsg.structuredPlan?.title) {
        convoTitle = razaMsg.structuredPlan.title;
      } else if (text) {
        convoTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');
      }

      const activeConvo: RazaConversation = {
        id: currentConvoId || `convo-${Date.now()}`,
        title: convoTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvo.id ? activeConvo : c))
      );
      persistConversation(activeConvo);
    } catch (err: any) {
      console.warn('Chat request failed, applying graceful resilience message:', err);
      const fallbackMsg: RazaMessage = {
        id: `raza-${Date.now()}`,
        sender: 'raza',
        text: "I encountered a transient network connection issue. Your details are safe, and you can press retry below to continue.",
        status: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, fallbackMsg]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    playTechChime('click');
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleToggleSavePlan = (id: string) => {
    playTechChime('click');
    setSavedPlans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTask = (taskKey: string) => {
    playTechChime('click');
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  const handleConvertStructuredToInitiative = (plan: RazaStructuredOutput) => {
    playTechChime('unlock');
    onConvertToInitiative(plan, {
      title: plan.title,
      location: 'Kathmandu Valley Ward Network',
      category: (plan.category as Category) || 'Waste & Ecology',
      urgency: plan.urgency || 'High',
    });
  };

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Animated AI Core Orb */}
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            {!reducedMotion && (
              <>
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse-glow" />
                <div className="absolute inset-1 rounded-full border border-cyan-400/40 animate-orbit" />
                <div className="absolute inset-2 rounded-full border border-emerald-400/30 animate-orbit-reverse" />
              </>
            )}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                RAZA Community Action AI
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono uppercase tracking-wider">
                v2.5 Context Memory
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Natural language & multimodal civic problem solver. Understands English, Nepali, and Hinglish.
            </p>
          </div>
        </div>

        {/* Right utility toolbar */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={languagePreference}
              onChange={(e) => setLanguagePreference(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Auto" className="bg-slate-900 text-slate-200">Auto (English / नेपाली / Hinglish)</option>
              <option value="English" className="bg-slate-900 text-slate-200">English</option>
              <option value="Nepali" className="bg-slate-900 text-slate-200">नेपाली (Nepali)</option>
              <option value="Hinglish" className="bg-slate-900 text-slate-200">Hinglish</option>
            </select>
          </div>

          {/* Sessions Drawer Toggle */}
          <button
            onClick={() => {
              playTechChime('click');
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consultations ({conversations.length})</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Plan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Sessions Drawer (collapsible on mobile, or toggleable) */}
        {isSidebarOpen && (
          <div className="lg:col-span-4 glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3 max-h-[640px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
                Saved Sessions
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-white lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNewConversation}
              className="w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start New Consultation</span>
            </button>

            <div className="space-y-1.5 mt-2">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConversation(c)}
                  className={`group p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                    currentConvoId === c.id
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate flex-1">
                    <span className="font-medium truncate block">{c.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {c.messages.length} messages
                    </span>
                  </div>
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteConversation(e, c.id)}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Conversation Area (takes full width or 8 cols when sidebar is open) */}
        <div className={`${isSidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col glass-panel rounded-2xl border border-slate-800 shadow-2xl min-h-[580px] max-h-[780px] overflow-hidden`}>
          {/* Messages Stream Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isPlanSaved = savedPlans[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* RAZA Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                      <Cpu className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`max-w-[88%] sm:max-w-[80%] space-y-3 ${isUser ? 'text-right' : 'text-left'}`}>
                    {/* User message photo attachment if present */}
                    {msg.imageUrl && (
                      <div className="relative inline-block rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg max-h-56">
                        <img
                          src={msg.imageUrl}
                          alt="User upload"
                          className="object-cover max-h-56 rounded-xl"
                        />
                      </div>
                    )}

                    {/* Main Text Content */}
                    <div
                      className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Time & Detected Language Meta */}
                    <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.detectedLanguage && (
                        <span>• Lang: {msg.detectedLanguage}</span>
                      )}
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Copy response"
                          className="hover:text-cyan-300 transition"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* Structured Community Action Plan Cards (Rendered when RAZA generates an action plan) */}
                    {msg.structuredPlan && (
                      <div className="mt-3 p-4 sm:p-5 rounded-2xl glass-panel-glow border border-cyan-400/40 shadow-xl space-y-4 text-left">
                        {/* Plan Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[10px] font-mono font-medium">
                                {msg.structuredPlan.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                                  msg.structuredPlan.urgency === 'Critical'
                                    ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                                    : msg.structuredPlan.urgency === 'High'
                                    ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                                    : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                                }`}
                              >
                                {msg.structuredPlan.urgency} Urgency
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-sm text-white mt-1">
                              {msg.structuredPlan.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleSavePlan(msg.id)}
                              className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                                isPlanSaved
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                              title={isPlanSaved ? 'Plan Saved' : 'Save Plan'}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleConvertStructuredToInitiative(msg.structuredPlan!)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] transition transform active:scale-95 cursor-pointer"
                            >
                              <span>Create Initiative</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        </div>

                        {/* Known vs Uncertain context */}
                        {(msg.structuredPlan.knownInfo?.length || msg.structuredPlan.uncertainInfo?.length) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {msg.structuredPlan.knownInfo && msg.structuredPlan.knownInfo.length > 0 && (
                              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <span className="font-mono text-[10px] text-cyan-300 uppercase block mb-1">
                                  Known Facts
                                </span>
                                <ul className="space-y-1 text-[11px] text-slate-300">
                                  {msg.structuredPlan.knownInfo.map((k, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-cyan-400">•</span>
                                      <span>{k}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {msg.structuredPlan.uncertainInfo && msg.structuredPlan.uncertainInfo.length > 0 && (
                              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <span className="font-mono text-[10px] text-amber-300 uppercase block mb-1 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                                  Requires Verification
                                </span>
                                <ul className="space-y-1 text-[11px] text-slate-300">
                                  {msg.structuredPlan.uncertainInfo.map((u, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-amber-400">•</span>
                                      <span>{u}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Immediate Safe Actions */}
                        {msg.structuredPlan.immediateActions && msg.structuredPlan.immediateActions.length > 0 && (
                          <div>
                            <span className="font-display font-semibold text-xs tracking-wider uppercase text-cyan-300 flex items-center gap-1.5 mb-2">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              Immediate Actions (Hour 0 - 24)
                            </span>
                            <div className="space-y-1.5">
                              {msg.structuredPlan.immediateActions.map((act, idx) => {
                                const key = `${msg.id}-act-${idx}`;
                                const isDone = !!completedTasks[key];
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => handleToggleTask(key)}
                                    className={`p-2 rounded-lg border text-xs flex items-start gap-2 transition cursor-pointer ${
                                      isDone
                                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 border ${
                                        isDone
                                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                          : 'border-slate-600 bg-slate-800'
                                      }`}
                                    >
                                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className={isDone ? 'line-through text-slate-400' : ''}>
                                      {act}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Phased Community Plan */}
                        {msg.structuredPlan.communityPlan && msg.structuredPlan.communityPlan.length > 0 && (
                          <div>
                            <span className="font-display font-semibold text-xs tracking-wider uppercase text-cyan-300 flex items-center gap-1.5 mb-2">
                              <Layers className="w-3.5 h-3.5 text-cyan-400" />
                              Phased Community Roadmap
                            </span>
                            <div className="space-y-2">
                              {msg.structuredPlan.communityPlan.map((step, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-white">
                                      Step {step.step}: {step.title}
                                    </span>
                                    {step.duration && (
                                      <span className="font-mono text-[10px] text-cyan-400">
                                        {step.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-300">{step.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Roles & Resources Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {/* Volunteer Roles */}
                          {msg.structuredPlan.volunteerRoles && msg.structuredPlan.volunteerRoles.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                              <span className="font-mono text-[10px] uppercase text-indigo-300 flex items-center gap-1 mb-2">
                                <Users className="w-3 h-3" /> Volunteer Roles
                              </span>
                              <div className="space-y-1.5">
                                {msg.structuredPlan.volunteerRoles.map((r, i) => (
                                  <div key={i} className="text-[11px] text-slate-300 flex items-center justify-between">
                                    <span>{r.role}</span>
                                    <span className="font-mono text-cyan-300 font-semibold">{r.countNeeded} people</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Budget & Resources */}
                          {msg.structuredPlan.resources && msg.structuredPlan.resources.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                              <span className="font-mono text-[10px] uppercase text-teal-300 flex items-center gap-1 mb-2">
                                <Wrench className="w-3 h-3" /> Key Materials & NPR Budget
                              </span>
                              <div className="space-y-1.5">
                                {msg.structuredPlan.resources.map((res, i) => (
                                  <div key={i} className="text-[11px] text-slate-300 flex items-center justify-between">
                                    <span className="truncate mr-2">{res.item}</span>
                                    <span className="font-mono text-emerald-300">{res.estimatedCostNPR || res.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Potential Partners & Impact Footer */}
                        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 truncate">
                            <Building2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>Partners: {(msg.structuredPlan.potentialPartners || ['Local Ward Office']).join(', ')}</span>
                          </div>
                          <div className="text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{msg.structuredPlan.expectedImpact}</span>
                          </div>
                        </div>

                        {/* Single Smart Follow-up Question if recommended */}
                        {msg.structuredPlan.suggestedFollowupQuestion && (
                          <div
                            onClick={() => handleSendMessage(msg.structuredPlan!.suggestedFollowupQuestion!)}
                            className="p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-800/40 text-cyan-200 text-xs flex items-center justify-between gap-2 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                              <span className="truncate">Next Step: {msg.structuredPlan.suggestedFollowupQuestion}</span>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 flex-shrink-0 underline">Ask</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <span className="text-xs font-bold font-mono">You</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Dynamic Processing State Indicator */}
            {isProcessing && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-xs text-slate-200 space-y-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-semibold text-white">RAZA Neural Core Synthesizing</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {processingLabels[processingStage]}
                  </p>
                  <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700 rounded-full"
                      style={{ width: `${((processingStage + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Chips Bar */}
          <div className="p-2 sm:px-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-slate-400 pl-1 whitespace-nowrap">
              Suggestions:
            </span>
            {DEFAULT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 transition cursor-pointer whitespace-nowrap flex-shrink-0 disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input & Multimodal Attachment Form */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
            {/* Image Preview Box if attached */}
            {imagePreview && (
              <div className="mb-2 relative inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow">
                <img
                  src={imagePreview}
                  alt="Attachment preview"
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="text-[11px] text-slate-300 pr-4">
                  <span className="block font-medium">Image attached</span>
                  <span className="text-[9px] text-slate-500 font-mono">Will be analyzed by RAZA</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 rounded-full bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Image Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach photo of civic problem (pothole, garbage, dark street)"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition cursor-pointer flex-shrink-0"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe a civic problem or ask RAZA (e.g. 'hamro school ko agadi fohor xa')..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none transition disabled:opacity-50"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || (!inputText.trim() && !imagePreview)}
                className="p-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-medium text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition transform active:scale-95 cursor-pointer flex-shrink-0 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
