import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Trophy, 
  Radio, 
  FolderGit2, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  ListOrdered, 
  Scroll,
  ArrowRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import { CompassStarIcon } from './BrandLogos';

export interface MobileSection {
  id: string;
  name: string;
  shortName: string;
  badge?: string;
  icon: React.ReactNode;
}

export const MOBILE_SECTIONS: MobileSection[] = [
  {
    id: 'overview',
    name: 'Overview & Showcase',
    shortName: 'Overview',
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'services',
    name: '6 Campus Services',
    shortName: 'Services',
    badge: '6 Core',
    icon: <Layers className="w-4 h-4 text-violet-400" />,
  },
  {
    id: 'impact',
    name: 'Impact & Leaderboard',
    shortName: 'Impact',
    badge: 'Top 50',
    icon: <Trophy className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'compass',
    name: 'COMPASS AI Core',
    shortName: 'COMPASS',
    badge: 'AI',
    icon: <CompassStarIcon size={16} glow={false} />,
  },
  {
    id: 'chat',
    name: 'Campus Peer Chat',
    shortName: 'Peer Chat',
    badge: 'Live',
    icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'pulse',
    name: 'Live Campus Pulse',
    shortName: 'Pulse',
    badge: 'Feed',
    icon: <Radio className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'projects',
    name: 'Research & Projects',
    shortName: 'Projects',
    badge: 'Collabs',
    icon: <FolderGit2 className="w-4 h-4 text-blue-400" />,
  },
  {
    id: 'marketplace',
    name: 'Student Marketplace',
    shortName: 'Market',
    badge: 'P2P',
    icon: <ShoppingBag className="w-4 h-4 text-pink-400" />,
  },
];

interface MobileSectionNavigatorProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  isTabbedMode: boolean;
  onToggleTabbedMode: (enabled: boolean) => void;
}

export const MobileSectionNavigator: React.FC<MobileSectionNavigatorProps> = ({
  activeSection,
  onSelectSection,
  isTabbedMode,
  onToggleTabbedMode,
}) => {
  const currentIndex = MOBILE_SECTIONS.findIndex((s) => s.id === activeSection);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentSection = MOBILE_SECTIONS[safeIndex];

  const handlePrev = () => {
    if (safeIndex > 0) {
      const prevSection = MOBILE_SECTIONS[safeIndex - 1];
      onSelectSection(prevSection.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (safeIndex < MOBILE_SECTIONS.length - 1) {
      const nextSection = MOBILE_SECTIONS[safeIndex + 1];
      onSelectSection(nextSection.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden sticky top-16 z-40 bg-[#070913]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-xl">
      {/* Top Controls Row */}
      <div className="px-3 pt-2 pb-1.5 flex items-center justify-between gap-2 border-b border-white/[0.04]">
        {/* Section Counter & Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 border border-white/10 font-medium">
            {isTabbedMode ? `SECTION ${safeIndex + 1} OF ${MOBILE_SECTIONS.length}` : 'ALL SECTIONS'}
          </span>
          <span className="text-xs font-heading font-semibold text-white truncate max-w-[150px]">
            {currentSection.name}
          </span>
        </div>

        {/* View Mode Toggle: Tabbed (Single Section) vs Continuous Flow */}
        <button
          onClick={() => onToggleTabbedMode(!isTabbedMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-tech font-semibold transition-all cursor-pointer border ${
            isTabbedMode
              ? 'bg-[#00f2ff]/15 text-[#00f2ff] border-[#00f2ff]/40 shadow-[0_0_12px_rgba(0,242,255,0.2)]'
              : 'bg-white/[0.05] text-white/70 border-white/10 hover:text-white'
          }`}
          title={isTabbedMode ? "Switch to Continuous Full Scroll" : "Switch to Fast Section-by-Section Mode"}
        >
          {isTabbedMode ? (
            <>
              <ListOrdered className="w-3 h-3 text-[#00f2ff]" />
              <span>Tabs View</span>
            </>
          ) : (
            <>
              <Scroll className="w-3 h-3 text-slate-400" />
              <span>Full Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal Scrollable Section Tabs */}
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        {MOBILE_SECTIONS.map((sec, idx) => {
          const isActive = sec.id === activeSection;
          return (
            <button
              key={sec.id}
              onClick={() => {
                onSelectSection(sec.id);
                if (isTabbedMode) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const el = document.getElementById(sec.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-white/15 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)] font-semibold'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border-white/5'
              }`}
            >
              {sec.icon}
              <span className="whitespace-nowrap">{sec.shortName}</span>
              {sec.badge && (
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono-tech ${
                  isActive ? 'bg-cyan-400/30 text-cyan-200' : 'bg-white/10 text-white/50'
                }`}>
                  {sec.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prev / Next Quick Nav Strip (Only when Tabbed Mode is active) */}
      {isTabbedMode && (
        <div className="px-3 py-1.5 bg-[#05060b] border-t border-white/[0.04] flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              safeIndex === 0 
                ? 'opacity-30 text-white/30 cursor-not-allowed' 
                : 'text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/10 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono-tech">Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {MOBILE_SECTIONS.map((s, idx) => (
              <span
                key={s.id}
                onClick={() => onSelectSection(s.id)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === safeIndex ? 'w-5 bg-[#00f2ff]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={safeIndex === MOBILE_SECTIONS.length - 1}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              safeIndex === MOBILE_SECTIONS.length - 1 
                ? 'opacity-30 text-white/30 cursor-not-allowed' 
                : 'text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/10 active:scale-95 cursor-pointer'
            }`}
          >
            <span className="text-[11px] font-mono-tech">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

interface MobileNextSectionFooterProps {
  currentSectionId: string;
  onNavigateNext: (nextSectionId: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const MobileNextSectionFooter: React.FC<MobileNextSectionFooterProps> = ({
  currentSectionId,
  onNavigateNext,
  onNavigateSection,
}) => {
  const currentIndex = MOBILE_SECTIONS.findIndex((s) => s.id === currentSectionId);
  const nextSection = currentIndex >= 0 && currentIndex < MOBILE_SECTIONS.length - 1 
    ? MOBILE_SECTIONS[currentIndex + 1] 
    : null;

  return (
    <div className="lg:hidden px-4 py-8 bg-[#05060b] border-t border-white/[0.08] space-y-4">
      {nextSection ? (
        <button
          onClick={() => {
            onNavigateNext(nextSection.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-violet-950/40 to-pink-950/40 hover:from-cyan-900/60 hover:to-pink-900/60 border border-white/15 hover:border-cyan-400/40 flex items-center justify-between text-left transition-all duration-300 shadow-xl group cursor-pointer active:scale-[0.99]"
        >
          <div>
            <div className="text-[10px] font-mono-tech text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Continue to Next Section</span>
            </div>
            <div className="text-sm font-bold text-white font-heading mt-0.5 group-hover:text-cyan-200 transition-colors">
              {nextSection.name}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all">
            <ArrowRight className="w-4 h-4 text-white group-hover:text-black" />
          </div>
        </button>
      ) : (
        <button
          onClick={() => {
            onNavigateSection('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-center transition-all cursor-pointer"
        >
          <div className="text-xs font-mono-tech text-cyan-300">You've explored all 7 campus sections</div>
          <div className="text-sm font-bold text-white font-heading mt-0.5">Return to Top Overview ↑</div>
        </button>
      )}

      {/* Quick Jump Grid of All Sections */}
      <div className="pt-2">
        <div className="text-[11px] font-mono-tech text-white/40 uppercase tracking-wider mb-2">
          Jump to any section:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MOBILE_SECTIONS.map((sec) => {
            const isCurrent = sec.id === currentSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  onNavigateSection(sec.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 rounded-xl text-left text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white/15 text-white font-bold border border-white/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {sec.icon}
                <span className="truncate">{sec.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
