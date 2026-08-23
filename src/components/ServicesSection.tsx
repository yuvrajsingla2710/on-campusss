import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  ArrowLeftRight, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Sparkles, 
  Search, 
  X, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Tag, 
  ArrowRight, 
  Layers3, 
  Zap,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { CompassStarIcon } from './BrandLogos';
import { 
  BorrowItem, 
  GuidanceTopic, 
  SkillMatch, 
  MarketplaceItem, 
  ProjectItem 
} from '../types';
import { 
  mockBorrowItems, 
  mockGuidanceTopics, 
  mockSkillMatches, 
  mockMarketplaceItems, 
  mockProjects 
} from '../data/mockData';

interface ServicesSectionProps {
  onOpenServiceModal?: (service: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onSelectService?: (service: string) => void;
  borrowItems?: BorrowItem[];
  guidanceTopics?: GuidanceTopic[];
  skillMatches?: SkillMatch[];
  marketplaceItems?: MarketplaceItem[];
  projects?: ProjectItem[];
  onSelectMarketplaceItem?: (item: MarketplaceItem) => void;
  onSelectProject?: (project: ProjectItem) => void;
  onAskCompassWithQuery?: (query: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenServiceModal,
  onNavigateSection,
  onSelectService,
  borrowItems = mockBorrowItems,
  guidanceTopics = mockGuidanceTopics,
  skillMatches = mockSkillMatches,
  marketplaceItems = mockMarketplaceItems,
  projects = mockProjects,
  onSelectMarketplaceItem,
  onSelectProject,
  onAskCompassWithQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'borrow' | 'guidance' | 'skills' | 'marketplace' | 'projects'
  >('all');
  const [showResultsDrawer, setShowResultsDrawer] = useState(false);

  const handleCardClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    } else if (onOpenServiceModal) {
      onOpenServiceModal(serviceId);
    }
  };

  const quickSearchSuggestions = [
    { label: 'TI-84 Calculator', category: 'borrow' as const },
    { label: 'Oscilloscope', category: 'borrow' as const },
    { label: 'Operating Systems', category: 'guidance' as const },
    { label: 'Figma UI/UX', category: 'skills' as const },
    { label: 'Lab Coat & Gear', category: 'borrow' as const },
    { label: 'Robotics AI', category: 'projects' as const },
    { label: 'CampusVision', category: 'projects' as const },
  ];

  // Aggregated Search Results
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const results: Array<{
      id: string;
      protocol: 'borrow' | 'guidance' | 'skills' | 'marketplace' | 'projects';
      title: string;
      subtitle: string;
      categoryTag: string;
      ownerOrMentor: string;
      metaInfo: string;
      accentColor: string;
      originalItem: any;
    }> = [];

    // 1. Borrow Items
    if (activeCategoryFilter === 'all' || activeCategoryFilter === 'borrow') {
      borrowItems.forEach((item) => {
        const matches =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query);

        if (matches) {
          results.push({
            id: item.id,
            protocol: 'borrow',
            title: item.title,
            subtitle: item.description,
            categoryTag: item.category,
            ownerOrMentor: item.ownerName,
            metaInfo: `${item.location} • Max ${item.maxDays} days`,
            accentColor: '#00f2ff',
            originalItem: item,
          });
        }
      });
    }

    // 2. Guidance Topics
    if (activeCategoryFilter === 'all' || activeCategoryFilter === 'guidance') {
      guidanceTopics.forEach((topic) => {
        const matches =
          !query ||
          topic.title.toLowerCase().includes(query) ||
          topic.category.toLowerCase().includes(query) ||
          topic.summary.toLowerCase().includes(query) ||
          topic.mentorName.toLowerCase().includes(query) ||
          topic.tips.some((tip) => tip.toLowerCase().includes(query));

        if (matches) {
          results.push({
            id: topic.id,
            protocol: 'guidance',
            title: topic.title,
            subtitle: topic.summary,
            categoryTag: topic.category,
            ownerOrMentor: topic.mentorName,
            metaInfo: `${topic.mentorTitle} • ${topic.reads} Reads`,
            accentColor: '#a855f7',
            originalItem: topic,
          });
        }
      });
    }

    // 3. Skill Matches
    if (activeCategoryFilter === 'all' || activeCategoryFilter === 'skills') {
      skillMatches.forEach((match) => {
        const skillsText = `${match.studentA.teaches} ${match.studentB.teaches} ${match.studentA.name} ${match.studentB.name}`.toLowerCase();
        const matches = !query || skillsText.includes(query);

        if (matches) {
          results.push({
            id: match.id,
            protocol: 'skills',
            title: `${match.studentA.teaches} ↔ ${match.studentB.teaches}`,
            subtitle: `Skill exchange between ${match.studentA.name} and ${match.studentB.name}`,
            categoryTag: `${match.matchScore}% Match Score`,
            ownerOrMentor: `${match.studentA.name} & ${match.studentB.name}`,
            metaInfo: `${match.studentA.year} • ${match.studentB.year}`,
            accentColor: '#38bdf8',
            originalItem: match,
          });
        }
      });
    }

    // 4. Marketplace Items
    if (activeCategoryFilter === 'all' || activeCategoryFilter === 'marketplace') {
      marketplaceItems.forEach((mItem) => {
        const matches =
          !query ||
          mItem.title.toLowerCase().includes(query) ||
          mItem.category.toLowerCase().includes(query) ||
          mItem.description.toLowerCase().includes(query) ||
          mItem.location.toLowerCase().includes(query) ||
          mItem.sellerName.toLowerCase().includes(query);

        if (matches) {
          results.push({
            id: mItem.id,
            protocol: 'marketplace',
            title: mItem.title,
            subtitle: mItem.description,
            categoryTag: mItem.category,
            ownerOrMentor: mItem.sellerName,
            metaInfo: `₹${mItem.price} • ${mItem.location} • ${mItem.condition}`,
            accentColor: '#f43f5e',
            originalItem: mItem,
          });
        }
      });
    }

    // 5. Research & Projects
    if (activeCategoryFilter === 'all' || activeCategoryFilter === 'projects') {
      projects.forEach((proj) => {
        const matches =
          !query ||
          proj.name.toLowerCase().includes(query) ||
          proj.tagline.toLowerCase().includes(query) ||
          proj.description.toLowerCase().includes(query) ||
          proj.category.toLowerCase().includes(query) ||
          proj.skillsRequired.some((s) => s.toLowerCase().includes(query)) ||
          proj.creator.toLowerCase().includes(query);

        if (matches) {
          results.push({
            id: proj.id,
            protocol: 'projects',
            title: proj.name,
            subtitle: proj.tagline || proj.description,
            categoryTag: proj.category,
            ownerOrMentor: proj.creator,
            metaInfo: `${proj.membersCount} Members • ${proj.recruiting ? 'Recruiting' : 'In Progress'}`,
            accentColor: '#818cf8',
            originalItem: proj,
          });
        }
      });
    }

    return results;
  }, [searchQuery, activeCategoryFilter, borrowItems, guidanceTopics, skillMatches, marketplaceItems, projects]);

  const handleResultAction = (result: typeof searchResults[0]) => {
    if (result.protocol === 'borrow') {
      handleCardClick('borrow');
    } else if (result.protocol === 'guidance') {
      handleCardClick('guidance');
    } else if (result.protocol === 'skills') {
      handleCardClick('skills');
    } else if (result.protocol === 'marketplace') {
      if (onSelectMarketplaceItem) {
        onSelectMarketplaceItem(result.originalItem);
      } else {
        document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (result.protocol === 'projects') {
      if (onSelectProject) {
        onSelectProject(result.originalItem);
      } else {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTriggerCompass = (query: string) => {
    if (onAskCompassWithQuery) {
      onAskCompassWithQuery(query);
    } else {
      const compassEl = document.getElementById('compass');
      compassEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      id: 'borrow',
      code: '01',
      title: 'BORROW',
      subtitle: "Don't buy what you can borrow.",
      description: 'The things you need are probably closer than you think.',
      icon: BookOpen,
      isCustomIcon: false,
      accentColor: '#fbcfe8',
      accentGlow: 'rgba(251, 207, 232, 0.25)',
      cardBg: 'from-[#1a1b24]/95 via-[#13141c]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_20px_rgba(251,207,232,0.15)]',
      iconColor: 'text-pink-200',
      iconBg: 'bg-pink-300/10 border-pink-300/30',
      badgeText: `${borrowItems.length} Items Active`,
      slantAngle: 'transform-none xl:-rotate-1 xl:hover:rotate-0 xl:-skew-y-1 xl:hover:skew-y-0',
    },
    {
      id: 'guidance',
      code: '02',
      title: 'GUIDANCE',
      subtitle: "Learn from people who've already been there.",
      description: 'Courses, professors, campus processes and knowledge — made easier to navigate.',
      icon: GraduationCap,
      isCustomIcon: false,
      accentColor: '#f472b6',
      accentGlow: 'rgba(244, 114, 182, 0.25)',
      cardBg: 'from-[#1e1a26]/95 via-[#15131e]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]',
      iconColor: 'text-pink-300',
      iconBg: 'bg-pink-400/10 border-pink-400/30',
      badgeText: `${guidanceTopics.length} Blueprint Guides`,
      slantAngle: 'transform-none xl:rotate-1 xl:hover:rotate-0 xl:skew-y-1 xl:hover:skew-y-0',
    },
    {
      id: 'skills',
      code: '03',
      title: 'SKILL EXCHANGE',
      subtitle: 'You know something. Someone needs it.',
      description: "Trade what you know. Learn what you don't.",
      icon: ArrowLeftRight,
      isCustomIcon: false,
      accentColor: '#f9a8d4',
      accentGlow: 'rgba(249, 168, 212, 0.25)',
      cardBg: 'from-[#1d1b24]/95 via-[#14131c]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_20px_rgba(249,168,212,0.15)]',
      iconColor: 'text-pink-200',
      iconBg: 'bg-pink-300/10 border-pink-300/30',
      badgeText: `${skillMatches.length} Active Matches`,
      slantAngle: 'transform-none xl:-rotate-1 xl:hover:rotate-0 xl:-skew-y-1 xl:hover:skew-y-0',
    },
    {
      id: 'marketplace',
      code: '04',
      title: 'MARKETPLACE',
      subtitle: 'Give unused things a second life.',
      description: "What you don't need anymore could be exactly what someone else needs.",
      icon: ShoppingBag,
      isCustomIcon: false,
      accentColor: '#fda4af',
      accentGlow: 'rgba(253, 164, 175, 0.25)',
      cardBg: 'from-[#201922]/95 via-[#15121a]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_20px_rgba(253,164,175,0.15)]',
      iconColor: 'text-rose-200',
      iconBg: 'bg-rose-300/10 border-rose-300/30',
      badgeText: `${marketplaceItems.length} Listings`,
      slantAngle: 'transform-none xl:rotate-1 xl:hover:rotate-0 xl:skew-y-1 xl:hover:skew-y-0',
    },
    {
      id: 'connect',
      code: '05',
      title: 'CONNECT',
      subtitle: 'Find your squad. Build together.',
      description: 'Discover peers, hackathon teammates, clubs, and project collaborators across branches.',
      icon: Users,
      isCustomIcon: false,
      accentColor: '#fce7f3',
      accentGlow: 'rgba(252, 231, 243, 0.25)',
      cardBg: 'from-[#1c1b25]/95 via-[#13131c]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_20px_rgba(252,231,243,0.15)]',
      iconColor: 'text-pink-100',
      iconBg: 'bg-pink-200/10 border-pink-200/30',
      badgeText: `${projects.length} Active Squads`,
      slantAngle: 'transform-none xl:-rotate-1 xl:hover:rotate-0 xl:-skew-y-1 xl:hover:skew-y-0',
    },
    {
      id: 'compass',
      code: '06',
      title: 'COMPASS',
      subtitle: 'Meet COMPASS, your campus AI.',
      description: 'Your real-time guide to projects, mentors, gear, exams, and campus intelligence.',
      icon: null,
      isCustomIcon: true,
      accentColor: '#f472b6',
      accentGlow: 'rgba(244, 114, 182, 0.35)',
      cardBg: 'from-[#221724]/95 via-[#17111c]/95 to-[#0e0f15]',
      borderStyle: 'border-zinc-700/60 group-hover:border-pink-300/60',
      glowShadow: 'group-hover:shadow-[0_0_25px_rgba(244,114,182,0.2)]',
      iconColor: 'text-pink-300',
      iconBg: 'bg-pink-400/15 border-pink-300/40',
      badgeText: 'Neural Co-Pilot',
      slantAngle: 'transform-none xl:rotate-1 xl:hover:rotate-0 xl:skew-y-1 xl:hover:skew-y-0',
    },
  ];

  const isSearchActive = searchQuery.trim().length > 0 || showResultsDrawer;

  return (
    <section id="services" className="py-28 border-b border-zinc-800 relative bg-[#0e0f15] overflow-hidden select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[450px] bg-[#fbcfe8]/[0.03] rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[450px] bg-[#f472b6]/[0.03] rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Cybernetic Dot Matrix Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Center Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-heading">
            One campus. <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow-[0_0_15px_rgba(251,207,232,0.18)]">Infinite possibilities.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal max-w-xl mx-auto">
            Everything you need is already around you. You just need to find it.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH ITEM HUB (HIGHLY FUNCTIONAL DISCOVERY ENGINE) */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mx-auto mb-12 relative z-20">
          <div className="p-3 sm:p-4 rounded-3xl bg-[#151620]/90 border border-zinc-700 hover:border-pink-300/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300">
            
            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center pointer-events-none text-pink-300">
                <Search className="w-5 h-5 drop-shadow-[0_0_4px_rgba(251,207,232,0.4)]" />
              </div>

              <input
                id="services-global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!showResultsDrawer && e.target.value.trim()) {
                    setShowResultsDrawer(true);
                  }
                }}
                onFocus={() => setShowResultsDrawer(true)}
                placeholder="Search items to borrow, skills, mentors, lab gear, notes, listings..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-[#1a1b26]/90 border border-zinc-700/80 focus:border-pink-300 rounded-2xl text-white placeholder-zinc-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300/30 transition-all font-sans"
              />

              {/* Right Action Tools inside Search Input */}
              <div className="absolute right-3 flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowResultsDrawer(false);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setShowResultsDrawer((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer ${
                    showResultsDrawer 
                      ? 'bg-pink-950/50 text-pink-200 border border-pink-300/40 shadow-[0_0_12px_rgba(251,207,232,0.2)]'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {searchResults.length} Match{searchResults.length === 1 ? '' : 'es'}
                  </span>
                </button>
              </div>
            </div>

            {/* Protocol Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs font-mono-tech">
              {[
                { key: 'all', label: 'ALL PROTOCOLS', count: borrowItems.length + guidanceTopics.length + skillMatches.length + marketplaceItems.length + projects.length },
                { key: 'borrow', label: '📦 BORROW GEAR', count: borrowItems.length },
                { key: 'guidance', label: '🎓 MENTORS & NOTES', count: guidanceTopics.length },
                { key: 'skills', label: '⚡ SKILL TRADES', count: skillMatches.length },
                { key: 'marketplace', label: '🛍️ MARKETPLACE', count: marketplaceItems.length },
                { key: 'projects', label: '🚀 SQUADS & LABS', count: projects.length },
              ].map((tab) => {
                const isActive = activeCategoryFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveCategoryFilter(tab.key as any);
                      setShowResultsDrawer(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_12px_rgba(251,207,232,0.3)]'
                        : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700/60'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-zinc-950/20 text-zinc-950 font-extrabold' : 'bg-zinc-700 text-zinc-400'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Keyword Pills for fast searching */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-800 text-xs">
              <span className="text-[11px] font-mono-tech text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-pink-300" />
                <span>Quick Find:</span>
              </span>
              {quickSearchSuggestions.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    setSearchQuery(pill.label);
                    setActiveCategoryFilter('all');
                    setShowResultsDrawer(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-pink-950/30 hover:border-pink-300/40 border border-zinc-700 text-zinc-300 hover:text-pink-200 transition-colors text-[11px] font-mono-tech cursor-pointer"
                >
                  +{pill.label}
                </button>
              ))}
            </div>

          </div>

          {/* ===================================================================== */}
          {/* EXPANDABLE INTERACTIVE SEARCH RESULTS DRAWER */}
          {/* ===================================================================== */}
          {showResultsDrawer && (
            <div className="mt-3 p-4 sm:p-5 rounded-3xl bg-[#151620]/95 border border-zinc-700 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-300 animate-pulse" />
                  <span className="text-xs font-mono-tech text-white font-bold tracking-wider">
                    {searchResults.length} ITEM{searchResults.length === 1 ? '' : 'S'} FOUND ACROSS CAMPUS
                  </span>
                  {searchQuery && (
                    <span className="text-xs font-mono-tech text-pink-300">
                      matching "{searchQuery}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTriggerCompass(searchQuery || 'Find items to borrow and senior mentors')}
                    className="text-xs font-mono-tech text-pink-300 hover:text-pink-200 flex items-center gap-1 cursor-pointer"
                  >
                    <CompassStarIcon size={14} glow={false} />
                    <span>Ask COMPASS AI</span>
                  </button>

                  <button
                    onClick={() => setShowResultsDrawer(false)}
                    className="text-xs font-mono-tech text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded bg-zinc-800"
                  >
                    Collapse View
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {searchResults.map((res) => (
                    <div
                      key={`${res.protocol}-${res.id}`}
                      onClick={() => handleResultAction(res)}
                      className="p-3.5 rounded-2xl bg-[#1a1b26]/90 hover:bg-[#222432] border border-zinc-800 hover:border-pink-300/40 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Protocol & Category Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold tracking-wider border border-pink-300/30 text-pink-200 bg-pink-950/30"
                          >
                            {res.protocol.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono-tech text-zinc-400 truncate max-w-[120px]">
                            {res.categoryTag}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-200 transition-colors line-clamp-1 font-heading">
                          {res.title}
                        </h4>

                        {/* Subtitle / Description */}
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-normal leading-relaxed">
                          {res.subtitle}
                        </p>
                      </div>

                      {/* Bottom Info & Action */}
                      <div className="pt-2.5 mt-2.5 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono-tech">
                        <span className="text-zinc-400 truncate max-w-[150px]">
                          {res.metaInfo}
                        </span>
                        <div className="flex items-center gap-1 text-pink-300 group-hover:translate-x-0.5 transition-transform font-bold">
                          <span>OPEN</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-950/40 border border-pink-300/30 flex items-center justify-center mx-auto text-pink-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-white font-heading">
                    No direct catalog items found for "{searchQuery}"
                  </div>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Would you like to ask the COMPASS campus neural network or create a peer broadcast request?
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleTriggerCompass(`I am looking for ${searchQuery}. Who can help me?`)}
                      className="px-4 py-2 rounded-xl bg-pink-950/60 hover:bg-pink-900 border border-pink-300/40 text-pink-200 text-xs font-bold font-mono-tech flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,207,232,0.2)]"
                    >
                      <CompassStarIcon size={16} glow={false} />
                      <span>Ask COMPASS to find "{searchQuery}"</span>
                    </button>
                    <button
                      onClick={() => handleCardClick('borrow')}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold font-mono-tech border border-zinc-700 cursor-pointer"
                    >
                      Post a Wanted Item Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* 6 Glowing Dynamic Service Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 perspective-1000">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                id={`service-card-${s.id}`}
                onClick={() => handleCardClick(s.id)}
                className={`group relative p-6 sm:p-5 rounded-3xl bg-gradient-to-b ${s.cardBg} border ${s.borderStyle} ${s.glowShadow} ${s.slantAngle} transition-all duration-500 hover:-translate-y-4 hover:scale-[1.04] cursor-pointer flex flex-col justify-between min-h-[340px] text-center overflow-hidden shadow-2xl backdrop-blur-xl`}
              >
                {/* Radiant Ambient Colored Core Glow */}
                <div 
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full blur-3xl opacity-30 group-hover:opacity-75 transition-all duration-500 pointer-events-none"
                  style={{ backgroundColor: s.accentGlow }}
                />

                {/* Laser Circuit Line Across Card */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${s.accentColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Top Glowing 3D Icon Pod with Radiant Halos */}
                <div className="pt-2 flex flex-col items-center relative z-10">
                  <div className="relative mb-4">
                    {/* Pulsing Backlight Ring */}
                    <div 
                      className="absolute inset-0 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: s.accentGlow }}
                    />

                    {/* Icon Capsule */}
                    <div className={`w-16 h-16 sm:w-15 sm:h-15 rounded-2xl ${s.iconBg} border flex items-center justify-center transition-all duration-500 group-hover:scale-115 group-hover:rotate-3 shadow-xl relative z-10 backdrop-blur-md`}>
                      {s.isCustomIcon ? (
                        <CompassStarIcon size={38} />
                      ) : Icon ? (
                        <Icon 
                          className={`w-7 h-7 ${s.iconColor} transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_12px_${s.accentColor}]`} 
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Card Main Title */}
                  <h3 className="text-base sm:text-[15px] font-bold text-white tracking-wider font-heading uppercase group-hover:text-pink-200 transition-colors drop-shadow-md mb-2">
                    {s.title}
                  </h3>
                </div>

                {/* Card Description */}
                <div className="pb-3 relative z-10">
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-normal transition-colors">
                    {s.description}
                  </p>
                </div>

                {/* Bottom Launch Bar with Glowing Accent Edge */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono-tech relative z-10">
                  <span className="text-white/40 group-hover:text-white transition-colors uppercase tracking-wider text-[10px]">
                    EXPLORE
                  </span>
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shadow-sm"
                    style={{ backgroundColor: `${s.accentColor}25` }}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" style={{ color: s.accentColor }} />
                  </div>
                </div>

                {/* Shimmering Neon Top & Bottom Edge Accents */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity" 
                  style={{ background: `linear-gradient(90deg, transparent, ${s.accentColor}, transparent)` }} 
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" 
                  style={{ background: `linear-gradient(90deg, transparent, ${s.accentColor}, transparent)` }} 
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
