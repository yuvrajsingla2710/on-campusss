import React, { useState } from 'react';
import { 
  Repeat, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter,
  Eye,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { SkillMatch, GuidanceTopic, UserProfile } from '../../types';

interface MentorshipViewProps {
  skillMatches: SkillMatch[];
  guidanceTopics: GuidanceTopic[];
  currentUser: UserProfile;
  onConnectMatch: (matchId: string) => void;
  onAddSkills: (offered: string, wanted: string) => void;
  onAddGuidanceTopic: (topic: Omit<GuidanceTopic, 'id' | 'reads'>) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({
  skillMatches,
  guidanceTopics,
  currentUser,
  onConnectMatch,
  onAddSkills,
  onAddGuidanceTopic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'guides'>('skills');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Skill Swap Offer State
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');

  // Guidance Guide State
  const [isGuideFormOpen, setIsGuideFormOpen] = useState(false);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideCategory, setGuideCategory] = useState<GuidanceTopic['category']>('Course Advice');
  const [guideSummary, setGuideSummary] = useState('');
  const [guideTips, setGuideTips] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    onConnectMatch(id);
    setSuccessMsg('Skill Swap connection requested! Both peers have been synced in Campus Messages.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredSkill || !wantedSkill) return;

    onAddSkills(offeredSkill, wantedSkill);
    setSuccessMsg('Your skill exchange profile was indexed into the Campus Neural Matchmaker!');
    setOfferedSkill('');
    setWantedSkill('');
    setIsSkillFormOpen(false);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideTitle || !guideSummary) return;

    const tips = guideTips.split('\n').map(t => t.trim()).filter(Boolean);
    onAddGuidanceTopic({
      title: guideTitle,
      category: guideCategory,
      mentorName: `${currentUser.name} (Senior Mentor)`,
      mentorTitle: `${currentUser.department} Contributor`,
      summary: guideSummary,
      tips: tips.length > 0 ? tips : ['Review weekly lab tasks', 'Ask TA during office hours'],
    });

    setSuccessMsg('Guidance Guide published to the Campus Memory Layer! +50 Karma pts earned.');
    setGuideTitle('');
    setGuideSummary('');
    setGuideTips('');
    setIsGuideFormOpen(false);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const filteredSkills = skillMatches.filter(
    (m) =>
      m.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.offering.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.seeking.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guidanceTopics.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="mentorship-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <Sparkles className="w-4 h-4 text-[#00f2ff]" />
            <span>KNOWLEDGE REPOSITORY & PEER MENTORSHIP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            SKILL EXCHANGE & SENIOR GUIDES
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Trade what you know for what you need. Access verified senior course archives, lab secrets, and faculty grading blueprints.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-2 bg-[#050505] p-1 border border-white/10 rounded-sm">
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-4 py-2 text-xs font-mono-tech uppercase tracking-[1px] rounded-sm transition-all cursor-pointer font-bold ${
              activeSubTab === 'skills'
                ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            ⚡ Skill Matchmaker
          </button>
          <button
            onClick={() => setActiveSubTab('guides')}
            className={`px-4 py-2 text-xs font-mono-tech uppercase tracking-[1px] rounded-sm transition-all cursor-pointer font-bold ${
              activeSubTab === 'guides'
                ? 'bg-[#bc13fe] text-white shadow-[0_0_15px_rgba(188,19,254,0.3)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            📖 Senior Archives
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 bg-[#00f2ff]/10 border border-[#00f2ff] rounded-sm text-xs font-mono-tech text-[#00f2ff] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#00f2ff] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SUBTAB 1: SKILL EXCHANGE */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. React, C++, Figma)..."
                className="w-full pl-9 pr-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
              />
            </div>

            <button
              onClick={() => setIsSkillFormOpen(!isSkillFormOpen)}
              className="w-full sm:w-auto px-4 py-2 bg-[#00f2ff] text-black font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm cursor-pointer"
            >
              {isSkillFormOpen ? 'CLOSE FORM' : '+ OFFER YOUR SKILLS'}
            </button>
          </div>

          {/* Skill Offer Form */}
          {isSkillFormOpen && (
            <form
              onSubmit={handleOfferSubmit}
              className="p-6 bg-[#121212] border border-[#00f2ff]/40 rounded-sm space-y-4 shadow-xl"
            >
              <div className="text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[2px]">
                INDEX YOUR SKILLS IN THE PEER NETWORK
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                    WHAT YOU CAN TEACH (OFFERING) *
                  </label>
                  <input
                    type="text"
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    placeholder="e.g. ROS2 Robotics / Rust / Linear Algebra"
                    required
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                    WHAT YOU WANT TO LEARN (SEEKING) *
                  </label>
                  <input
                    type="text"
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    placeholder="e.g. Next.js / Blender 3D / Financial Modeling"
                    required
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSkillFormOpen(false)}
                  className="px-4 py-2 bg-[#050505] border border-white/10 text-white/60 text-xs font-mono-tech rounded-sm cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00f2ff] text-black font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm cursor-pointer"
                >
                  PUBLISH TO MATCHMAKER
                </button>
              </div>
            </form>
          )}

          {/* Skill Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((match) => (
              <div
                key={match.id}
                className="p-5 rounded-sm bg-[#121212] border border-white/[0.08] hover:border-[#00f2ff] transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-sm bg-[#050505] border border-white/10 flex items-center justify-center font-mono-tech text-xs font-bold text-white">
                      {match.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-heading">{match.userName}</div>
                      <div className="text-[10px] font-mono-tech text-white/40">{match.department} • Year {match.year}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-xs font-mono-tech text-[#00f2ff] font-bold">
                    {match.compatibility}% MATCH
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-[#050505] rounded-sm border border-white/5 font-mono-tech text-xs">
                  <div>
                    <div className="text-[9px] text-[#00f2ff] uppercase tracking-wider mb-1 font-bold">THEY TEACH</div>
                    <div className="text-white font-semibold">{match.offering}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#bc13fe] uppercase tracking-wider mb-1 font-bold">THEY WANT</div>
                    <div className="text-white font-semibold">{match.seeking}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono-tech text-white/40">{match.availability}</span>
                  <button
                    onClick={() => handleConnect(match.id)}
                    className="px-4 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono-tech tracking-[1px] uppercase rounded-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>SWAP SKILLS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SENIOR GUIDES & ARCHIVES */}
      {activeSubTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course blueprints, faculty tips..."
                className="w-full pl-9 pr-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
              />
            </div>

            <button
              onClick={() => setIsGuideFormOpen(!isGuideFormOpen)}
              className="w-full sm:w-auto px-4 py-2 bg-[#bc13fe] text-white font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm cursor-pointer"
            >
              {isGuideFormOpen ? 'CLOSE FORM' : '+ PUBLISH SENIOR GUIDE'}
            </button>
          </div>

          {/* Guide Form */}
          {isGuideFormOpen && (
            <form
              onSubmit={handleGuideSubmit}
              className="p-6 bg-[#121212] border border-[#bc13fe]/40 rounded-sm space-y-4 shadow-xl"
            >
              <div className="text-xs font-mono-tech text-[#bc13fe] font-bold uppercase tracking-[2px]">
                SHARE SENIOR EXPERIENCE & ARCHIVES
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                    GUIDE TITLE *
                  </label>
                  <input
                    type="text"
                    value={guideTitle}
                    onChange={(e) => setGuideTitle(e.target.value)}
                    placeholder="e.g. How to ace OS Lab viva & Kernel compilation"
                    required
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={guideCategory}
                    onChange={(e) => setGuideCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
                  >
                    <option value="Course Advice">Course Advice</option>
                    <option value="Faculty Intel">Faculty Intel</option>
                    <option value="Lab Secrets">Lab Secrets</option>
                    <option value="Internships">Internships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                  EXECUTIVE SUMMARY *
                </label>
                <textarea
                  rows={2}
                  value={guideSummary}
                  onChange={(e) => setGuideSummary(e.target.value)}
                  placeholder="Key concepts to focus on, past exam patterns, important milestones..."
                  required
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                  ACTIONABLE TIPS / BULLETS (1 PER LINE)
                </label>
                <textarea
                  rows={3}
                  value={guideTips}
                  onChange={(e) => setGuideTips(e.target.value)}
                  placeholder="Tip 1: Practice fork() and thread synch on Linux&#10;Tip 2: Reference Silberschatz Chapter 4-6"
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGuideFormOpen(false)}
                  className="px-4 py-2 bg-[#050505] border border-white/10 text-white/60 text-xs font-mono-tech rounded-sm cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#bc13fe] text-white font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm cursor-pointer"
                >
                  PUBLISH GUIDE
                </button>
              </div>
            </form>
          )}

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGuides.map((guide) => {
              const isExpanded = expandedGuideId === guide.id;

              return (
                <div
                  key={guide.id}
                  className="p-5 rounded-sm bg-[#121212] border border-white/[0.08] hover:border-[#bc13fe] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech text-[#bc13fe] uppercase tracking-[1px] font-bold px-2 py-0.5 rounded-sm bg-[#bc13fe]/10 border border-[#bc13fe]/30">
                      {guide.category}
                    </span>
                    <span className="text-[10px] font-mono-tech text-white/40 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{guide.reads} reads</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {guide.summary}
                  </p>

                  {/* Tips list */}
                  {guide.tips && guide.tips.length > 0 && (
                    <div className="space-y-1.5 p-3 bg-[#050505] rounded-sm border border-white/5">
                      <div className="text-[9px] font-mono-tech text-[#00f2ff] uppercase tracking-wider font-bold">
                        KEY ACTIONABLE TIPS
                      </div>
                      <ul className="space-y-1 text-xs text-white/80 list-disc list-inside">
                        {guide.tips.map((tip, idx) => (
                          <li key={idx} className="font-mono-tech text-[11px]">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono-tech text-white/50">
                    <div>Author: <span className="text-white font-bold">{guide.mentorName}</span></div>
                    <span className="text-[#00f2ff]">VERIFIED SENIOR ARCHIVE</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
