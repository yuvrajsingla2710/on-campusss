import React, { useState } from 'react';
import { 
  mockMarketplaceItems, 
  mockProjects, 
  mockUsers, 
  mockPulsePosts, 
  mockBorrowItems, 
  mockSkillMatches, 
  mockGuidanceTopics, 
  initialCompassMessages,
  mockNotifications
} from './data/mockData';
import { 
  MarketplaceItem, 
  ProjectItem, 
  UserProfile, 
  PulsePost, 
  BorrowItem, 
  SkillMatch, 
  GuidanceTopic, 
  CompassMessage,
  CampusNotification,
  DirectMessage
} from './types';

// Scrollable Website Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TutorialVideoSection } from './components/TutorialVideoSection';
import { ServicesSection } from './components/ServicesSection';
import { ImpactLeaderboard } from './components/ImpactLeaderboard';
import { CompassSection } from './components/CompassSection';
import { CampusChatSection } from './components/CampusChatSection';
import { CampusPulseSection } from './components/CampusPulseSection';
import { ProjectsSection } from './components/ProjectsSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { FinalCinematicSection } from './components/FinalCinematicSection';
import { Footer } from './components/Footer';
import { FloatingCompassWidget } from './components/FloatingCompassWidget';
import { MobileSectionNavigator, MobileNextSectionFooter } from './components/MobileSectionNavigator';

// Detail & Creation Modals
import { MarketplaceDetailModal } from './components/MarketplaceDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreatePostModal } from './components/CreatePostModal';
import { BorrowModal } from './components/BorrowModal';
import { SkillExchangeModal } from './components/SkillExchangeModal';
import { GuidanceModal } from './components/GuidanceModal';
import { AuthModal } from './components/AuthModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { FullLeaderboardModal } from './components/FullLeaderboardModal';
import { StudentPassportModal } from './components/StudentPassportModal';
import { CampusAnalyticsModal } from './components/CampusAnalyticsModal';
import { PeerSquadsModal } from './components/PeerSquadsModal';
import { HostelWingsModal } from './components/HostelWingsModal';
import { ShareModal, ShareData } from './components/ShareModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DirectMessageModal } from './components/DirectMessageModal';
import { PresentationModal } from './components/PresentationModal';

export function App() {
  // Global App Data State
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('oncampus_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load user from localStorage', e);
    }
    return mockUsers[2]; // Yuvraj Sen (#03)
  });
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [pulsePosts, setPulsePosts] = useState<PulsePost[]>(mockPulsePosts);
  const [borrowItems, setBorrowItems] = useState<BorrowItem[]>(mockBorrowItems);
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>(mockSkillMatches);
  const [guidanceTopics, setGuidanceTopics] = useState<GuidanceTopic[]>(mockGuidanceTopics);
  const [compassMessages, setCompassMessages] = useState<CompassMessage[]>(initialCompassMessages);
  const [isCompassLoading, setIsCompassLoading] = useState<boolean>(false);

  // Notifications & Direct Messaging State
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    try {
      const saved = localStorage.getItem('oncampus_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return mockNotifications;
  });

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem('oncampus_direct_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'dm-1',
        senderId: 'u1',
        senderName: 'Ananya Rao',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u3',
        receiverName: 'Yuvraj Sen',
        text: 'Hey Yuvraj! Thanks for the Raspberry Pi 4 loan last week, the lab demo went super well.',
        timestamp: 'Yesterday at 5:12 PM',
        read: true,
      },
      {
        id: 'dm-2',
        senderId: 'u3',
        senderName: 'Yuvraj Sen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u1',
        receiverName: 'Ananya Rao',
        text: 'Glad to help Ananya! Anytime you need gear from North Block H4 just let me know.',
        timestamp: 'Yesterday at 5:20 PM',
        read: true,
      },
      {
        id: 'dm-3',
        senderId: 'u1',
        senderName: 'Ananya Rao',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u3',
        receiverName: 'Yuvraj Sen',
        text: 'Are you free this Thursday to do a quick review on the Distributed Systems assignment? 💻',
        timestamp: '10:14 AM',
        read: true,
      },
      {
        id: 'dm-4',
        senderId: 'u2',
        senderName: 'Devansh Iyer',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u3',
        receiverName: 'Yuvraj Sen',
        text: 'Hey Yuvraj! Saw your post about the autonomous rover testing. Do you need an extra LiDAR sensor for the weekend hackathon?',
        timestamp: 'Yesterday at 8:30 PM',
        read: true,
      },
      {
        id: 'dm-5',
        senderId: 'u3',
        senderName: 'Yuvraj Sen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u2',
        receiverName: 'Devansh Iyer',
        text: 'That would be huge Devansh! Which hostel wing are you in?',
        timestamp: 'Yesterday at 8:45 PM',
        read: true,
      },
      {
        id: 'dm-6',
        senderId: 'u2',
        senderName: 'Devansh Iyer',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        receiverId: 'u3',
        receiverName: 'Yuvraj Sen',
        text: 'Tech Tower (H7), Room 304. Swing by anytime after 6 PM! ⚡',
        timestamp: 'Yesterday at 8:50 PM',
        read: true,
      }
    ];
  });

  // Share Modal State (WhatsApp, Telegram, X, LinkedIn, Reddit, Email, Native Sheet)
  const [shareModalData, setShareModalData] = useState<ShareData | null>(null);
  const handleOpenShare = (data: ShareData) => setShareModalData(data);

  // Modal Visibility States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [directMessageTargetUser, setDirectMessageTargetUser] = useState<UserProfile | null>(null);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFloatingCompassOpen, setIsFloatingCompassOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSquadsOpen, setIsSquadsOpen] = useState(false);
  const [isWingsOpen, setIsWingsOpen] = useState(false);
  const [selectedPassportUser, setSelectedPassportUser] = useState<UserProfile | null>(null);
  const [chatSelectedUserId, setChatSelectedUserId] = useState<string>('u1');

  // Active Detail Selection States
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState<MarketplaceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Active Navigation Section Tracking
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileActiveSection, setMobileActiveSection] = useState<string>('overview');
  const [mobileTabbedMode, setMobileTabbedMode] = useState<boolean>(true);

  const handleNavigateToSection = (sectionId: string) => {
    const normalized = sectionId === 'hero' ? 'overview' : sectionId;
    setMobileActiveSection(normalized);
    setActiveSection(sectionId);
    
    // In continuous mode on mobile or on desktop, scroll to element
    const targetElement = document.getElementById(sectionId === 'overview' ? 'hero' : sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChatWithUser = (user: UserProfile) => {
    setChatSelectedUserId(user.id);
    setMobileActiveSection('chat');
    setActiveSection('chat');
    // Close overlays so the section is in direct focus
    setSelectedPassportUser(null);
    setIsNotificationsOpen(false);
    setIsLeaderboardOpen(false);
    setIsSquadsOpen(false);
    setIsWingsOpen(false);
    setDirectMessageTargetUser(null);

    // Smooth scroll to chat section
    setTimeout(() => {
      document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAuthOpen(false);
        setIsBorrowOpen(false);
        setIsSkillOpen(false);
        setIsGuidanceOpen(false);
        setIsCreateListingOpen(false);
        setIsCreateProjectOpen(false);
        setIsCreatePostOpen(false);
        setIsLeaderboardOpen(false);
        setIsAnalyticsOpen(false);
        setIsSquadsOpen(false);
        setIsWingsOpen(false);
        setSelectedPassportUser(null);
        setSelectedMarketplaceItem(null);
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ==================== USER ACTIONS ====================

  const handleOpenLeaderboard = () => {
    console.log(`[App] Opening Full Leaderboard Modal -> setting isLeaderboardOpen = true (Total users: ${users.length})`);
    setIsLeaderboardOpen(true);
  };

  const handleCloseLeaderboard = () => {
    console.log('[App] Closing Full Leaderboard Modal -> setting isLeaderboardOpen = false');
    setIsLeaderboardOpen(false);
  };

  const handleGiveKudos = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            impactScore: u.impactScore + 5,
            kudosCount: (u.kudosCount || 0) + 1,
          };
        }
        return u;
      })
    );

    // Also update currentUser if it's the target
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        impactScore: prev.impactScore + 5,
        kudosCount: (prev.kudosCount || 0) + 1,
      }));
    }
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('oncampus_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setUsers((prevUsers) => {
      const exists = prevUsers.some((u) => u.id === updatedUser.id);
      if (exists) {
        return prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      }
      return [updatedUser, ...prevUsers];
    });
    try {
      localStorage.setItem('oncampus_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
  };

  // Privacy & Friend Request Logic
  const handleTogglePrivacy = (userId?: string) => {
    const targetId = userId || currentUser.id;
    const target = users.find((u) => u.id === targetId) || currentUser;
    const nextPrivacy = !target.isPrivate;

    const updatedUser: UserProfile = {
      ...target,
      isPrivate: nextPrivacy,
    };

    if (currentUser.id === targetId) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('oncampus_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    if (selectedPassportUser && selectedPassportUser.id === targetId) {
      setSelectedPassportUser(updatedUser);
    }

    setUsers((prev) => prev.map((u) => (u.id === targetId ? updatedUser : u)));
  };

  const handleSendFriendRequest = (targetUserId: string) => {
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    // Update currentUser outgoing list
    const updatedCurrent: UserProfile = {
      ...currentUser,
      outgoingFriendRequestUserIds: Array.from(new Set([...(currentUser.outgoingFriendRequestUserIds || []), targetUserId])),
    };
    setCurrentUser(updatedCurrent);

    // Update targetUser pending list
    const updatedTarget: UserProfile = {
      ...targetUser,
      pendingFriendRequestUserIds: Array.from(new Set([...(targetUser.pendingFriendRequestUserIds || []), currentUser.id])),
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return updatedCurrent;
        if (u.id === targetUserId) return updatedTarget;
        return u;
      })
    );

    if (selectedPassportUser && selectedPassportUser.id === targetUserId) {
      setSelectedPassportUser(updatedTarget);
    }

    // Add a campus notification for this request
    const newNotif: CampusNotification = {
      id: `notif-${Date.now()}`,
      type: 'friend_request',
      title: `Friend Request to ${targetUser.name}`,
      description: `Sent a connection request to ${targetUser.name} (${targetUser.department}) to unlock peer chat.`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderDepartment: currentUser.department,
      senderRank: currentUser.rank,
      timestamp: 'Just now',
      read: false,
      status: 'pending',
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Simulated peer auto-approval so direct messaging is immediately unlocked
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === currentUser.id) {
            return {
              ...u,
              friendIds: Array.from(new Set([...(u.friendIds || []), targetUserId])),
              outgoingFriendRequestUserIds: (u.outgoingFriendRequestUserIds || []).filter((id) => id !== targetUserId),
            };
          }
          if (u.id === targetUserId) {
            return {
              ...u,
              friendIds: Array.from(new Set([...(u.friendIds || []), currentUser.id])),
              pendingFriendRequestUserIds: (u.pendingFriendRequestUserIds || []).filter((id) => id !== currentUser.id),
            };
          }
          return u;
        })
      );

      setCurrentUser((prev) => ({
        ...prev,
        friendIds: Array.from(new Set([...(prev.friendIds || []), targetUserId])),
        outgoingFriendRequestUserIds: (prev.outgoingFriendRequestUserIds || []).filter((id) => id !== targetUserId),
        impactScore: prev.impactScore + 15,
      }));

      // Send greeting DM from the peer
      const welcomeMsg: DirectMessage = {
        id: `dm-${Date.now() + 2}`,
        senderId: targetUserId,
        senderName: targetUser.name,
        senderAvatar: targetUser.avatar,
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        text: `Hey ${currentUser.name.split(' ')[0]}! I accepted your friend request. Great to connect with you! 🤝 Feel free to ask about courses, gear, or projects anytime.`,
        timestamp: 'Just now',
        read: false,
      };
      setDirectMessages((prev) => [...prev, welcomeMsg]);
    }, 1000);
  };

  const handleClearConversation = (targetUserId: string) => {
    setDirectMessages((prev) =>
      prev.filter(
        (m) =>
          !(
            (m.senderId === currentUser.id && m.receiverId === targetUserId) ||
            (m.senderId === targetUserId && m.receiverId === currentUser.id)
          )
      )
    );
  };

  const handleAcceptFriendRequest = (notificationId: string, senderId: string) => {
    // 1. Mark notification accepted
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, status: 'accepted' } : n))
    );

    // 2. Mutual friendship
    const updatedCurrent: UserProfile = {
      ...currentUser,
      friendIds: Array.from(new Set([...(currentUser.friendIds || []), senderId])),
      pendingFriendRequestUserIds: (currentUser.pendingFriendRequestUserIds || []).filter((id) => id !== senderId),
      impactScore: currentUser.impactScore + 15,
    };
    setCurrentUser(updatedCurrent);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return updatedCurrent;
        if (u.id === senderId) {
          return {
            ...u,
            friendIds: Array.from(new Set([...(u.friendIds || []), currentUser.id])),
            outgoingFriendRequestUserIds: (u.outgoingFriendRequestUserIds || []).filter((id) => id !== currentUser.id),
          };
        }
        return u;
      })
    );
  };

  const handleDeclineNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, status: 'declined' } : n))
    );
  };

  const handleApproveBorrowRequest = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, status: 'accepted' } : n))
    );
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 20,
    }));
  };

  const handleAcceptProjectInvite = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, status: 'accepted' } : n))
    );
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 25,
    }));
  };

  const handleAcceptSkillSwap = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, status: 'accepted' } : n))
    );
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 20,
    }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSendDirectMessage = (targetUserId: string, text: string) => {
    if (!text || !text.trim()) return;
    const recipient = users.find((u) => u.id === targetUserId);
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: targetUserId,
      receiverName: recipient?.name || 'Student Peer',
      text: text.trim(),
      timestamp: 'Just now',
      read: true,
    };

    setDirectMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem('oncampus_direct_messages', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Auto-connect peer friendship if not yet connected
    if (recipient && !(currentUser.friendIds || []).includes(targetUserId)) {
      setCurrentUser((prev) => ({
        ...prev,
        friendIds: Array.from(new Set([...(prev.friendIds || []), targetUserId])),
      }));
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === currentUser.id) {
            return {
              ...u,
              friendIds: Array.from(new Set([...(u.friendIds || []), targetUserId])),
            };
          }
          if (u.id === targetUserId) {
            return {
              ...u,
              friendIds: Array.from(new Set([...(u.friendIds || []), currentUser.id])),
            };
          }
          return u;
        })
      );
    }

    // Simulated context-aware peer reply
    if (recipient) {
      setTimeout(() => {
        let replyText = `Hey ${currentUser.name.split(' ')[0]}! Got your message. Let's catch up in the campus lab or library soon! 🚀`;
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('borrow') || lowerText.includes('gear') || lowerText.includes('equipment') || lowerText.includes('pi') || lowerText.includes('arduino') || lowerText.includes('calculator')) {
          replyText = `Hey ${currentUser.name.split(' ')[0]}! Absolutely, I have it ready in ${recipient.hostelWing || 'my hostel room'}. When do you want to swing by to pick it up? 🛠️`;
        } else if (lowerText.includes('note') || lowerText.includes('textbook') || lowerText.includes('course') || lowerText.includes('exam') || lowerText.includes('study')) {
          replyText = `Sure thing! I uploaded my verified handwritten notes and study guide to the shared drive. Let me know if you need any specific lecture breakdown! 📚`;
        } else if (lowerText.includes('hackathon') || lowerText.includes('project') || lowerText.includes('team') || lowerText.includes('collaborat')) {
          replyText = `That sounds awesome! I was looking for a teammate with your skill profile. Let's sync up over Discord or in the lab tomorrow! ⚡`;
        } else if (lowerText.includes('skill') || lowerText.includes('swap') || lowerText.includes('teach') || lowerText.includes('learn')) {
          replyText = `I'd love to do a peer skill exchange! I can walk you through ${recipient.skillsOffered?.[0] || 'the core concepts'} whenever you are free. 💡`;
        } else if (lowerText.includes('coffee') || lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('canteen')) {
          replyText = `Sounds great! Meet you at the Student Center Canteen in 15 mins! ☕`;
        } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
          replyText = `Hey ${currentUser.name.split(' ')[0]}! Great to connect with you. How is your project coming along? ✨`;
        }

        const replyMsg: DirectMessage = {
          id: `dm-${Date.now() + 1}-${Math.random().toString(36).slice(2, 7)}`,
          senderId: targetUserId,
          senderName: recipient.name,
          senderAvatar: recipient.avatar,
          receiverId: currentUser.id,
          receiverName: currentUser.name,
          text: replyText,
          timestamp: 'Just now',
          read: false,
        };
        setDirectMessages((prev) => {
          const updated = [...prev, replyMsg];
          try {
            localStorage.setItem('oncampus_direct_messages', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }, 1200);
    }
  };

  const handleSelectService = (serviceId: string) => {
    const s = serviceId.toLowerCase();
    if (s === 'borrow') {
      setIsBorrowOpen(true);
    } else if (s === 'guidance' || s === 'mentorship') {
      setIsGuidanceOpen(true);
    } else if (s === 'skills' || s === 'skill') {
      setIsSkillOpen(true);
    } else if (s === 'marketplace') {
      handleNavigateToSection('marketplace');
    } else if (s === 'connect' || s === 'chat') {
      handleNavigateToSection('chat');
    } else if (s === 'pulse') {
      handleNavigateToSection('pulse');
    } else if (s === 'compass') {
      handleNavigateToSection('compass');
    } else if (s === 'projects' || s === 'project') {
      handleNavigateToSection('projects');
    } else if (s === 'leaderboard' || s === 'impact') {
      setIsLeaderboardOpen(true);
    } else if (s === 'analytics') {
      setIsAnalyticsOpen(true);
    } else if (s === 'squads') {
      setIsSquadsOpen(true);
    } else if (s === 'wings') {
      setIsWingsOpen(true);
    } else if (s === 'auth' || s === 'profile') {
      setIsAuthOpen(true);
    } else if (s === 'presentation' || s === 'pitch' || s === 'deck' || s === 'slides' || s === 'manifesto') {
      setIsPresentationOpen(true);
    }
  };

  // Marketplace Handlers
  const handleCreateMarketplaceItem = (
    itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'available'>
  ) => {
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `m-${Date.now()}`,
      createdAt: 'Just now',
      available: true,
      sellerName: currentUser.name,
      sellerVerified: currentUser.verified,
      sellerDepartment: currentUser.department,
    };
    setMarketplaceItems([newItem, ...marketplaceItems]);
    
    // Reward impact points
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 30,
      resourceScore: prev.resourceScore + 2,
    }));
  };

  const handleContactSeller = (itemId: string, message: string) => {
    console.log(`Sent message to seller for item ${itemId}:`, message);
  };

  // Projects Handlers
  const handleCreateProject = (
    projData: Omit<ProjectItem, 'id' | 'membersCount' | 'followersCount' | 'updatesCount'>
  ) => {
    const newProj: ProjectItem = {
      ...projData,
      id: `p-${Date.now()}`,
      membersCount: 1,
      followersCount: 1,
      updatesCount: 1,
      creator: currentUser.name,
      creatorTitle: currentUser.title,
    };
    setProjects([newProj, ...projects]);

    // Reward impact points
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 60,
      projectScore: prev.projectScore + 5,
    }));
  };

  const handleToggleFollowProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isFollowing = !p.isFollowing;
          return {
            ...p,
            isFollowing,
            followersCount: isFollowing ? p.followersCount + 1 : p.followersCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleJoinProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, hasApplied: true } : p))
    );
  };

  const handlePostProjectUpdate = (projectId: string, text: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              recentUpdate: text,
              updatesCount: p.updatesCount + 1,
            }
          : p
      )
    );
  };

  // Campus Pulse Handlers
  const handleToggleLikePost = (postId: string) => {
    setPulsePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddCommentToPost = (postId: string, text: string) => {
    setPulsePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser.name,
            text,
            time: 'Just now',
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...(post.comments || []), newComment],
          };
        }
        return post;
      })
    );
  };

  const handleCreatePulsePost = (
    postData: Omit<PulsePost, 'id' | 'likesCount' | 'commentsCount' | 'timestamp' | 'comments'>
  ) => {
    const newPost: PulsePost = {
      ...postData,
      id: `pulse-${Date.now()}`,
      author: currentUser.name,
      authorDepartment: currentUser.department,
      likesCount: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      comments: [],
    };
    setPulsePosts([newPost, ...pulsePosts]);

    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 10,
    }));
  };

  // Borrow Handlers
  const handleRequestBorrow = (itemId: string, duration: number) => {
    setBorrowItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: false } : item
      )
    );
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 15,
    }));
  };

  const handleAddBorrowItem = (itemData: Omit<BorrowItem, 'id' | 'available'>) => {
    const newItem: BorrowItem = {
      ...itemData,
      id: `b-${Date.now()}`,
      available: true,
      ownerName: currentUser.name,
      ownerVerified: currentUser.verified,
    };
    setBorrowItems([newItem, ...borrowItems]);
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 40,
      resourceScore: prev.resourceScore + 3,
    }));
  };

  // Skill Exchange Handlers
  const handleConnectSkillMatch = (matchId: string) => {
    setSkillMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: 'connected' } : m))
    );
  };

  const handleAddSkills = (offered: string, wanted: string) => {
    const newMatch: SkillMatch = {
      id: `match-${Date.now()}`,
      studentA: {
        name: currentUser.name,
        year: currentUser.year || 'Current Student',
        teaches: offered,
        avatar: currentUser.avatar,
      },
      studentB: {
        name: 'Aarav Patel',
        year: '4th Year Physics',
        teaches: wanted,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      },
      matchScore: 94,
      status: 'available',
    };
    setSkillMatches([newMatch, ...skillMatches]);
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 30,
      skillScore: prev.skillScore + 2,
    }));
  };

  // Guidance Handlers
  const handleAddGuidanceTopic = (topicData: Omit<GuidanceTopic, 'id' | 'reads'>) => {
    const newTopic: GuidanceTopic = {
      ...topicData,
      id: `g-${Date.now()}`,
      reads: 1,
      mentorName: currentUser.name,
      mentorTitle: currentUser.title,
    };
    setGuidanceTopics([newTopic, ...guidanceTopics]);
    setCurrentUser((prev) => ({
      ...prev,
      impactScore: prev.impactScore + 50,
      knowledgeScore: prev.knowledgeScore + 3,
    }));
  };

  // COMPASS AI Assistant Handler
  const handleSendCompassMessage = async (text: string) => {
    const userMsg: CompassMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCompassMessages((prev) => [...prev, userMsg]);
    setIsCompassLoading(true);

    try {
      const response = await fetch('/api/compass/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          query: text,
          userContext: {
            name: currentUser.name,
            department: currentUser.department,
            impactScore: currentUser.impactScore,
          },
          campusContext: {
            name: currentUser.name,
            department: currentUser.department,
            impactScore: currentUser.impactScore,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const compassMsg: CompassMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'compass',
        text: data.reply || data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedCards: data.suggestedCards,
        category: data.category,
        confidenceScore: data.confidenceScore,
        followUpQueries: data.followUpQueries,
      };

      setCompassMessages((prev) => [...prev, compassMsg]);
    } catch (err) {
      console.error('COMPASS query error:', err);
      // Fallback
      const fallbackMsg: CompassMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'compass',
        text: `Here is what I indexed across the campus network:\n\n• **Borrow Inventory**: 4 scientific calculators & 2 FPGA kits available in Hostel B.\n• **Senior Guidance**: Check the OS Lab notes and syllabus breakdown.\n• **Research Squads**: Autonomous Rover Team is recruiting 2 firmware members.\n\nClick any shortcut card below to request or connect directly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'Campus Network',
        confidenceScore: 0.95,
        followUpQueries: [
          'Who has Casio scientific calculators?',
          'Find open AI/ML research squads',
          'Where are PYQs for Operating Systems?'
        ],
        suggestedCards: [
          {
            type: 'borrow',
            title: 'Casio fx-991EX Calculator',
            subtitle: 'Available • Arya Hostel • Aman T.',
            targetId: 'b-2',
            tag: 'Hardware',
            actionLabel: 'Borrow Now',
          },
          {
            type: 'project',
            title: 'CampusVision Attendance System',
            subtitle: 'Looking for OpenCV / Python Devs',
            targetId: 'p-1',
            tag: 'Research',
            actionLabel: 'Join Squad',
          },
        ],
      };
      setCompassMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsCompassLoading(false);
    }
  };

  const handleSelectActionCard = (type: string, targetId?: string) => {
    if (type === 'marketplace') {
      const found = marketplaceItems.find((m) => m.id === targetId) || marketplaceItems[0];
      setSelectedMarketplaceItem(found);
    } else if (type === 'project') {
      const found = projects.find((p) => p.id === targetId) || projects[0];
      setSelectedProject(found);
    } else if (type === 'borrow') {
      setIsBorrowOpen(true);
    } else if (type === 'skill') {
      setIsSkillOpen(true);
    } else if (type === 'guidance') {
      setIsGuidanceOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f2ff] selection:text-black font-sans antialiased flex flex-col">
      {/* 1. Header / Navbar matching Screenshot 1 */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCompass={() => setIsFloatingCompassOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        onOpenServiceModal={(srv) => handleSelectService(srv)}
        onNavigateSection={handleNavigateToSection}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        activeSection={mobileActiveSection}
      />

      {/* Mobile Sticky Section Switcher & Mode Toggle (Visible on mobile/tablet <lg) */}
      <MobileSectionNavigator
        activeSection={mobileActiveSection}
        onSelectSection={(secId) => {
          setMobileActiveSection(secId);
          setActiveSection(secId);
        }}
        isTabbedMode={mobileTabbedMode}
        onToggleTabbedMode={setMobileTabbedMode}
      />

      {/* SECTION 1: Overview (Hero & Showcase Walkthrough) */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'overview' ? 'block' : 'hidden lg:block'}>
        <Hero
          onOpenCompass={() => setIsFloatingCompassOpen(true)}
          onExplore={() => handleNavigateToSection('services')}
          onExploreServices={() => handleNavigateToSection('services')}
          onEnterNetwork={() => handleNavigateToSection('services')}
          onOpenPresentation={() => setIsPresentationOpen(true)}
        />
        <TutorialVideoSection />
      </div>

      {/* SECTION 2: The Platform / Six Services */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'services' ? 'block' : 'hidden lg:block'}>
        <ServicesSection
          onSelectService={handleSelectService}
          onOpenServiceModal={handleSelectService}
          borrowItems={borrowItems}
          guidanceTopics={guidanceTopics}
          skillMatches={skillMatches}
          marketplaceItems={marketplaceItems}
          projects={projects}
          onSelectMarketplaceItem={(item) => setSelectedMarketplaceItem(item)}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onAskCompassWithQuery={(query) => {
            handleSendCompassMessage(query);
            handleNavigateToSection('compass');
          }}
        />
      </div>

      {/* SECTION 3: Impact Engine & Leaderboard */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'impact' ? 'block' : 'hidden lg:block'}>
        <ImpactLeaderboard
          users={users}
          onSelectUser={(u) => setSelectedPassportUser(u)}
          onOpenFullLeaderboard={handleOpenLeaderboard}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
          onOpenSquads={() => setIsSquadsOpen(true)}
          onOpenWings={() => setIsWingsOpen(true)}
          onOpenPassport={(u) => setSelectedPassportUser(u)}
        />
      </div>

      {/* SECTION 4: COMPASS AI Section */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'compass' ? 'block' : 'hidden lg:block'}>
        <CompassSection
          messages={compassMessages}
          onSendMessage={handleSendCompassMessage}
          isLoading={isCompassLoading}
          onSelectActionCard={handleSelectActionCard}
        />
      </div>

      {/* SECTION 5: Campus Peer Chatbox (P2P Messaging) */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'chat' ? 'block' : 'hidden lg:block'}>
        <CampusChatSection
          users={users}
          currentUser={currentUser}
          messages={directMessages}
          onSendMessage={handleSendDirectMessage}
          onSendFriendRequest={handleSendFriendRequest}
          onClearConversation={handleClearConversation}
          onOpenPassport={(u) => setSelectedPassportUser(u)}
          selectedUserId={chatSelectedUserId}
          onSelectUser={(u) => setChatSelectedUserId(u.id)}
        />
      </div>

      {/* SECTION 6: Live Campus Pulse Stream */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'pulse' ? 'block' : 'hidden lg:block'}>
        <CampusPulseSection
          posts={pulsePosts}
          onToggleLike={handleToggleLikePost}
          onAddComment={handleAddCommentToPost}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenShare={handleOpenShare}
        />
      </div>

      {/* SECTION 6: Research & Project Collaborations */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'projects' ? 'block' : 'hidden lg:block'}>
        <ProjectsSection
          projects={projects}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          onToggleFollow={handleToggleFollowProject}
          onJoinProject={handleJoinProject}
        />
      </div>

      {/* SECTION 7: Peer Marketplace */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'marketplace' ? 'block' : 'hidden lg:block'}>
        <MarketplaceSection
          items={marketplaceItems}
          onSelectItem={(item) => setSelectedMarketplaceItem(item)}
          onOpenCreateModal={() => setIsCreateListingOpen(true)}
        />
      </div>

      {/* Final Ecosystem Manifesto */}
      <div className={!mobileTabbedMode || mobileActiveSection === 'overview' ? 'block' : 'hidden lg:block'}>
        <FinalCinematicSection
          onEnterApp={() => handleNavigateToSection('services')}
        />
      </div>

      {/* Mobile Next Section Footer (Only shown when Tabbed Mode is active on mobile) */}
      {mobileTabbedMode && (
        <MobileNextSectionFooter
          currentSectionId={mobileActiveSection}
          onNavigateNext={(nextId) => {
            setMobileActiveSection(nextId);
            setActiveSection(nextId);
          }}
          onNavigateSection={(secId) => {
            setMobileActiveSection(secId);
            setActiveSection(secId);
          }}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* ==================== GLOBAL MODALS & DIALOGS ==================== */}

      {/* Universal Multi-Platform Share Modal */}
      <ShareModal
        isOpen={!!shareModalData}
        shareData={shareModalData}
        onClose={() => setShareModalData(null)}
      />

      {/* Command Palette (⌘K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          handleSelectService(tab);
        }}
        marketplaceItems={marketplaceItems}
        projects={projects}
        borrowItems={borrowItems}
        guidanceTopics={guidanceTopics}
        onSelectItem={(item) => setSelectedMarketplaceItem(item)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Borrow Modal & Inventory Sheet */}
      <BorrowModal
        isOpen={isBorrowOpen}
        onClose={() => setIsBorrowOpen(false)}
        items={borrowItems}
        onRequestBorrow={handleRequestBorrow}
        onAddBorrowItem={handleAddBorrowItem}
      />

      {/* Guidance & Mentorship Modal */}
      <GuidanceModal
        isOpen={isGuidanceOpen}
        onClose={() => setIsGuidanceOpen(false)}
        topics={guidanceTopics}
        onAddTopic={handleAddGuidanceTopic}
      />

      {/* Skill Exchange Match Modal */}
      <SkillExchangeModal
        isOpen={isSkillOpen}
        onClose={() => setIsSkillOpen(false)}
        matches={skillMatches}
        onConnectMatch={handleConnectSkillMatch}
        onAddSkills={handleAddSkills}
      />

      {/* Marketplace Detail Modal */}
      <MarketplaceDetailModal
        item={selectedMarketplaceItem}
        onClose={() => setSelectedMarketplaceItem(null)}
        onContactSeller={handleContactSeller}
        onOpenShare={handleOpenShare}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onCreateListing={handleCreateMarketplaceItem}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onToggleFollow={handleToggleFollowProject}
        onJoinProject={handleJoinProject}
        onPostUpdate={handlePostProjectUpdate}
        onOpenShare={handleOpenShare}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onCreatePost={handleCreatePulsePost}
      />

      {/* Persona & Auth Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSwitchUser}
        onSwitchUser={handleSwitchUser}
        onUpdateUser={handleUpdateProfile}
      />

      {/* Full Leaderboard Modal (50+ Campus Leaders, Filters, Badges & Proofs) */}
      <FullLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={handleCloseLeaderboard}
        users={users}
        currentUser={currentUser}
        onSelectUserForPassport={(user) => {
          setSelectedPassportUser(user);
        }}
        onGiveKudos={handleGiveKudos}
        onOpenShare={handleOpenShare}
      />

      {/* Student Passport & Cryptographic Credentials Modal */}
      <StudentPassportModal
        isOpen={!!selectedPassportUser}
        user={selectedPassportUser}
        currentUser={currentUser}
        onClose={() => setSelectedPassportUser(null)}
        onGiveKudos={handleGiveKudos}
        onOpenEditProfile={() => {
          setSelectedPassportUser(null);
          setIsAuthOpen(true);
        }}
        onOpenDirectMessage={(user) => {
          handleOpenChatWithUser(user);
        }}
        onSendFriendRequest={handleSendFriendRequest}
        onTogglePrivacy={handleTogglePrivacy}
      />

      {/* Campus Notifications Modal (Friend Requests, Borrow Approvals, Project Invites) */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        currentUser={currentUser}
        onAcceptFriendRequest={handleAcceptFriendRequest}
        onDeclineRequest={handleDeclineNotification}
        onApproveBorrowRequest={handleApproveBorrowRequest}
        onAcceptProjectInvite={handleAcceptProjectInvite}
        onAcceptSkillSwap={handleAcceptSkillSwap}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onOpenPassport={(user) => {
          setIsNotificationsOpen(false);
          setSelectedPassportUser(user);
        }}
        onOpenDirectMessage={(user) => {
          handleOpenChatWithUser(user);
        }}
        users={users}
      />

      {/* Direct Messaging Modal (Public instant chat or Private friend-gated) */}
      <DirectMessageModal
        isOpen={!!directMessageTargetUser}
        targetUser={directMessageTargetUser}
        currentUser={currentUser}
        messages={directMessages}
        onClose={() => setDirectMessageTargetUser(null)}
        onSendMessage={handleSendDirectMessage}
        onSendFriendRequest={handleSendFriendRequest}
        onOpenInPageChat={handleOpenChatWithUser}
        onOpenPassport={(user) => {
          setDirectMessageTargetUser(null);
          setSelectedPassportUser(user);
        }}
      />

      {/* Campus Telemetry & Impact Analytics Modal */}
      <CampusAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Peer Squads & Study Teams Modal */}
      <PeerSquadsModal
        isOpen={isSquadsOpen}
        onClose={() => setIsSquadsOpen(false)}
        currentUser={currentUser}
      />

      {/* Campus Hostel Wings Modal */}
      <HostelWingsModal
        isOpen={isWingsOpen}
        onClose={() => setIsWingsOpen(false)}
      />

      {/* ON CAMPUS Ecosystem Pitch Deck & Interactive Presentation */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onLaunchService={handleSelectService}
      />

      {/* Floating COMPASS Widget (Pink & White mixture with Chatbox Popup) */}
      <FloatingCompassWidget
        isOpen={isFloatingCompassOpen}
        onToggle={() => setIsFloatingCompassOpen(!isFloatingCompassOpen)}
        messages={compassMessages}
        onSendMessage={handleSendCompassMessage}
        isLoading={isCompassLoading}
        onSelectActionCard={handleSelectActionCard}
      />
    </div>
  );
}

export default App;
