import React from 'react';
import { 
  FolderLock, 
  HandCoins, 
  ShoppingBag, 
  Layers3, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  ArrowUpRight,
  User,
  Clock,
  MapPin
} from 'lucide-react';
import { UserProfile, BorrowItem, MarketplaceItem, ProjectItem } from '../../types';

interface MyLockerViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  borrowItems: BorrowItem[];
  marketplaceItems: MarketplaceItem[];
  projects: ProjectItem[];
  onNavigateTab: (tab: string) => void;
}

export const MyLockerView: React.FC<MyLockerViewProps> = ({
  currentUser,
  users,
  onSwitchUser,
  borrowItems,
  marketplaceItems,
  projects,
  onNavigateTab,
}) => {
  // Find items relevant to current user
  const myListings = marketplaceItems.filter(i => i.sellerName.toLowerCase().includes(currentUser.name.toLowerCase()));
  const myProjects = projects.filter(p => p.creator.toLowerCase().includes(currentUser.name.toLowerCase()) || p.hasApplied);

  return (
    <div id="my-locker-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <FolderLock className="w-4 h-4 text-[#00f2ff]" />
            <span>PERSONAL CAMPUS LOCKER & WORKSPACE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            {currentUser.name.toUpperCase()} // WORKSPACE
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Track your active hardware checkouts, listed textbooks, research applications, and campus impact milestones.
          </p>
        </div>

        {/* Persona quick switch */}
        <div className="flex items-center gap-2 bg-[#050505] p-2 border border-white/10 rounded-sm">
          <span className="text-[10px] font-mono-tech text-white/40 uppercase">SWITCH PERSONA:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const found = users.find(u => u.id === e.target.value);
              if (found) onSwitchUser(found);
            }}
            className="bg-[#121212] text-xs font-mono-tech text-white border border-white/10 px-2 py-1 rounded-sm focus:outline-none focus:border-[#00f2ff]"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Identity & Reputation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm">
          <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-[1px]">
            CAMPUS RANK
          </div>
          <div className="text-3xl font-black text-[#00f2ff] font-heading mt-1">
            #{String(currentUser.rank).padStart(2, '0')}
          </div>
          <div className="text-xs font-mono-tech text-white/60 mt-1">
            Top 1% in {currentUser.department}
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm">
          <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-[1px]">
            KARMA BALANCE
          </div>
          <div className="text-3xl font-black text-[#bc13fe] font-heading mt-1">
            {currentUser.impactScore} <span className="text-sm font-normal text-white/50">PTS</span>
          </div>
          <div className="text-xs font-mono-tech text-white/60 mt-1">
            Verifiable on-campus ledger
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm">
          <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-[1px]">
            ACTIVE BORROWINGS
          </div>
          <div className="text-3xl font-black text-white font-heading mt-1">
            01 <span className="text-sm font-normal text-white/50">ACTIVE</span>
          </div>
          <div className="text-xs font-mono-tech text-[#00f2ff] mt-1">
            Due in 2 days (FPGA Kit)
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm">
          <div className="text-[10px] font-mono-tech text-white/50 uppercase tracking-[1px]">
            BADGES EARNED
          </div>
          <div className="text-3xl font-black text-white font-heading mt-1">
            {(currentUser.badges || []).length}
          </div>
          <div className="text-xs font-mono-tech text-white/60 mt-1">
            {currentUser.badges && currentUser.badges.length > 0 ? currentUser.badges.join(', ') : 'Peer Contributor, Verified Student'}
          </div>
        </div>
      </div>

      {/* Grid: Borrow Checkouts + Listings + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Borrowed Items */}
        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[2px]">
              <HandCoins className="w-4 h-4" />
              <span>ACTIVE HARDWARE CHECKOUTS</span>
            </div>
            <button
              onClick={() => onNavigateTab('borrow')}
              className="text-xs font-mono-tech text-white/50 hover:text-[#00f2ff] transition-colors"
            >
              Browse Inventory ›
            </button>
          </div>

          <div className="p-4 rounded-sm bg-[#050505] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-heading">
                Xilinx Spartan-7 FPGA Dev Board
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[9px] font-mono-tech text-[#00f2ff]">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-tech text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00f2ff]" />
                Return Due: Friday 5:00 PM
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/40" />
                VLSI Lab 1
              </span>
            </div>
          </div>
        </div>

        {/* My Marketplace Listings */}
        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[2px]">
              <ShoppingBag className="w-4 h-4" />
              <span>MY MARKETPLACE LISTINGS</span>
            </div>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="text-xs font-mono-tech text-white/50 hover:text-[#00f2ff] transition-colors"
            >
              Go to Market ›
            </button>
          </div>

          {myListings.length > 0 ? (
            myListings.map(item => (
              <div key={item.id} className="p-4 rounded-sm bg-[#050505] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white font-heading">{item.title}</div>
                  <div className="text-xs font-mono-tech text-white/40">₹{item.price} • {item.category} • {item.condition}</div>
                </div>
                <span className="px-2 py-0.5 bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] font-mono-tech uppercase">
                  ACTIVE
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-sm bg-[#050505] border border-white/5 text-xs font-mono-tech text-white/40 text-center">
              You haven't listed any textbooks or gear yet.
            </div>
          )}
        </div>

        {/* My Projects & Applications */}
        <div className="p-5 bg-[#121212] border border-white/[0.08] rounded-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#bc13fe] font-bold uppercase tracking-[2px]">
              <Layers3 className="w-4 h-4" />
              <span>MY RESEARCH & PROJECT ENGAGEMENTS</span>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-mono-tech text-white/50 hover:text-[#bc13fe] transition-colors"
            >
              Explore Projects ›
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.map(proj => (
              <div key={proj.id} className="p-4 rounded-sm bg-[#050505] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white font-heading">{proj.name}</div>
                  <span className="text-[10px] font-mono-tech text-[#bc13fe] uppercase">
                    {proj.creator.includes(currentUser.name) ? 'CREATOR' : 'APPLIED'}
                  </span>
                </div>
                <p className="text-xs text-white/60 line-clamp-2">{proj.tagline}</p>
                <div className="text-[10px] font-mono-tech text-white/40 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>Category: {proj.category}</span>
                  <span className="text-[#00f2ff]">{proj.progressPercent}% Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
