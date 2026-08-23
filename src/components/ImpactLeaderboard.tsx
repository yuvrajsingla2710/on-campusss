import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  BookOpen, 
  Repeat, 
  Boxes, 
  Layers3, 
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Globe,
  Lock,
  BarChart3,
  Split,
  Server,
  Activity,
  Award,
  CheckCircle2,
  Zap,
  Plus
} from 'lucide-react';

interface ImpactLeaderboardProps {
  users: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  onOpenFullLeaderboard?: () => void;
  onOpenAnalytics?: () => void;
  onOpenSquads?: () => void;
  onOpenWings?: () => void;
  onOpenPassport?: (user: UserProfile) => void;
}

export const ImpactLeaderboard: React.FC<ImpactLeaderboardProps> = ({
  users,
  onSelectUser,
  onOpenFullLeaderboard,
  onOpenAnalytics,
  onOpenSquads,
  onOpenWings,
  onOpenPassport,
}) => {
  const [activeTab, setActiveTab] = useState<'season' | 'all-time' | 'departments'>('season');
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(2);
  const [activeMetricTab, setActiveMetricTab] = useState<'karma' | 'growth' | 'reliability'>('karma');

  const selectedUser = users[selectedUserIndex] || users[0];

  const handleOpenLeaderboard = (source: string) => {
    console.log(`[ImpactLeaderboard] Full Leaderboard clicked from '${source}'. Triggering onOpenFullLeaderboard(). Total users available: ${users.length}`);
    if (onOpenFullLeaderboard) {
      onOpenFullLeaderboard();
    }
  };

  const handleSelectUser = (user: UserProfile, idx: number) => {
    setSelectedUserIndex(idx);
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  return (
    <section id="impact" className="py-28 border-b border-zinc-800 relative bg-[#0d0e13] text-white overflow-hidden font-sans">
      {/* Background ambient dark neon glow */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[500px] bg-[#fbcfe8]/[0.025] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[400px] bg-[#f472b6]/[0.025] rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal leading-tight font-heading">
            Don't just be on campus.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow-[0_0_18px_rgba(251,207,232,0.18)]">
              Make an impact on it.
            </span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
            Every useful action adds to your journey. Every contribution leaves a mark.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* PREMIUM FRAMER-STYLE BENTO GRID SYSTEM */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* ===================================================================== */}
          {/* TOP-LEFT CARD: "Student Identity & Karma Config" */}
          {/* ===================================================================== */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group">
            {/* Top glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-heading">
                  Active Contributor
                </h3>
                <span className="text-[10px] font-mono-tech text-pink-300 px-2.5 py-0.5 rounded-full bg-pink-950/50 border border-pink-300/30 uppercase font-bold">
                  RANK // {String(selectedUser.rank).padStart(2, '0')}
                </span>
              </div>

              {/* Title & Tag Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono-tech text-zinc-400 flex items-center justify-between">
                  <span>Student Handle</span>
                  <span className="text-pink-300 font-mono-tech">/campus/{selectedUser.id}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181a24] border border-zinc-800 text-sm text-white font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.name} 
                      className="w-6 h-6 rounded-full object-cover border border-pink-300/40" 
                    />
                    <span className="font-semibold text-white">{selectedUser.name}</span>
                  </div>
                  <span className="text-xs font-mono-tech text-pink-300">THIS MONTH // +{selectedUser.monthlyGrowthPercent || 18}%</span>
                </div>
              </div>

              {/* Persona Description */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono-tech text-zinc-400">Campus Bio & Accolade</div>
                <div className="p-4 rounded-xl bg-[#181a24] border border-zinc-800 text-xs leading-relaxed text-zinc-300 font-mono-tech">
                  LEVEL // {selectedUser.title.toUpperCase()} • {selectedUser.department}
                </div>
              </div>

              {/* Mini Social / Badge Preview */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center justify-between">
                  <span>Campus Badge Preview</span>
                </div>
                <div className="h-20 rounded-xl bg-gradient-to-br from-[#181a24] to-[#1d1f2b] border border-zinc-800 p-3 flex items-center justify-between overflow-hidden relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-300/10 border border-pink-300/40 flex items-center justify-center text-lg">
                      {selectedUser.nametagIcon || '✨'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{selectedUser.name}</div>
                      <div className="text-[10px] text-pink-300 font-mono-tech uppercase font-bold">{selectedUser.title}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono-tech">
                    <div className="text-sm font-black text-white">{selectedUser.impactScore} PTS</div>
                    <div className="text-[9px] text-pink-300">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Link Action */}
            <div 
              onClick={() => onOpenPassport?.(selectedUser)}
              className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                <span>Identity & Passport</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* TOP-CENTER COLUMN: 2 Stacked Cards */}
          {/* ===================================================================== */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-6">
            
            {/* CARD A: Collaboration / Live Peer Squads */}
            <div 
              onClick={() => onOpenSquads?.()}
              className="bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-pink-300" />
                    <span>Peer Squads</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onOpenSquads?.(); }}
                    className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#181a24] border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-300" />
                      <span className="text-white font-medium">Main Hub (All Hostels)</span>
                    </div>
                    <span className="text-[10px] font-mono-tech text-zinc-400">1m ago</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1e2b] border border-pink-300/30 flex items-center justify-between text-xs shadow-[0_0_15px_rgba(251,207,232,0.08)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
                      <span className="text-white font-medium">hackathon-squad-ai</span>
                    </div>
                    <span className="text-[10px] font-mono-tech text-pink-300">Active</span>
                  </div>

                  <div className="pl-6 space-y-1.5 border-l border-zinc-750 ml-3 py-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-300">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" className="w-4 h-4 rounded-full" />
                        <span>Aarav (Frontend Lead)</span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-zinc-400">8m</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-300">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" className="w-4 h-4 rounded-full" />
                        <span>Dev (ML Engineer)</span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-zinc-400">10m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Collaboration</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-mono-tech text-zinc-400">3 ACTIVE TEAMS</span>
              </div>
            </div>

            {/* CARD B: Hostel / Department Localization Hub */}
            <div 
              onClick={() => onOpenWings?.()}
              className="bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <Globe className="w-4 h-4 text-pink-300" />
                    <span>Hostel Wings</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onOpenWings?.(); }}
                    className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#181a24] border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white">H4</span>
                      <span className="text-white">North Block Hostel</span>
                    </div>
                    <span className="text-xs font-mono-tech text-pink-300 font-bold">98% Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#181a24] border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white">H7</span>
                      <span className="text-white">Tech Tower Hostel</span>
                    </div>
                    <span className="text-xs font-mono-tech text-pink-200 font-bold">100% Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#181a24] border border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white">PG</span>
                      <span className="text-white">Research Enclave</span>
                    </div>
                    <span className="text-xs font-mono-tech text-rose-300 font-bold">90% Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Campus Wings</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-mono-tech text-zinc-400">12 LOCATIONS</span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* TOP-RIGHT COLUMN: 2 Stacked Cards */}
          {/* ===================================================================== */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6">
            
            {/* CARD A: 99.99% Reliability / Trust Index */}
            <div className="bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group min-h-[220px]">
              {/* Subtle background curved neon wave */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-300/5 to-transparent pointer-events-none" />

              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight">
                  99.99%
                </div>
                <div className="text-xl sm:text-2xl font-bold text-zinc-400 font-heading -mt-1">
                  item return rate
                </div>
                <p className="text-xs text-zinc-400 mt-3 font-normal">
                  Zero collateral defaults across 12,480 peer loans through cryptographic karma validation.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Trust Matrix</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-mono-tech text-pink-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-ping" />
                  VERIFIED 24/7
                </span>
              </div>
            </div>

            {/* CARD B: Campus URL / SSL Security Protocol */}
            <div className="bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group">
              <div>
                <div className="text-xs font-mono-tech text-zinc-400 mb-3 uppercase tracking-wider">
                  Verified Campus Node
                </div>

                {/* Cyber Browser Address Bar */}
                <div className="p-2.5 rounded-2xl bg-[#181a24] border border-zinc-800 flex items-center gap-2 shadow-inner">
                  <div className="flex items-center gap-1.5 text-zinc-500 pl-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  
                  <div className="flex-1 ml-2 py-1.5 px-3 rounded-xl bg-[#101118] border border-zinc-750 flex items-center gap-2 text-xs font-mono-tech text-zinc-200">
                    <Lock className="w-3.5 h-3.5 text-pink-300" />
                    <span className="truncate">https://oncampus.edu/node/secure</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Security & Zero-Knowledge</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <ShieldCheck className="w-4 h-4 text-pink-300" />
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* BOTTOM-LEFT CARD: Framer-Style Analytics Chart Block */}
          {/* ===================================================================== */}
          <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group">
            
            <div>
              {/* Analytics Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white font-heading">
                    Campus Analytics
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono-tech mt-0.5">
                    Real-time peer lending & knowledge trade volume
                  </p>
                </div>

                {/* Metric Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 bg-[#181a24] p-3 rounded-2xl border border-zinc-800">
                  <div>
                    <div className="text-[10px] text-zinc-400 font-mono-tech flex items-center gap-1">
                      <span>Live Peers</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-ping" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white font-heading">414</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-400 font-mono-tech">Unique Traders</div>
                    <div className="text-lg sm:text-xl font-bold text-white font-heading">1.7K</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-400 font-mono-tech">Karma Volume</div>
                    <div className="text-lg sm:text-xl font-bold text-white font-heading">2.2M</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-400 font-mono-tech">Growth Rate</div>
                    <div className="text-lg sm:text-xl font-bold text-pink-300 font-heading">+40.9%</div>
                  </div>
                </div>
              </div>

              {/* Framer-Style Dual Neon Curve Chart */}
              <div className="relative w-full h-56 sm:h-64 my-4 rounded-2xl bg-gradient-to-b from-[#181a24]/50 to-transparent p-4 border border-zinc-800/80 flex items-end">
                
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-15 pointer-events-none">
                  <div className="border-b border-dashed border-zinc-700 w-full" />
                  <div className="border-b border-dashed border-zinc-700 w-full" />
                  <div className="border-b border-dashed border-zinc-700 w-full" />
                </div>

                {/* SVG Curves */}
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="neonPinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="fillPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area */}
                  <path 
                    d="M0,130 Q70,90 140,110 T280,60 T420,40 L500,20 L500,150 L0,150 Z" 
                    fill="url(#fillPinkGrad)" 
                  />

                  {/* Primary Rose Line */}
                  <path
                    d="M0,110 Q70,140 140,95 T280,75 T420,50 L500,30"
                    fill="none"
                    stroke="#fda4af"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* Secondary Glowing Soft Pink Line */}
                  <path
                    d="M0,130 Q70,90 140,110 T280,60 T420,40 L500,20"
                    fill="none"
                    stroke="url(#neonPinkGrad)"
                    strokeWidth="3.5"
                    filter="drop-shadow(0px 0px 8px rgba(251,207,232,0.4))"
                  />
                </svg>

                {/* Floating Chart Tooltip Card */}
                <div className="absolute top-6 right-8 sm:right-16 bg-[#181a24]/95 backdrop-blur-md border border-zinc-700 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-xs">
                  <div className="text-[11px] font-mono-tech text-zinc-400 mb-1.5 font-bold">Aug 15, 2026</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-300" />
                      <span className="text-zinc-300">Trades:</span>
                      <span className="font-bold text-white font-mono-tech">135,535</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-300" />
                      <span className="text-zinc-300">Active Peers:</span>
                      <span className="font-bold text-white font-mono-tech">54,817</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div 
              onClick={() => onOpenAnalytics?.()}
              className="pt-4 mt-2 border-t border-zinc-800 flex items-center justify-between cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                <span>Detailed Impact Analytics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BOTTOM-RIGHT CARD: Leaderboard Standings */}
          {/* ===================================================================== */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group">
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5">
                    {selectedUser.impactScore.toLocaleString()} <span className="text-xs font-mono-tech font-normal text-zinc-400">PTS</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenLeaderboard('Trophy Icon')}
                  className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-300 hover:bg-amber-400/20 transition-colors cursor-pointer"
                  title="View Full Leaderboard Standings"
                >
                  <Trophy className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-4 font-normal">
                Your contribution moves you forward.
              </p>

              {/* Blue/Pink Pill Bar visual */}
              <div 
                onClick={() => handleOpenLeaderboard('Gradient Bar')}
                className="w-full h-8 rounded-xl bg-gradient-to-r from-pink-200 via-rose-200 to-pink-400 mb-6 shadow-[0_0_15px_rgba(251,207,232,0.2)] cursor-pointer hover:opacity-90 transition-opacity" 
                title="Click to view full standings"
              />

              {/* Leaderboard Users List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 pb-1 border-b border-zinc-800">
                  <span>STUDENT</span>
                  <div className="flex items-center gap-4">
                    <span>KARMA</span>
                    <span>RANK</span>
                  </div>
                </div>

                {users.slice(0, 4).map((user, idx) => {
                  const isSelected = idx === selectedUserIndex;
                  const isTop = idx === 0;

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user, idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#1c1e2b] border-pink-300 shadow-[0_0_12px_rgba(251,207,232,0.15)]'
                          : 'bg-[#181a24] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-pink-300' : 'bg-zinc-600'}`} />
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">
                          {user.name}
                        </span>
                        {isTop && (
                          <span className="text-[9px] font-mono-tech bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                            TOP 1
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono-tech">
                        <span className="text-white font-bold">{user.impactScore}</span>
                        <span className="text-zinc-400">#{user.rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Link Action */}
            <div 
              onClick={() => handleOpenLeaderboard('Footer Link')}
              className="pt-4 mt-6 border-t border-zinc-800 flex items-center justify-between cursor-pointer group hover:bg-zinc-800/40 p-1.5 -mx-1.5 rounded-xl transition-colors"
            >
              <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                <span>Full Leaderboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">{users.length}+ STUDENTS</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
