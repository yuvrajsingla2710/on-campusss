import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  X, 
  Search, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Heart, 
  Download, 
  QrCode, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Share2,
  Users,
  Compass,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { ShareData } from './ShareModal';

interface FullLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile;
  onSelectUserForPassport: (user: UserProfile) => void;
  onGiveKudos: (userId: string) => void;
  onOpenShare?: (data: ShareData) => void;
}

export const FullLeaderboardModal: React.FC<FullLeaderboardModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUserForPassport,
  onGiveKudos,
  onOpenShare,
}) => {
  const [timeframe, setTimeframe] = useState<'season' | 'weekly' | 'all-time'>('season');
  const [activePillar, setActivePillar] = useState<'all' | 'knowledge' | 'skills' | 'resources' | 'projects'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCertificateForUser, setShowCertificateForUser] = useState<UserProfile | null>(null);
  const [kudosGiven, setKudosGiven] = useState<{ [key: string]: boolean }>({});
  const [copiedLeaderboard, setCopiedLeaderboard] = useState(false);

  const handleShareLeaderboard = () => {
    const leaderUrl = `${window.location.origin}/leaderboard`;
    const sharePayload: ShareData = {
      title: `Campus Proof-of-Karma Standings — ${currentUser.name} is Rank #${currentUser.rank}!`,
      text: `Check out the verified campus impact standings on Campus OS. Total 50+ students audited by zero-knowledge peer validations.`,
      url: leaderUrl,
      category: 'CAMPUS LEADERBOARD',
    };

    if (onOpenShare) {
      onOpenShare(sharePayload);
    } else if (navigator.share) {
      navigator.share({
        title: sharePayload.title,
        text: sharePayload.text,
        url: sharePayload.url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(leaderUrl);
      setCopiedLeaderboard(true);
      setTimeout(() => setCopiedLeaderboard(false), 2000);
    }
  };

  // Filter and Sort Users
  const filteredUsers = useMemo(() => {
    const result = users
      .filter((user) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = (user.name || '').toLowerCase().includes(q);
          const matchesDept = (user.department || '').toLowerCase().includes(q);
          const matchesBio = (user.bio || '').toLowerCase().includes(q);
          const matchesSkills = (user.skillsOffered || []).some((s) => (s || '').toLowerCase().includes(q));
          if (!matchesName && !matchesDept && !matchesBio && !matchesSkills) return false;
        }

        // Department filter
        if (selectedDepartment !== 'all') {
          if (!user.department.toLowerCase().includes(selectedDepartment.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (activePillar === 'knowledge') return b.knowledgeScore - a.knowledgeScore;
        if (activePillar === 'skills') return b.skillScore - a.skillScore;
        if (activePillar === 'resources') return b.resourceScore - a.resourceScore;
        if (activePillar === 'projects') return b.projectScore - a.projectScore;
        return b.impactScore - a.impactScore;
      });

    console.log(`[FullLeaderboardModal] Evaluated filter -> Displaying ${result.length} of ${users.length} students (Timeframe: ${timeframe}, Pillar: ${activePillar}, Dept: ${selectedDepartment}, Query: "${searchQuery}")`);
    return result;
  }, [users, searchQuery, selectedDepartment, activePillar, timeframe]);

  if (!isOpen) return null;

  console.log(`[FullLeaderboardModal] Rendered modal with isOpen=true. Total students: ${users.length}, Filtered displayed: ${filteredUsers.length}`);

  const handleKudos = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (kudosGiven[userId]) return;
    setKudosGiven((prev) => ({ ...prev, [userId]: true }));
    onGiveKudos(userId);
  };

  const top3 = filteredUsers.slice(0, 3);
  const departments = ['all', 'Computer Science', 'Robotics', 'Electrical', 'Design', 'Physics', 'BioTech', 'Civil', 'Chemical', 'Mathematics', 'Aerospace'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#0a0a0e] border border-white/15 rounded-3xl shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-gradient-to-b from-[#00f2ff]/8 via-[#c084fc]/5 to-transparent blur-xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-7 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 bg-[#0d0d12]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-tech tracking-[3px] text-[#00f2ff] font-bold uppercase">
              <Trophy className="w-4 h-4 text-[#00f2ff]" />
              <span>C A M P U S &nbsp; P R O O F - O F - K A R M A &nbsp; L E A D E R B O A R D</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1 flex items-center gap-3">
              <span>Campus Impact Standings</span>
              <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 font-normal">
                Live Semester 2026
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl font-normal">
              Audited by zero-knowledge peer validations. Earn verified karma by sharing laboratory equipment, teaching skills, and mentoring juniors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
            <button
              onClick={handleShareLeaderboard}
              className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-[#00f2ff]/20 text-white hover:text-[#00f2ff] border border-white/10 hover:border-[#00f2ff]/40 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
              title="Share Standings to WhatsApp, Telegram, X, LinkedIn, etc."
            >
              {copiedLeaderboard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLeaderboard ? 'Copied' : 'Share Standings'}</span>
            </button>

            <button
              onClick={() => {
                const myRow = document.getElementById(`user-row-${currentUser.id}`);
                if (myRow) {
                  myRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  myRow.classList.add('ring-2', 'ring-[#00f2ff]');
                  setTimeout(() => myRow.classList.remove('ring-2', 'ring-[#00f2ff]'), 2000);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#12131a] hover:bg-[#1a1c26] border border-white/10 text-xs font-mono-tech text-white flex items-center gap-2 transition-all cursor-pointer hover:border-[#00f2ff]/50"
            >
              <Zap className="w-3.5 h-3.5 text-[#00f2ff]" />
              <span>Spotlight My Rank (#{currentUser.rank})</span>
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & SEARCH TOOLBAR */}
        {/* ========================================================================= */}
        <div className="p-4 sm:px-7 bg-[#0b0c10] border-b border-white/[0.06] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Timeframe Toggle */}
          <div className="flex items-center gap-1 bg-[#12131a] p-1 rounded-xl border border-white/10 self-start">
            {[
              { id: 'season', label: 'Semester 2026' },
              { id: 'weekly', label: 'Weekly Sprint' },
              { id: 'all-time', label: 'Hall of Fame' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-[#00f2ff] text-black font-bold shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Pillar Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Karma', icon: Trophy, color: 'text-yellow-400' },
              { id: 'knowledge', label: 'Knowledge', icon: BookOpen, color: 'text-[#00f2ff]' },
              { id: 'skills', label: 'Skills', icon: Zap, color: 'text-[#c084fc]' },
              { id: 'resources', label: 'Resources', icon: Layers, color: 'text-emerald-400' },
              { id: 'projects', label: 'Projects', icon: TrendingUp, color: 'text-rose-400' },
            ].map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activePillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-white/10 text-white border-white/30 shadow-sm'
                      : 'bg-[#12131a]/60 text-white/60 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${pillar.color}`} />
                  <span>{pillar.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student, skill, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#12131a] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00f2ff] transition-all font-mono-tech"
            />
          </div>
        </div>

        {/* Department Filter Sub-Bar & Active Count Badge */}
        <div className="px-4 sm:px-7 py-2.5 bg-[#090a0e] border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
            <span className="text-[10px] font-mono-tech text-white/40 uppercase mr-1">Department:</span>
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-tech transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                      : 'bg-white/[0.03] text-white/50 border border-white/[0.05] hover:text-white hover:border-white/20'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-mono-tech text-[11px] text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Showing <strong className="text-white">{filteredUsers.length}</strong> of <strong className="text-[#00f2ff]">{users.length}</strong> verified students
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SCROLLABLE CONTENT */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-8 custom-scrollbar">
          
          {/* TOP 3 PODIUM (Visible when looking at default rankings) */}
          {top3.length >= 3 && !searchQuery && selectedDepartment === 'all' && (
            <div>
              <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-[2px] mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>TOP CAMPUS LEADERS // PODIUM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Silver - Rank 2 */}
                <div 
                  onClick={() => onSelectUserForPassport(top3[1])}
                  className="order-2 md:order-1 bg-gradient-to-b from-[#161824] to-[#0c0d12] border border-white/20 hover:border-white/40 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/30 text-white font-mono-tech font-bold text-sm flex items-center justify-center shadow-md">
                      #2
                    </span>
                    <span className="text-xl">🥈</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={top3[1].avatar} 
                      alt={top3[1].name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-[#00f2ff] transition-colors flex items-center gap-1.5">
                        <span>{top3[1].name}</span>
                        <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
                      </h4>
                      <p className="text-[11px] text-white/60 font-mono-tech truncate max-w-[160px]">
                        {top3[1].department}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#08080c] border border-white/5 flex items-center justify-between mb-4">
                    <span className="text-xs text-white/60 font-mono-tech">Reputation Karma</span>
                    <span className="text-lg font-black text-white font-mono-tech">
                      {top3[1].impactScore} <span className="text-[10px] text-[#00f2ff]">PTS</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={(e) => handleKudos(top3[1].id, e)}
                      className={`text-xs font-mono-tech px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                        kudosGiven[top3[1].id]
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'bg-white/5 hover:bg-pink-500/20 text-white/70 hover:text-pink-300 border border-white/10'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>{kudosGiven[top3[1].id] ? 'Kudos Sent!' : 'Give Kudos (+5)'}</span>
                    </button>
                    <span className="text-xs text-[#00f2ff] font-mono-tech flex items-center gap-1">
                      <span>Passport</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Gold - Rank 1 (Center Highlight) */}
                <div 
                  onClick={() => onSelectUserForPassport(top3[0])}
                  className="order-1 md:order-2 bg-gradient-to-b from-[#241f14] via-[#1a1710] to-[#0c0c10] border-2 border-yellow-500/50 hover:border-yellow-400 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.03] cursor-pointer group shadow-[0_0_20px_rgba(234,179,8,0.12)] md:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-mono-tech font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <Trophy className="w-3.5 h-3.5" />
                      #1 CAMPUS LEADER
                    </span>
                    <span className="text-2xl animate-bounce">🥇</span>
                  </div>
                  
                  <div className="flex items-center gap-3.5 mb-3">
                    <img 
                      src={top3[0].avatar} 
                      alt={top3[0].name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400 shadow-lg"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-lg group-hover:text-yellow-300 transition-colors flex items-center gap-1.5">
                        <span>{top3[0].name}</span>
                        <ShieldCheck className="w-4 h-4 text-yellow-400" />
                      </h4>
                      <p className="text-xs text-yellow-200/70 font-mono-tech">
                        {top3[0].title}
                      </p>
                      <p className="text-[11px] text-white/50 font-mono-tech truncate max-w-[180px]">
                        {top3[0].department}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#08080c] border border-yellow-500/30 flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] text-yellow-400/80 font-mono-tech uppercase">Proof of Karma</div>
                      <div className="text-xs text-white/50 font-mono-tech">54 Guides • 28 Loans</div>
                    </div>
                    <span className="text-2xl font-black text-yellow-300 font-mono-tech">
                      {top3[0].impactScore} <span className="text-xs text-yellow-400">PTS</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={(e) => handleKudos(top3[0].id, e)}
                      className={`text-xs font-mono-tech px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                        kudosGiven[top3[0].id]
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>{kudosGiven[top3[0].id] ? 'Kudos Sent!' : 'Give Kudos (+5)'}</span>
                    </button>
                    <span className="text-xs text-yellow-400 font-mono-tech flex items-center gap-1 font-bold">
                      <span>View Passport</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Bronze - Rank 3 */}
                <div 
                  onClick={() => onSelectUserForPassport(top3[2])}
                  className="order-3 bg-gradient-to-b from-[#1f1610] to-[#0c0d12] border border-amber-600/30 hover:border-amber-500/50 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-600/40 text-amber-300 font-mono-tech font-bold text-sm flex items-center justify-center shadow-md">
                      #3
                    </span>
                    <span className="text-xl">🥉</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={top3[2].avatar} 
                      alt={top3[2].name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-600/40 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <span>{top3[2].name}</span>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                      </h4>
                      <p className="text-[11px] text-white/60 font-mono-tech truncate max-w-[160px]">
                        {top3[2].department}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#08080c] border border-white/5 flex items-center justify-between mb-4">
                    <span className="text-xs text-white/60 font-mono-tech">Reputation Karma</span>
                    <span className="text-lg font-black text-amber-300 font-mono-tech">
                      {top3[2].impactScore} <span className="text-[10px] text-amber-400">PTS</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={(e) => handleKudos(top3[2].id, e)}
                      className={`text-xs font-mono-tech px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                        kudosGiven[top3[2].id]
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'bg-white/5 hover:bg-pink-500/20 text-white/70 hover:text-pink-300 border border-white/10'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>{kudosGiven[top3[2].id] ? 'Kudos Sent!' : 'Give Kudos (+5)'}</span>
                    </button>
                    <span className="text-xs text-amber-400 font-mono-tech flex items-center gap-1">
                      <span>Passport</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* COMPLETE CAMPUS DIRECTORY & RANKINGS TABLE */}
          {/* ===================================================================== */}
          <div className="bg-[#0e0f15] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Table Column Bar */}
            <div className="p-4 sm:px-6 bg-[#13141c] border-b border-white/[0.06] grid grid-cols-12 gap-3 text-[10px] font-mono-tech text-white/50 uppercase tracking-wider items-center">
              <div className="col-span-2 sm:col-span-1 text-center">RANK</div>
              <div className="col-span-6 sm:col-span-5">STUDENT & DEPARTMENT</div>
              <div className="hidden sm:block sm:col-span-3">IMPACT PILLARS (K/S/R/P)</div>
              <div className="col-span-4 sm:col-span-3 text-right">KARMA & ACTION</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user, idx) => {
                const rank = idx + 1;
                const isCurrentUser = user.id === currentUser.id;

                return (
                  <div
                    key={user.id}
                    id={`user-row-${user.id}`}
                    onClick={() => onSelectUserForPassport(user)}
                    className={`p-4 sm:px-6 grid grid-cols-12 gap-3 items-center transition-all cursor-pointer hover:bg-white/[0.03] ${
                      isCurrentUser ? 'bg-[#00f2ff]/5 border-l-4 border-l-[#00f2ff]' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                      <span className={`w-8 h-8 rounded-xl font-mono-tech font-bold text-xs flex items-center justify-center ${
                        rank === 1
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm'
                          : rank === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                          : rank === 3
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30'
                          : 'bg-[#181a24] text-white/70 border border-white/5'
                      }`}>
                        #{rank}
                      </span>
                      {user.monthlyGrowthPercent && (
                        <span className="text-[9px] font-mono-tech text-emerald-400 mt-1">
                          +{user.monthlyGrowthPercent}%
                        </span>
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-sm flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm sm:text-base truncate hover:text-[#00f2ff]">
                            {user.name}
                          </span>
                          {user.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00f2ff] flex-shrink-0" />
                          )}
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono-tech bg-[#00f2ff]/20 text-[#00f2ff] px-1.5 py-0.2 rounded font-bold uppercase">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-white/50 font-mono-tech truncate">
                          {user.title} • {user.department}
                        </div>

                        {/* Badges preview */}
                        {user.badges && user.badges.length > 0 && (
                          <div className="hidden sm:flex items-center gap-1.5 mt-1">
                            {user.badges.slice(0, 2).map((b) => (
                              <span
                                key={b}
                                className="text-[9px] font-mono-tech text-white/60 bg-white/5 border border-white/10 px-1.5 py-0.2 rounded"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4 Pillars Breakdown Bars */}
                    <div className="hidden sm:block sm:col-span-3">
                      <div className="grid grid-cols-4 gap-1.5 font-mono-tech text-[10px] text-center">
                        <div className="bg-[#12131c] p-1 rounded border border-white/5" title="Knowledge Score">
                          <div className="text-[#00f2ff] text-[8px]">KNW</div>
                          <div className="text-white font-bold">{user.knowledgeScore}</div>
                        </div>
                        <div className="bg-[#12131c] p-1 rounded border border-white/5" title="Skill Score">
                          <div className="text-[#c084fc] text-[8px]">SKL</div>
                          <div className="text-white font-bold">{user.skillScore}</div>
                        </div>
                        <div className="bg-[#12131c] p-1 rounded border border-white/5" title="Resource Score">
                          <div className="text-emerald-400 text-[8px]">RES</div>
                          <div className="text-white font-bold">{user.resourceScore}</div>
                        </div>
                        <div className="bg-[#12131c] p-1 rounded border border-white/5" title="Project Score">
                          <div className="text-rose-400 text-[8px]">PRJ</div>
                          <div className="text-white font-bold">{user.projectScore}</div>
                        </div>
                      </div>
                    </div>

                    {/* Karma Score & Quick Kudos Action */}
                    <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-3">
                      <div className="text-right font-mono-tech">
                        <div className="text-base sm:text-lg font-black text-white font-heading">
                          {user.impactScore} <span className="text-[10px] text-[#00f2ff]">PTS</span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          {user.hostelWing || 'Campus Node'}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleKudos(user.id, e)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          kudosGiven[user.id]
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.4)]'
                            : 'bg-white/5 border-white/10 hover:border-pink-500/40 text-white/60 hover:text-pink-300'
                        }`}
                        title="Give Kudos (+5 Karma)"
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCertificateForUser(user);
                        }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f2ff]/40 text-white/60 hover:text-[#00f2ff] transition-all cursor-pointer hidden sm:block"
                        title="View Verified Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* HOSTEL WING & DEPARTMENT BATTLEBOARD */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Hostel Wings Battle */}
            <div className="bg-[#0e0f15] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00f2ff]" />
                  <span>Hostel Wing Impact Battle</span>
                </div>
                <span className="text-[10px] font-mono-tech text-[#00f2ff]">LIVE SCORES</span>
              </div>

              <div className="space-y-3 font-mono-tech text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">North Block (H4)</span>
                    <span className="text-[#00f2ff] font-bold">5,562 Karma</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00f2ff] to-[#38bdf8] rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">Tech Tower (H7)</span>
                    <span className="text-[#c084fc] font-bold">4,489 Karma</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c084fc] to-[#a855f7] rounded-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">Research Enclave (PG)</span>
                    <span className="text-emerald-400 font-bold">3,790 Karma</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[60%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">East Wing (H2)</span>
                    <span className="text-amber-400 font-bold">2,670 Karma</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[45%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Zero-Knowledge Protocol Guarantee */}
            <div className="bg-[#0e0f15] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic Reputation Protocol</span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    AUDITED
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  All loans, study sprint hours, and notes downloads generate an immutable campus receipt. Points cannot be inflated or purchased. Zero personal identity leaks.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-tech text-white/50">
                <span>CONTRACT: 0x9f8b...22ea</span>
                <span className="text-[#00f2ff]">BLOCK #4,921,080</span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================================= */}
        <div className="p-4 sm:px-7 bg-[#0d0d12] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-tech text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Real-time Campus Ledger Sync</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VERIFIED DIGITAL CERTIFICATE POPUP */}
      {/* ========================================================================= */}
      {showCertificateForUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-lg bg-[#0c0d14] border-2 border-[#00f2ff]/40 rounded-3xl p-7 shadow-[0_0_25px_rgba(0,242,255,0.12)] text-center space-y-5">
            <button
              onClick={() => setShowCertificateForUser(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 flex items-center justify-center mx-auto text-[#00f2ff]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase">
                OFFICIAL CAMPUS PROOF-OF-IMPACT
              </div>
              <h3 className="text-2xl font-black text-white font-heading mt-1">
                {showCertificateForUser.name}
              </h3>
              <p className="text-xs text-white/60 font-mono-tech mt-0.5">
                Rank #{showCertificateForUser.rank} • {showCertificateForUser.department}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10 space-y-2 text-left text-xs font-mono-tech">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Verified Karma Score:</span>
                <span className="text-white font-bold text-sm">{showCertificateForUser.impactScore} PTS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Accolade Title:</span>
                <span className="text-[#00f2ff] font-bold">{showCertificateForUser.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">On-Time Return Rate:</span>
                <span className="text-emerald-400 font-bold">100% (Zero Defaults)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Cryptographic Hash:</span>
                <span className="text-white/40 truncate max-w-[160px]">{showCertificateForUser.verifiedHash || '0x4f82a...99c1'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Certificate for ${showCertificateForUser.name} verified and ready to export!`);
                  setShowCertificateForUser(null);
                }}
                className="flex-1 py-3 rounded-xl bg-[#00f2ff] text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00f2ff]/90 transition-all cursor-pointer font-mono-tech"
              >
                <Download className="w-4 h-4" />
                <span>Download Proof Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
