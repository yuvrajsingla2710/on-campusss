import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  BookOpen, 
  Repeat, 
  HandCoins, 
  Layers 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LeaderboardViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  users,
  currentUser,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all-time' | 'semester' | 'weekly'>('semester');

  const sortedUsers = [...users].sort((a, b) => b.impactScore - a.impactScore);

  return (
    <div id="leaderboard-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <Trophy className="w-4 h-4 text-[#00f2ff]" />
            <span>CAMPUS PROOF-OF-CONTRIBUTION PROTOCOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            CAMPUS REPUTATION & IMPACT LEADERBOARD
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Earn verifiable karma by mentoring peers, sharing hardware, and leading open campus research builds.
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1.5 bg-[#050505] p-1 border border-white/10 rounded-sm self-start md:self-auto">
          {(['weekly', 'semester', 'all-time'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 text-xs font-mono-tech uppercase tracking-[1px] rounded-sm transition-all cursor-pointer ${
                filterPeriod === period
                  ? 'bg-[#00f2ff] text-black font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Snapshot Telemetry Card */}
      <div className="bg-[#121212] border border-white/[0.08] border-l-4 border-l-[#00f2ff] p-6 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-sm bg-[#050505] border-2 border-[#00f2ff] flex items-center justify-center font-mono-tech text-lg font-black text-[#00f2ff]">
              #{String(currentUser.rank).padStart(2, '0')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white font-heading">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[10px] font-mono-tech text-[#00f2ff] font-bold uppercase">
                  VERIFIED PEER
                </span>
              </div>
              <div className="text-xs font-mono-tech text-white/60 mt-0.5">
                {currentUser.title} • {currentUser.department}
              </div>
            </div>
          </div>

          {/* 4 Score Compartments */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech">
            <div className="p-3 bg-[#050505] rounded-sm border border-white/5 text-center">
              <div className="text-[9px] text-[#00f2ff] uppercase">KNOWLEDGE</div>
              <div className="text-base font-bold text-white mt-0.5">{currentUser.knowledgeScore}</div>
            </div>
            <div className="p-3 bg-[#050505] rounded-sm border border-white/5 text-center">
              <div className="text-[9px] text-[#bc13fe] uppercase">SKILLS</div>
              <div className="text-base font-bold text-white mt-0.5">{currentUser.skillScore}</div>
            </div>
            <div className="p-3 bg-[#050505] rounded-sm border border-white/5 text-center">
              <div className="text-[9px] text-[#00f2ff] uppercase">RESOURCES</div>
              <div className="text-base font-bold text-white mt-0.5">{currentUser.resourceScore}</div>
            </div>
            <div className="p-3 bg-[#050505] rounded-sm border border-white/5 text-center">
              <div className="text-[9px] text-white/70 uppercase">PROJECTS</div>
              <div className="text-base font-bold text-white mt-0.5">{currentUser.projectScore}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#00f2ff] font-heading">
              {currentUser.impactScore}
            </div>
            <div className="text-[10px] font-mono-tech text-white/40 uppercase tracking-[1px]">
              TOTAL KARMA POINTS
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-[#121212] border border-white/[0.08] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between font-mono-tech text-xs text-white/50">
          <span>CAMPUS PEER RANKINGS</span>
          <span>SCORES UPDATED LIVE EVERY 60S</span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {sortedUsers.map((user, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  user.id === currentUser.id
                    ? 'bg-[#00f2ff]/5 border-l-2 border-l-[#00f2ff]'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center font-mono-tech text-sm font-black ${
                      rank === 1
                        ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                        : rank === 2
                        ? 'bg-[#bc13fe] text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]'
                        : rank === 3
                        ? 'bg-white text-black'
                        : 'bg-[#050505] text-white/60 border border-white/10'
                    }`}
                  >
                    #{String(rank).padStart(2, '0')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-heading font-bold text-white text-base">
                      <span>{user.name}</span>
                      {user.badges.slice(0, 1).map((b) => (
                        <span
                          key={b}
                          className="px-2 py-0.5 rounded-sm bg-[#050505] border border-white/10 text-[9px] font-mono-tech text-[#00f2ff] uppercase"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-mono-tech text-white/50">
                      {user.title} • {user.department}
                    </div>
                  </div>
                </div>

                {/* Score & Badges */}
                <div className="flex items-center justify-between sm:justify-end gap-6 font-mono-tech">
                  <div className="hidden md:flex items-center gap-2">
                    {user.badges.slice(1).map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-sm bg-[#050505] border border-white/5 text-[9px] text-white/60"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-white font-heading">
                      {user.impactScore} <span className="text-xs text-[#00f2ff]">PTS</span>
                    </div>
                    <div className="text-[10px] text-white/40">
                      Level {Math.floor(user.impactScore / 500) + 1} Contributor
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
