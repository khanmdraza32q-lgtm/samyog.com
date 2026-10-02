import { CivicIssue, CivicAchievement, ActivityEvent } from '../types.ts';

export const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'iss-101',
    title: 'Bagmati Riverbank Micro-Plastic & Debris Interceptor Drive',
    description: 'Civic mobilization to clear accumulated monsoon plastics and install two floating bio-barriers along the Teku-Thapathali river corridor.',
    category: 'Waste & Ecology',
    location: 'Teku-Thapathali Corridor, Kathmandu',
    ward: 'Ward 11 & 12',
    coordinates: { x: 38, y: 52, lat: 27.6938, lng: 85.3120 },
    urgency: 'Critical',
    status: 'In Progress',
    supportersCount: 438,
    hasSupported: false,
    volunteersJoined: 34,
    volunteersTarget: 50,
    fundsRaisedNPR: 48500,
    fundsGoalNPR: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Prajwol Shrestha',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Civic Pioneer'
    },
    createdAt: '2 days ago',
    tags: ['Ecology', 'Bagmati', 'YouthAction', 'Recycling']
  },
  {
    id: 'iss-102',
    title: 'Solar Smart-Lighting for Blind Inner Gallis of Old Patan',
    description: 'Installing 18 motion-detecting solar LED lanterns in dark historic courtyard passageways to enhance safety for women, elders, and nighttime pedestrians.',
    category: 'Solar & Lighting',
    location: 'Patan Durbar Inner Gallis, Lalitpur',
    ward: 'Ward 16, Lalitpur',
    coordinates: { x: 62, y: 68, lat: 27.6710, lng: 85.3255 },
    urgency: 'High',
    status: 'Action Planned',
    supportersCount: 312,
    hasSupported: true,
    volunteersJoined: 16,
    volunteersTarget: 20,
    fundsRaisedNPR: 82000,
    fundsGoalNPR: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Sunita Maharjan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      badge: 'Heritage Steward'
    },
    createdAt: '4 days ago',
    tags: ['Renewable', 'Safety', 'SmartCity', 'Lalitpur']
  },
  {
    id: 'iss-103',
    title: 'Community Water Filtration & Smart Quality Testing Node',
    description: 'Establishing an open testing kiosk and ultra-filtration replenishment tank at Asan Chowk to combat bacterial contaminants in municipal tap supply.',
    category: 'Clean Water',
    location: 'Asan Bajar, Central Kathmandu',
    ward: 'Ward 27',
    coordinates: { x: 44, y: 39, lat: 27.7071, lng: 85.3135 },
    urgency: 'Critical',
    status: 'Active',
    supportersCount: 520,
    hasSupported: false,
    volunteersJoined: 22,
    volunteersTarget: 30,
    fundsRaisedNPR: 110000,
    fundsGoalNPR: 140000,
    imageUrl: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Bikash Shakya',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      badge: 'Health Lead'
    },
    createdAt: '1 day ago',
    tags: ['Water', 'PublicHealth', 'IoTTesting', 'Kathmandu']
  },
  {
    id: 'iss-104',
    title: 'Restoration & Micro-Garden at Damaged Historic Falcha',
    description: 'Rebuilding wooden structural lintels and planting indigenous medicinal flora around the earthquake-affected community shelter (falcha) in Bhaktapur.',
    category: 'Heritage & Culture',
    location: 'Taumadhi Square Perimeter, Bhaktapur',
    ward: 'Ward 4, Bhaktapur',
    coordinates: { x: 82, y: 46, lat: 27.6722, lng: 85.4283 },
    urgency: 'Medium',
    status: 'Resolved',
    supportersCount: 290,
    hasSupported: false,
    volunteersJoined: 42,
    volunteersTarget: 40,
    fundsRaisedNPR: 74000,
    fundsGoalNPR: 70000,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Aayush Prajapati',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badge: 'Artisan Custodian'
    },
    createdAt: '1 week ago',
    tags: ['Heritage', 'Falcha', 'Carpentry', 'Bhaktapur']
  },
  {
    id: 'iss-105',
    title: 'Youth Open-Tech Makerspace in Public Secondary School',
    description: 'Transforming an idle municipal room into a community STEM workshop with refurbished PCs, Arduino microcontrollers, and coding mentors for local kids.',
    category: 'Digital & Youth',
    location: 'Balkumari Public Secondary, Lalitpur',
    ward: 'Ward 9',
    coordinates: { x: 70, y: 76, lat: 27.6698, lng: 85.3400 },
    urgency: 'Medium',
    status: 'Active',
    supportersCount: 184,
    hasSupported: false,
    volunteersJoined: 12,
    volunteersTarget: 18,
    fundsRaisedNPR: 56000,
    fundsGoalNPR: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Nisha Dahal',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      badge: 'Tech Mentor'
    },
    createdAt: '3 days ago',
    tags: ['Education', 'Coding', 'OpenSource', 'Youth']
  },
  {
    id: 'iss-106',
    title: 'Safe Pedestrian Zebra Crossings & Solar Beacon Warnings',
    description: 'Repainting high-reflectivity thermal markings and erecting flashing yellow solar alert blinkers near the busy hospital intersection at Mahrajgunj.',
    category: 'Road Safety & Mobility',
    location: 'Maharajgunj Chakrapath Ring Road, Kathmandu',
    ward: 'Ward 3',
    coordinates: { x: 30, y: 22, lat: 27.7360, lng: 85.3315 },
    urgency: 'High',
    status: 'In Progress',
    supportersCount: 377,
    hasSupported: false,
    volunteersJoined: 19,
    volunteersTarget: 25,
    fundsRaisedNPR: 39000,
    fundsGoalNPR: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Rohan KC',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      badge: 'Safety Advocate'
    },
    createdAt: '5 days ago',
    tags: ['RoadSafety', 'ZebraCrossing', 'Pedestrians']
  }
];

export const CIVIC_ACHIEVEMENTS: CivicAchievement[] = [
  {
    id: 'ach-1',
    title: 'Community Catalyst',
    description: 'Created your first community action plan and mobilized 5+ volunteers.',
    icon: 'Sparkles',
    rarity: 'Common',
    progress: 1,
    maxProgress: 1,
    unlockedAt: 'Unlocked today'
  },
  {
    id: 'ach-2',
    title: 'Green Guardian',
    description: 'Participated in ecological cleanup removing 100kg+ waste.',
    icon: 'Leaf',
    rarity: 'Rare',
    progress: 2,
    maxProgress: 3
  },
  {
    id: 'ach-3',
    title: 'Solar Pioneer',
    description: 'Contributed to civic lighting or renewable energy installation in dark alleys.',
    icon: 'Sun',
    rarity: 'Epic',
    progress: 1,
    maxProgress: 2
  },
  {
    id: 'ach-4',
    title: 'Civic First Responder',
    description: 'Supported a Critical urgency civic problem within 2 hours of posting.',
    icon: 'ShieldCheck',
    rarity: 'Legendary',
    progress: 0,
    maxProgress: 1
  }
];

export const RECENT_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    user: 'Suman Shrestha',
    action: 'joined as Field Logistics Coordinator for',
    target: 'Bagmati Riverbank Cleanup',
    timeAgo: '3m ago',
    type: 'volunteer'
  },
  {
    id: 'act-2',
    user: 'Ward 16 Civic Office',
    action: 'endorsed and pledged Rs 25,000 for',
    target: 'Patan Inner Galli Solar Drive',
    timeAgo: '14m ago',
    type: 'grant'
  },
  {
    id: 'act-3',
    user: 'Dr. Anupama Giri',
    action: 'verified water testing sensor results for',
    target: 'Asan Chowk Water Node',
    timeAgo: '28m ago',
    type: 'resolved'
  },
  {
    id: 'act-4',
    user: 'RAZA AI Brain',
    action: 'generated optimized 3-phase action plan for',
    target: 'Dillibazar Pothole & Storm Drain Fix',
    timeAgo: '42m ago',
    type: 'raza_plan'
  },
  {
    id: 'act-5',
    user: 'Kritika Sharma',
    action: 'vouched and pledged support to',
    target: 'Balkumari Public Secondary Tech Lab',
    timeAgo: '1h ago',
    type: 'support'
  }
];

export const PRESET_PROBLEMS = [
  {
    title: 'Bagmati River Corridor Monsoon Plastic Build-up',
    category: 'Waste & Ecology' as const,
    location: 'Teku Confluence, Kathmandu',
    urgency: 'Critical' as const,
    description: 'Post-monsoon floodwaters have left massive plastic and styrofoam blockages along the riverbanks near historic ghats, risking drainage backflow and waterborne hazards.'
  },
  {
    title: 'Pitch-Dark Inner Gallis between Patan Courtyards',
    category: 'Solar & Lighting' as const,
    location: 'Chyasal & Mangal Bazar Wards, Lalitpur',
    urgency: 'High' as const,
    description: 'Several heritage passages have burnt-out wiring with no municipal lights, causing recurring night hazards for children and returning late-night workers.'
  },
  {
    title: 'Bacterial Contamination in Neighborhood Well Tap',
    category: 'Clean Water' as const,
    location: 'Thahiti Chowk, Ward 30, Kathmandu',
    urgency: 'Critical' as const,
    description: 'Community tests revealed turbidity and bacterial spike in the community Dhunge Dhara water sprout after drainage leak nearby.'
  },
  {
    title: 'Decaying Timber Pillars in 200-Year-Old Tol Falcha',
    category: 'Heritage & Culture' as const,
    location: 'Dattatreya Square, Bhaktapur',
    urgency: 'Medium' as const,
    description: 'The community gathering shelter has termite damage and weathered wooden brackets requiring traditional Newari carpentry treatment before structural failure.'
  }
];
