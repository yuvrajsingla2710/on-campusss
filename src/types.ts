export type ServiceType = 'borrow' | 'guidance' | 'skills' | 'marketplace' | 'impact' | 'connect' | 'compass';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  department: string;
  year: string;
  rank: number;
  impactScore: number;
  title: string;
  nametagIcon?: string;
  verified: boolean;
  knowledgeScore: number;
  skillScore: number;
  resourceScore: number;
  projectScore: number;
  rankJourney: number[];
  monthlyGrowthPercent: number;
  skillsOffered: string[];
  skillsWanted: string[];
  bio: string;
  contactEmail: string;
  email?: string;
  studentId?: string;
  badges?: string[];
  hostelWing?: string;
  kudosCount?: number;
  itemsLent?: number;
  notesShared?: number;
  mentorHours?: number;
  verifiedHash?: string;
  isPrivate?: boolean; // If true: friend request is required before messaging
  friendIds?: string[]; // IDs of confirmed friends/connections
  pendingFriendRequestUserIds?: string[]; // IDs of users requesting to connect with this user
  outgoingFriendRequestUserIds?: string[]; // IDs of users this user has sent requests to
}

export type NotificationType = 
  | 'friend_request' 
  | 'borrow_request' 
  | 'project_invite' 
  | 'skill_swap' 
  | 'kudos' 
  | 'marketplace_inquiry' 
  | 'system';

export interface CampusNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  senderDepartment?: string;
  senderRank?: number;
  status?: 'pending' | 'accepted' | 'declined' | 'completed';
  targetId?: string;
  actionLabel?: string;
  meta?: {
    itemName?: string;
    daysRequested?: number;
    projectName?: string;
    roleName?: string;
    skillOffered?: string;
    kudosPoints?: number;
    userProfile?: UserProfile;
    borrowItemId?: string;
  };
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'Books' | 'Electronics' | 'Furniture' | 'Notes' | 'Equipment' | string;
  price: number;
  condition: 'Brand New' | 'Like new' | 'Good' | 'Fair' | 'Digital scan' | string;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  sellerDepartment?: string;
  description: string;
  symbol: string;
  size: 'tall' | 'wide' | 'standard';
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  sellerRating?: number;
  reviewsCount?: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  creator: string;
  creatorTitle?: string;
  membersCount: number;
  followersCount: number;
  progressPercent: number;
  skillsRequired: string[];
  recruiting: boolean;
  accentColor: string;
  updatesCount: number;
  recentUpdate?: string;
  isFollowing?: boolean;
  hasApplied?: boolean;
  openRoles?: string[];
  leadName?: string;
  department?: string;
}

export interface PulsePost {
  id: string;
  category: 'Sports' | 'Academic' | 'Projects' | 'Events' | 'Opportunities' | 'Discussions';
  author: string;
  authorTitle?: string;
  authorDepartment?: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  badge?: string;
  pinned?: boolean;
  comments?: { id: string; author: string; text: string; time: string }[];
}

export interface BorrowItem {
  id: string;
  title: string;
  category: 'Electronics' | 'Lab Gear' | 'Calculators' | 'Tools' | 'Project Parts';
  available: boolean;
  location: string;
  ownerName: string;
  ownerVerified: boolean;
  maxDays: number;
  depositRequired: string;
  description: string;
}

export interface SkillMatch {
  id: string;
  studentA: {
    name: string;
    avatar: string;
    teaches: string;
    year: string;
  };
  studentB: {
    name: string;
    avatar: string;
    teaches: string;
    year: string;
  };
  matchScore: number;
  status: 'available' | 'connected';
}

export interface GuidanceTopic {
  id: string;
  title: string;
  category: 'Course Advice' | 'Professor Insights' | 'Campus Hack' | 'Career Prep';
  mentorName: string;
  mentorTitle: string;
  reads: number;
  summary: string;
  tips: string[];
}

export interface CompassMessage {
  id: string;
  sender: 'user' | 'compass';
  text: string;
  timestamp: string;
  category?: 'Academic' | 'Lab & Gear' | 'Projects' | 'Skill Swap' | 'Marketplace' | 'Campus Life' | 'General' | string;
  confidenceScore?: number;
  followUpQueries?: string[];
  suggestedCards?: {
    type: 'project' | 'marketplace' | 'skill' | 'pulse' | 'borrow' | 'guidance';
    title: string;
    subtitle: string;
    tag: string;
    actionLabel: string;
    targetId: string;
  }[];
}
