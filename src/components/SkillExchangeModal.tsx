import React, { useState } from 'react';
import { SkillMatch } from '../types';
import { 
  X, 
  Repeat, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  MessageSquare,
  Zap
} from 'lucide-react';

interface SkillExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: SkillMatch[];
  onConnectMatch: (matchId: string) => void;
  onAddSkills: (offered: string, wanted: string) => void;
}

export const SkillExchangeModal: React.FC<SkillExchangeModalProps> = ({
  isOpen,
  onClose,
  matches,
  onConnectMatch,
  onAddSkills,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'offer'>('matches');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = (id: string) => {
    onConnectMatch(id);
    setSuccessMsg('Skill Swap connection requested! Both peers have been notified via campus mailbox.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredSkill || !wantedSkill) return;

    onAddSkills(offeredSkill, wantedSkill);
    setSuccessMsg('Your skill profile was indexed into the ON CAMPUS Neural Matchmaker!');
    setOfferedSkill('');
    setWantedSkill('');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('matches');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090C12] border border-amber-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              03 // SKILL EXCHANGE & TRADE
            </h2>
            <p className="text-xs font-mono-tech text-amber-400">
              Trade what you know. 1-on-1 peer skill swapping with complementary compatibility.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/[0.08] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-amber-950/80 border border-amber-400/60 text-amber-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            DISCOVER MATCHES ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('offer')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'offer'
                ? 'bg-amber-950/80 border border-amber-400/60 text-amber-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + POST SKILL OFFER
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Discover Matches (Highlighting the 92% Match as in Prompt) */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-5 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:border-amber-400/50 transition-all"
              >
                {/* Match Score Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-xs font-mono-tech font-bold">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{match.matchScore}% COMPATIBILITY MATCH</span>
                  </div>

                  <span className="text-[10px] font-mono-tech text-zinc-400">
                    CAMPUS CROSS-BRANCH SWAP
                  </span>
                </div>

                {/* 2-Student Exchange Representation (Prompt Example) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative">
                  {/* Student A */}
                  <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-white/[0.06]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={match.studentA.avatar}
                        alt={match.studentA.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {match.studentA.name}
                        </div>
                        <div className="text-[9px] font-mono-tech text-zinc-400">
                          {match.studentA.year}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-300 font-mono-tech">
                      <span className="text-amber-400 font-semibold">Teaches: </span>
                      {match.studentA.teaches}
                    </div>
                  </div>

                  {/* Student B */}
                  <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-white/[0.06]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={match.studentB.avatar}
                        alt={match.studentB.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {match.studentB.name}
                        </div>
                        <div className="text-[9px] font-mono-tech text-zinc-400">
                          {match.studentB.year}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-300 font-mono-tech">
                      <span className="text-cyan-400 font-semibold">Teaches: </span>
                      {match.studentB.teaches}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[10px] font-mono-tech text-zinc-400">
                    Format: Weekly 45-min Zoom / Library whiteboard swap
                  </div>

                  <button
                    onClick={() => handleConnect(match.id)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-xs font-mono-tech font-bold rounded transition-all cursor-pointer shadow-md"
                  >
                    {match.status === 'connected' ? 'CONNECTED ✓' : 'REQUEST SKILL SWAP'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Post Skill Offer */}
        {activeTab === 'offer' && (
          <form onSubmit={handleOfferSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                SKILL YOU CAN TEACH (OFFERED)
              </label>
              <input
                type="text"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                placeholder="e.g. Figma UI Design, Python Data Science, Guitar, LeetCode Trees"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-amber-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                SKILL YOU WANT TO LEARN (WANTED)
              </label>
              <input
                type="text"
                value={wantedSkill}
                onChange={(e) => setWantedSkill(e.target.value)}
                placeholder="e.g. Machine Learning, System Design, Excel Financial Models"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-amber-400 font-mono-tech"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg"
              >
                FIND COMPLEMENTARY MATCHES (+30 IMPACT)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
