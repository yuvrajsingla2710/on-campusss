import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Search, Menu, X, ArrowRight, Sparkles, Compass, Bell, Presentation, Play } from 'lucide-react';
import { OnCampusOrbitalIcon, CompassStarIcon } from './BrandLogos';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenCompass: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onOpenServiceModal?: (service: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenPresentation?: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenCompass,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenServiceModal,
  onNavigateSection,
  onOpenPresentation,
  activeSection = 'hero',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (onNavigateSection) {
      onNavigateSection(id);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#12131b]/95 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand: College Network Logo + ON CAMPUS */}
        <div 
          onClick={() => scrollTo('hero')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          id="brand-logo"
        >
          <OnCampusOrbitalIcon size={28} />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-heading group-hover:text-pink-300 transition-colors">
              OnCampus
            </span>
            <span className="text-[10px] text-zinc-400 font-medium -mt-1 hidden sm:block">
              Student Network
            </span>
          </div>
        </div>

        {/* Center Navigation: Services, Impact, COMPASS, Pulse, Projects, Marketplace (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => scrollTo('services')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer ${
              activeSection === 'services' ? 'text-pink-300 font-bold' : 'text-zinc-400'
            }`}
          >
            Hubs
          </button>

          <button
            onClick={() => scrollTo('marketplace')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer ${
              activeSection === 'marketplace' ? 'text-pink-200 font-bold' : 'text-zinc-400'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => scrollTo('projects')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer ${
              activeSection === 'projects' ? 'text-pink-300 font-bold' : 'text-zinc-400'
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => scrollTo('pulse')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer ${
              activeSection === 'pulse' ? 'text-pink-200 font-bold' : 'text-zinc-400'
            }`}
          >
            Campus Feed
          </button>

          <button
            onClick={() => scrollTo('chat')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'chat' ? 'text-pink-300 font-bold' : 'text-zinc-400'
            }`}
          >
            <span>Peer Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_6px_#fbcfe8]" />
          </button>

          <button
            onClick={() => scrollTo('impact')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer ${
              activeSection === 'impact' ? 'text-pink-300 font-bold' : 'text-zinc-400'
            }`}
          >
            Leaderboard
          </button>

          <button
            onClick={() => scrollTo('compass')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'compass' ? 'text-pink-300 font-bold' : 'text-zinc-400'
            }`}
          >
            <CompassStarIcon size={14} glow={false} />
            <span>Compass AI</span>
          </button>
        </nav>

        {/* Right CTA / Search / Auth / Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
          {/* Quick Command Palette Search Button */}
          {onOpenSearch && (
            <button
              id="navbar-search-btn"
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 hover:border-pink-300/40 hover:bg-zinc-800 transition-all text-xs text-zinc-300 hover:text-white cursor-pointer"
              title="Quick Search & Commands (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-900 rounded text-zinc-400 border border-zinc-700">⌘K</kbd>
            </button>
          )}

          {/* Top Bar Notification Bell Icon with Requests Badge */}
          {onOpenNotifications && (
            <button
              id="navbar-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 hover:border-pink-300/50 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Campus Requests & Notifications"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4 text-pink-300" />
              {unreadNotificationsCount > 0 && (
                <span className="flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-zinc-950 font-bold text-[10px]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {currentUser ? (
            <button
              id="user-profile-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700 hover:border-pink-300/50 transition-all text-xs cursor-pointer shrink-0"
              title="Edit Profile & Switch Identity"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-pink-300 shrink-0"
              />
              <span className="text-zinc-200 font-medium hidden xs:inline sm:inline truncate max-w-[60px] sm:max-w-[85px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-pink-300 font-semibold text-[11px] hidden md:inline">
                #{currentUser.rank}
              </span>
            </button>
          ) : (
            <button
              id="signin-btn"
              onClick={onOpenAuth}
              className="text-xs sm:text-sm text-zinc-300 hover:text-white font-medium px-2.5 py-1.5 transition-colors cursor-pointer shrink-0"
            >
              Sign in
            </button>
          )}

          <button
            id="get-started-btn"
            onClick={() => scrollTo('services')}
            className="hidden lg:inline-flex bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 hover:brightness-105 text-zinc-950 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer shadow-[0_2px_12px_rgba(251,207,232,0.2)] active:scale-[0.98] shrink-0"
          >
            Explore Hubs
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            id="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          id="navbar-mobile-menu"
          className="lg:hidden bg-[#12131b]/98 backdrop-blur-2xl border-b border-zinc-800 px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl"
        >
          {/* Quick Search & Notifications on Mobile */}
          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl bg-[#181a24] border border-zinc-800 text-xs font-mono-tech text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-pink-300" />
                  <span>Search gear, mentors...</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">⌘K</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNotifications();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#181a24] border border-zinc-800 hover:border-pink-300/40 text-xs font-mono-tech text-white transition-all cursor-pointer shrink-0"
              >
                <Bell className="w-4 h-4 text-pink-300" />
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-pink-300 text-zinc-950 font-bold text-[10px]">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-sm font-medium">
            <button
              onClick={() => scrollTo('overview')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'overview' || activeSection === 'hero'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Overview</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('services')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'services'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Services Hub</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('impact')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'impact'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Impact Board</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('compass')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'compass'
                  ? 'bg-pink-950/40 border-pink-300 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CompassStarIcon size={14} glow={false} />
                <span>COMPASS AI</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('chat')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'chat'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-300" />
                <span>Peer Chat</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('pulse')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'pulse'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Campus Pulse</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('projects')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'projects'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Projects & Teams</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => scrollTo('marketplace')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSection === 'marketplace'
                  ? 'bg-pink-950/30 border-pink-300/40 text-pink-200'
                  : 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              <span>Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            {onOpenPresentation && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPresentation();
                }}
                className="p-3 rounded-2xl border border-pink-300/40 bg-pink-950/20 text-pink-200 hover:bg-pink-900/30 text-left transition-all cursor-pointer flex items-center justify-between col-span-2 md:col-span-3"
              >
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-pink-300" />
                  <span className="font-bold">Launch Pitch Deck & Ecosystem Presentation</span>
                </div>
                <Play className="w-3.5 h-3.5 text-pink-300" />
              </button>
            )}
          </div>

          {/* User Profile / Auth Action Card on Mobile */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-3">
            {currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="flex-1 p-3 rounded-2xl bg-[#181a24] border border-zinc-800 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover border border-pink-300/50"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />
                    </div>
                    <div className="text-[10px] font-mono-tech text-zinc-400">
                      Rank #{currentUser.rank} • {currentUser.impactScore} Karma
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono-tech text-pink-300 uppercase font-bold">Switch</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono-tech text-center cursor-pointer"
              >
                Sign in with University ID
              </button>
            )}

            <button
              onClick={() => scrollTo('services')}
              className="sm:hidden px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold text-xs font-mono-tech shrink-0 cursor-pointer shadow-[0_2px_12px_rgba(251,207,232,0.3)]"
            >
              Explore
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

