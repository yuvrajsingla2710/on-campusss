import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  HandCoins, 
  ShoppingBag, 
  Layers3, 
  BookOpen, 
  Repeat, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MarketplaceItem, ProjectItem, BorrowItem, GuidanceTopic } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  marketplaceItems: MarketplaceItem[];
  projects: ProjectItem[];
  borrowItems: BorrowItem[];
  guidanceTopics: GuidanceTopic[];
  onSelectItem: (item: MarketplaceItem) => void;
  onSelectProject: (proj: ProjectItem) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  marketplaceItems,
  projects,
  borrowItems,
  guidanceTopics,
  onSelectItem,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle logic handled by parent or shortcut
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedMarketplace = q
    ? marketplaceItems.filter(
        (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedProjects = q
    ? projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedBorrow = q
    ? borrowItems.filter(
        (b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedGuides = q
    ? guidanceTopics.filter(
        (g) => g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  return (
    <div 
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        id="command-palette-card"
        className="relative w-full max-w-2xl bg-[#121212] border border-[#00f2ff]/40 rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#050505]">
          <Search className="w-5 h-5 text-[#00f2ff] shrink-0" />
          <input
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search items, projects, guides, or equipment..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono-tech"
          />
          <button
            id="close-command-palette-btn"
            onClick={onClose}
            className="p-1 rounded-sm text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Navigation Commands */}
          {!q && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono-tech text-white/40 tracking-[2px] uppercase mb-2">
                APP WORKSPACES & MODULES
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigateTab('pulse'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00f2ff]" />
                  <span>⚡ Campus Pulse Feed</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('borrow'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <HandCoins className="w-4 h-4 text-[#00f2ff]" />
                  <span>📦 Borrow & Lab Gear</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('marketplace'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#00f2ff]" />
                  <span>🛒 Peer Marketplace</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('projects'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#bc13fe] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <Layers3 className="w-4 h-4 text-[#bc13fe]" />
                  <span>🔬 Research & Projects</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('mentorship'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#bc13fe] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <Repeat className="w-4 h-4 text-[#bc13fe]" />
                  <span>🤝 Skill Exchange & Guides</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('compass'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-left text-xs font-mono-tech text-white transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#00f2ff]" />
                  <span>🧭 COMPASS AI Assistant</span>
                </button>
              </div>
            </div>
          )}

          {/* Matches: Marketplace */}
          {matchedMarketplace.length > 0 && (
            <div>
              <div className="text-[10px] font-mono-tech text-[#00f2ff] tracking-[2px] uppercase mb-2">
                MARKETPLACE ITEMS
              </div>
              <div className="space-y-1.5">
                {matchedMarketplace.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { onSelectItem(item); onClose(); }}
                    className="p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{item.title}</div>
                      <div className="text-[10px] font-mono-tech text-white/40">₹{item.price} • {item.sellerName} • {item.location}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#00f2ff]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches: Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-mono-tech text-[#bc13fe] tracking-[2px] uppercase mb-2">
                PROJECTS & BUILDS
              </div>
              <div className="space-y-1.5">
                {matchedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { onSelectProject(p); onClose(); }}
                    className="p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#bc13fe] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{p.name}</div>
                      <div className="text-[10px] font-mono-tech text-white/40">{p.category} • {p.creator} • {p.membersCount} members</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#bc13fe]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches: Borrow Items */}
          {matchedBorrow.length > 0 && (
            <div>
              <div className="text-[10px] font-mono-tech text-[#00f2ff] tracking-[2px] uppercase mb-2">
                LAB & BORROW INVENTORY
              </div>
              <div className="space-y-1.5">
                {matchedBorrow.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => { onNavigateTab('borrow'); onClose(); }}
                    className="p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{b.title}</div>
                      <div className="text-[10px] font-mono-tech text-white/40">{b.category} • Max {b.maxDays}d • {b.location}</div>
                    </div>
                    <span className="text-[10px] font-mono-tech text-[#00f2ff] uppercase font-bold">BORROW</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches: Guides */}
          {matchedGuides.length > 0 && (
            <div>
              <div className="text-[10px] font-mono-tech text-[#bc13fe] tracking-[2px] uppercase mb-2">
                SENIOR GUIDES & ARCHIVES
              </div>
              <div className="space-y-1.5">
                {matchedGuides.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { onNavigateTab('mentorship'); onClose(); }}
                    className="p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#bc13fe] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{g.title}</div>
                      <div className="text-[10px] font-mono-tech text-white/40">{g.category} • {g.mentorName}</div>
                    </div>
                    <BookOpen className="w-4 h-4 text-[#bc13fe]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && !matchedMarketplace.length && !matchedProjects.length && !matchedBorrow.length && !matchedGuides.length && (
            <div className="py-8 text-center text-xs font-mono-tech text-white/40">
              No campus records matching "{query}". Try searching by department or keyword.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#050505] flex items-center justify-between text-[10px] font-mono-tech text-white/40">
          <span>NAVIGATION SHORTCUTS</span>
          <span className="flex items-center gap-2">
            <span>[ESC] TO CLOSE</span>
            <span>•</span>
            <span>[ENTER] TO SELECT</span>
          </span>
        </div>
      </div>
    </div>
  );
};
