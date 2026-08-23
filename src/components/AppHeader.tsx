import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  User, 
  ChevronDown, 
  Radio, 
  HandCoins, 
  ShoppingBag, 
  Layers3, 
  Repeat, 
  Trophy, 
  Compass, 
  FolderLock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface AppHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onOpenCommandPalette: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateListing: () => void;
  onOpenCreateProject: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  users,
  onSwitchUser,
  onOpenCommandPalette,
  onOpenCreatePost,
  onOpenCreateListing,
  onOpenCreateProject,
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 'n1', title: 'Borrow Request Confirmed', time: '10m ago', text: 'Aryan accepted your request for Casio fx-991EX.', unread: true },
    { id: 'n2', title: 'Project Team Invite', time: '1h ago', text: 'Autonomous Rover Lab invited you to join their firmware sprint.', unread: true },
    { id: 'n3', title: 'Reputation Level Up', time: '4h ago', text: 'You gained +50 Karma for sharing DSP lecture notes. Current Rank: #03.', unread: false },
  ];

  const tabs = [
    { id: 'pulse', label: 'Pulse', icon: Radio, highlight: '#00f2ff' },
    { id: 'borrow', label: 'Borrow & Lab', icon: HandCoins, highlight: '#00f2ff' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, highlight: '#00f2ff' },
    { id: 'projects', label: 'Projects', icon: Layers3, highlight: '#bc13fe' },
    { id: 'mentorship', label: 'Skill Swap & Guides', icon: Repeat, highlight: '#bc13fe' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, highlight: '#00f2ff' },
    { id: 'compass', label: 'COMPASS AI', icon: Compass, highlight: '#00f2ff' },
    { id: 'locker', label: 'My Locker', icon: FolderLock, highlight: '#bc13fe' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.08]">
      {/* Top OS Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-white/[0.04] text-[11px] font-mono-tech">
        <div className="flex items-center gap-3 text-white/60">
          <div className="flex items-center gap-1.5 text-[#00f2ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
            <span className="font-bold tracking-[1px] uppercase">DTU NODE // LIVE</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="hidden sm:inline text-white/40">FALL 2026 SEMESTER</span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-white/50">12,850 CONNECTED PEERS</span>
        </div>

        {/* User Karma Quick Badge */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTab('leaderboard')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#121212] border border-white/10 hover:border-[#00f2ff] transition-all cursor-pointer"
          >
            <span className="text-[10px] text-white/50 uppercase">RANK</span>
            <span className="text-[#00f2ff] font-bold">#{String(currentUser.rank).padStart(2, '0')}</span>
            <span className="text-white/20">•</span>
            <span className="text-white font-bold">{currentUser.impactScore} PTS</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('pulse')} 
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-sm bg-[#00f2ff] flex items-center justify-center text-black font-black text-xs font-mono-tech shadow-[0_0_15px_rgba(0,242,255,0.4)]">
            OC
          </div>
          <div>
            <div className="text-lg font-black text-white font-heading tracking-tight leading-none">
              ON CAMPUS
            </div>
            <div className="text-[9px] font-mono-tech text-[#00f2ff] tracking-[2px] uppercase mt-0.5">
              CAMPUS OS v3.2
            </div>
          </div>
        </div>

        {/* Global Search Bar Trigger (⌘K) */}
        <div 
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 px-3.5 py-2 bg-[#121212] hover:bg-[#181818] border border-white/10 hover:border-[#00f2ff]/60 rounded-sm text-xs font-mono-tech text-white/50 transition-all cursor-pointer w-72 lg:w-96 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-[#00f2ff]" />
          <span className="flex-1 truncate">Search inventory, projects, guides...</span>
          <kbd className="px-1.5 py-0.5 bg-[#050505] border border-white/10 rounded-sm text-[10px] text-white/60">
            ⌘K
          </kbd>
        </div>

        {/* Actions & User Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Create Action Menu */}
          <div className="relative">
            <button
              id="header-quick-action-btn"
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="px-3 py-2 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,242,255,0.25)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CREATE</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isActionsOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#121212] border border-white/10 rounded-sm shadow-2xl py-1 z-50 font-mono-tech text-xs"
                onClick={() => setIsActionsOpen(false)}
              >
                <button
                  onClick={onOpenCreatePost}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#00f2ff]/10 hover:text-[#00f2ff] text-white transition-colors flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-[#00f2ff]" />
                  <span>Broadcast Pulse Post</span>
                </button>
                <button
                  onClick={onOpenCreateListing}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#00f2ff]/10 hover:text-[#00f2ff] text-white transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#00f2ff]" />
                  <span>List Marketplace Item</span>
                </button>
                <button
                  onClick={onOpenCreateProject}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#bc13fe]/10 hover:text-[#bc13fe] text-white transition-colors flex items-center gap-2"
                >
                  <Layers3 className="w-3.5 h-3.5 text-[#bc13fe]" />
                  <span>Publish Research Project</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="header-notification-btn"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 bg-[#121212] hover:bg-white/5 border border-white/10 rounded-sm text-white/70 hover:text-white transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#bc13fe] animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-[#121212] border border-white/10 rounded-sm shadow-2xl p-3 z-50 font-mono-tech space-y-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-xs font-bold text-white">
                  <span>CAMPUS NOTIFICATIONS</span>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-sm bg-[#050505] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="text-[#00f2ff]">{n.title}</span>
                        <span className="text-[10px] text-white/40">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-white/70 leading-tight">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              id="header-user-btn"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 bg-[#121212] hover:bg-white/5 border border-white/10 rounded-sm transition-all cursor-pointer"
            >
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white font-heading leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-mono-tech text-white/40">
                  {currentUser.department}
                </div>
              </div>
              <div className="w-7 h-7 rounded-sm bg-[#050505] border border-[#00f2ff] flex items-center justify-center font-mono-tech text-xs font-bold text-[#00f2ff]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <ChevronDown className="w-3 h-3 text-white/40" />
            </button>

            {isUserDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#121212] border border-white/10 rounded-sm shadow-2xl py-2 z-50 font-mono-tech"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <div className="px-3 pb-2 mb-2 border-b border-white/[0.08] text-[10px] text-white/40 uppercase">
                  SWITCH ACTIVE CAMPUS PERSONA
                </div>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-[#00f2ff]/10 text-[#00f2ff] font-bold'
                        : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-white/40">{u.department} • #{String(u.rank).padStart(2, '0')}</div>
                    </div>
                    {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Workspace Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-white/[0.04]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono-tech uppercase tracking-[1px] rounded-sm transition-all cursor-pointer whitespace-nowrap border-b-2 font-bold ${
                  isActive
                    ? 'border-[#00f2ff] text-[#00f2ff] bg-white/[0.03]'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00f2ff]' : 'text-white/40'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
