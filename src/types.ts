export type Category = 
  | 'Waste & Ecology'
  | 'Clean Water'
  | 'Solar & Lighting'
  | 'Heritage & Culture'
  | 'Digital & Youth'
  | 'Road Safety & Mobility';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ActionPlanPhase {
  phase: string;
  title: string;
  duration: string;
  tasks: string[];
}

export interface VolunteerRole {
  role: string;
  countNeeded: number;
  description: string;
  skills: string[];
}

export interface ResourceItem {
  item: string;
  quantity: string;
  estimatedCostNPR: string;
  source: string;
}

export interface ExpectedImpact {
  peopleBenefited: number;
  metrics: string;
  environmentalBenefit: string;
  timeline: string;
}

export interface RazaPlan {
  summary: string;
  category: Category | string;
  urgency: UrgencyLevel;
  immediateActions: string[];
  actionPlan: ActionPlanPhase[];
  volunteerRoles: VolunteerRole[];
  resources: ResourceItem[];
  potentialPartners: string[];
  expectedImpact: ExpectedImpact;
  motivationalMotto: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  ward: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  urgency: UrgencyLevel;
  status: 'Active' | 'In Progress' | 'Action Planned' | 'Resolved';
  supportersCount: number;
  hasSupported?: boolean;
  volunteersJoined: number;
  volunteersTarget: number;
  fundsRaisedNPR: number;
  fundsGoalNPR: number;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
  };
  createdAt: string;
  actionPlan?: RazaPlan;
  tags: string[];
}

export interface CivicAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  target: string;
  timeAgo: string;
  type: 'volunteer' | 'support' | 'resolved' | 'raza_plan' | 'grant';
}

export interface RazaCommunityStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface RazaStructuredOutput {
  title: string;
  problem: string;
  category: Category | string;
  urgency: UrgencyLevel;
  knownInfo?: string[];
  uncertainInfo?: string[];
  possibleCauses?: string[];
  immediateActions: string[];
  communityPlan: RazaCommunityStep[];
  volunteerRoles: VolunteerRole[];
  resources: ResourceItem[];
  potentialPartners: string[];
  expectedImpact: string;
  suggestedFollowupQuestion?: string;
  isReadyForInitiative?: boolean;
}

export interface RazaMessage {
  id: string;
  sender: 'user' | 'raza';
  text: string;
  structuredPlan?: RazaStructuredOutput;
  imageUrl?: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  detectedLanguage?: string;
}

export interface RazaConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: RazaMessage[];
}

