import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Upload, MapPin, Users, Coins } from 'lucide-react';
import { CivicIssue, RazaPlan, RazaStructuredOutput, Category, UrgencyLevel } from '../types.ts';
import { playTechChime } from '../utils/audio.ts';
import { supabase } from '../utils/supabase.ts';

interface CreateInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newIssue: CivicIssue) => void;
  prefillPlan?: RazaPlan | null;
  prefillStructured?: RazaStructuredOutput | null;
  prefillMeta?: { title: string; location: string; category: Category; urgency: UrgencyLevel } | null;
  reducedMotion?: boolean;
}

export const CreateInitiativeModal: React.FC<CreateInitiativeModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  prefillPlan = null,
  prefillStructured = null,
  prefillMeta = null,
  reducedMotion = false,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Waste & Ecology');
  const [urgency, setUrgency] = useState<UrgencyLevel>('High');
  const [location, setLocation] = useState('Kathmandu Ward 4');
  const [volunteersTarget, setVolunteersTarget] = useState(20);
  const [fundsGoalNPR, setFundsGoalNPR] = useState(40000);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  );

  // Sync state when opened with prefilled data
  useEffect(() => {
    if (prefillStructured) {
      setTitle(prefillStructured.title || '');
      setDescription(prefillStructured.problem || '');
      if (prefillStructured.category) {
        setCategory(prefillStructured.category as Category);
      }
      if (prefillStructured.urgency) {
        setUrgency(prefillStructured.urgency);
      }
      if (prefillStructured.volunteerRoles && prefillStructured.volunteerRoles.length > 0) {
        const totalVolunteers = prefillStructured.volunteerRoles.reduce((sum, r) => sum + (r.countNeeded || 0), 0);
        setVolunteersTarget(totalVolunteers > 0 ? totalVolunteers : 20);
      }
    } else if (prefillPlan) {
      setTitle(prefillMeta?.title || 'Community Civic Initiative');
      setDescription(prefillPlan.summary || '');
      if (prefillMeta?.category) setCategory(prefillMeta.category);
      if (prefillMeta?.urgency) setUrgency(prefillMeta.urgency);
      if (prefillMeta?.location) setLocation(prefillMeta.location);
    } else if (prefillMeta) {
      setTitle(prefillMeta.title || '');
      if (prefillMeta.category) setCategory(prefillMeta.category);
      if (prefillMeta.urgency) setUrgency(prefillMeta.urgency);
      if (prefillMeta.location) setLocation(prefillMeta.location);
    }
  }, [prefillStructured, prefillPlan, prefillMeta]);

  // Success celebration state
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdIssueObj, setCreatedIssueObj] = useState<CivicIssue | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playTechChime('unlock');

    const newIssue: CivicIssue = {
      id: `iss-${Date.now()}`,
      title: title.trim() || 'Civic Community Initiative',
      description: description.trim(),
      category,
      urgency,
      location: location.trim() || 'Kathmandu, Nepal',
      ward: location.includes('Ward') ? location : `${location} Ward`,
      coordinates: { x: 50 + (Math.random() - 0.5) * 35, y: 50 + (Math.random() - 0.5) * 35 },
      status: 'Active',
      supportersCount: 1,
      hasSupported: true,
      volunteersJoined: 1,
      volunteersTarget: Number(volunteersTarget) || 20,
      fundsRaisedNPR: 2500,
      fundsGoalNPR: Number(fundsGoalNPR) || 45000,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'You (Civic Lead)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        badge: 'Catalyst'
      },
      createdAt: 'Just now',
      actionPlan: prefillPlan || undefined,
      tags: ['CivicAction', category.replace(/\s+/g, '')]
    };

    // If Supabase is available, sync to initiatives table
    if (supabase) {
      try {
        await supabase.from('initiatives').insert({
          id: newIssue.id,
          title: newIssue.title,
          description: newIssue.description,
          category: newIssue.category,
          urgency: newIssue.urgency,
          location: newIssue.location,
          volunteers_target: newIssue.volunteersTarget,
          funds_goal: newIssue.fundsGoalNPR,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase initiative save notice:', err);
      }
    }

    setCreatedIssueObj(newIssue);
    setIsSuccess(true);
    onCreated(newIssue);

    // Auto-close after brief celebration
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
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

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {prefillPlan ? 'Convert RAZA Plan → Live Initiative' : 'Launch New Civic Initiative'}
                </h3>
                <p className="text-xs text-slate-400">
                  {prefillPlan
                    ? 'Publish this synthesized blueprint to the Nepal Community Grid'
                    : 'Mobilize neighbors and coordinate resources for local action'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Initiative Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clean & Green Teku Riverbank Mobilization"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Waste & Ecology">Waste & Ecology</option>
                    <option value="Clean Water">Clean Water</option>
                    <option value="Solar & Lighting">Solar & Lighting</option>
                    <option value="Heritage & Culture">Heritage & Culture</option>
                    <option value="Digital & Youth">Digital & Youth</option>
                    <option value="Road Safety & Mobility">Road Safety & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location & Ward</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Asan Chowk, Ward 27, Kathmandu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Community Mission Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain goals, schedule, and safety guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> Volunteers Target
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={volunteersTarget}
                    onChange={(e) => setVolunteersTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" /> Goal (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={fundsGoalNPR}
                    onChange={(e) => setFundsGoalNPR(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.4)] transition transform active:scale-95 cursor-pointer"
                >
                  <span>Broadcast to Community Network</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Successful creation celebration animation */
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-lg animate-ping" />
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_25px_#10b981]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-white mb-1">
              Initiative Broadcast Live!
            </h3>
            <p className="text-xs text-emerald-300 font-mono mb-4">
              Connected to Nepal Civic Grid & Local Ward Desk
            </p>

            {createdIssueObj && (
              <div className="w-full max-w-sm p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {createdIssueObj.ward}
                </span>
                <h4 className="font-semibold text-xs text-white truncate">
                  {createdIssueObj.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>Initial Mobilization:</span>
                  <span className="font-mono text-emerald-300 font-semibold">
                    1 Volunteer Active (You)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
