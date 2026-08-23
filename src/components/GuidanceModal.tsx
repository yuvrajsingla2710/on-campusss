import React, { useState } from 'react';
import { GuidanceTopic } from '../types';
import { 
  X, 
  Compass, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  UserCheck,
  MessageSquare
} from 'lucide-react';

interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: GuidanceTopic[];
  onAddTopic: (topic: Omit<GuidanceTopic, 'id' | 'reads'>) => void;
  onRequestGuidance?: (subject: string, category: string, question: string, preferredFormat: string) => void;
}

export const GuidanceModal: React.FC<GuidanceModalProps> = ({
  isOpen,
  onClose,
  topics,
  onAddTopic,
  onRequestGuidance,
}) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'request' | 'share'>('guides');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Form State - Share Guide
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GuidanceTopic['category']>('Course Advice');
  const [summary, setSummary] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State - Request Guidance
  const [reqSubject, setReqSubject] = useState('');
  const [reqCategory, setReqCategory] = useState<GuidanceTopic['category']>('Course Advice');
  const [reqQuestion, setReqQuestion] = useState('');
  const [reqFormat, setReqFormat] = useState('15-Min Quick Chat or Audio');
  const [reqTargetYear, setReqTargetYear] = useState('3rd / 4th Year Senior');

  // Open guidance requests community feed
  const [openRequests, setOpenRequests] = useState([
    {
      id: 'gr-1',
      subject: 'Compiler Design Lab Setup & Flex/Bison pointers',
      category: 'Course Advice',
      requester: 'Kartik N. (2nd Year CSE)',
      format: '15-Min Quick Chat',
      target: 'Senior who took CSE302',
      responsesCount: 2,
    },
    {
      id: 'gr-2',
      subject: 'Preparing for Summer Internship Coding Rounds (Fintech/Quant)',
      category: 'Career Prep',
      requester: 'Ananya S. (3rd Year IT)',
      format: 'Resume Review & Mock Q&A',
      target: 'Placed 4th Year Senior',
      responsesCount: 4,
    },
    {
      id: 'gr-3',
      subject: 'Professor Rao Research Group - How to approach for Lab RA?',
      category: 'Professor Insights',
      requester: 'Dev M. (2nd Year ECE)',
      format: 'Coffee/Quick 10m Chat',
      target: 'Current Lab RA Student',
      responsesCount: 1,
    }
  ]);

  if (!isOpen) return null;

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    const tips = tipsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddTopic({
      title,
      category,
      mentorName: 'You (Senior Mentor)',
      mentorTitle: 'Campus Contributor',
      summary,
      tips: tips.length > 0 ? tips : ['Study with real lecture code', 'Ask in lab hours'],
    });

    setSuccessMsg('Your Guidance Guide was published to the Campus Memory Layer! +50 Impact points earned.');
    setTitle('');
    setSummary('');
    setTipsText('');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('guides');
    }, 2000);
  };

  const handleRequestGuidanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject.trim() || !reqQuestion.trim()) return;

    if (onRequestGuidance) {
      onRequestGuidance(reqSubject, reqCategory, reqQuestion, reqFormat);
    }

    const newReq = {
      id: `gr-${Date.now()}`,
      subject: reqSubject,
      category: reqCategory,
      requester: 'You (Verified Student)',
      format: reqFormat,
      target: reqTargetYear,
      responsesCount: 0,
    };

    setOpenRequests([newReq, ...openRequests]);
    setSuccessMsg(`Your guidance request for "${reqSubject}" was submitted! We are matching you with verified senior mentors.`);
    setReqSubject('');
    setReqQuestion('');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090C12] border border-violet-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-400/40 flex items-center justify-center text-violet-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              02 // CAMPUS MEMORY & GUIDANCE
            </h2>
            <p className="text-xs font-mono-tech text-violet-400">
              Learn from people who've already been there. Course insights, mentorship & guidance requests.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-violet-950/80 border border-violet-400/60 text-violet-300 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            VERIFIED GUIDES ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'request'
                ? 'bg-gradient-to-r from-violet-950 to-indigo-950 border border-violet-400 text-violet-200 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + REQUEST GUIDANCE / MENTOR
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'share'
                ? 'bg-violet-950/80 border border-violet-400/60 text-violet-300 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + SHARE SENIOR GUIDE (+50 IMPACT)
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-mono-tech flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Guides List */}
        {activeTab === 'guides' && (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:border-violet-400/50 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] font-mono-tech text-violet-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-400/20 text-violet-300">
                    {topic.category}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Eye className="w-3.5 h-3.5" />
                    {topic.reads} students referenced
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {topic.summary}
                </p>

                {/* Key Bullet Points */}
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/[0.06] space-y-1.5 mb-3">
                  <div className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider">
                    PRO-TIPS & EXECUTION NOTES:
                  </div>
                  {topic.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-zinc-300 font-mono-tech flex items-start gap-2"
                    >
                      <span className="text-violet-400 font-bold">›</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                    <span>Curated by {topic.mentorName}</span>
                    <span className="text-[10px] text-zinc-400">({topic.mentorTitle})</span>
                  </div>

                  <button
                    onClick={() => {
                      setSuccessMsg(`Connected with ${topic.mentorName}! Mentor chat channel opened.`);
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-violet-950 hover:bg-violet-900 border border-violet-400/40 text-violet-300 text-xs font-mono-tech rounded transition-all cursor-pointer"
                  >
                    ASK AUTHOR A QUESTION
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Request Guidance Form & Community Questions */}
        {activeTab === 'request' && (
          <div className="space-y-6">
            <form onSubmit={handleRequestGuidanceSubmit} className="p-5 rounded-xl bg-zinc-950/90 border border-violet-400/30 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono-tech text-violet-300 font-bold uppercase tracking-wider">
                  Request Specific Guidance or 1-on-1 Senior Mentorship
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  WHAT DO YOU NEED GUIDANCE ON? *
                </label>
                <input
                  type="text"
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  placeholder="e.g. Navigating Operating Systems project, Off-campus placement strategy, or Lab Exam tips"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                  >
                    <option value="Course Advice">Course Advice</option>
                    <option value="Career Prep">Career Prep / Internships</option>
                    <option value="Professor Insights">Professor Insights</option>
                    <option value="Campus Hack">Campus Hack / Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    PREFERRED FORMAT
                  </label>
                  <select
                    value={reqFormat}
                    onChange={(e) => setReqFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                  >
                    <option value="15-Min Quick Chat">15-Min Quick Chat</option>
                    <option value="Audio Call / Huddle">Audio Call / Huddle</option>
                    <option value="Written Tips / Notes">Written Tips / Notes</option>
                    <option value="In-person Library Sync">In-person Library Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    TARGET SENIOR
                  </label>
                  <input
                    type="text"
                    value={reqTargetYear}
                    onChange={(e) => setReqTargetYear(e.target.value)}
                    placeholder="e.g. 3rd/4th Year Senior"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  DETAILED QUESTION / CURRENT BLOCKER *
                </label>
                <textarea
                  value={reqQuestion}
                  onChange={(e) => setReqQuestion(e.target.value)}
                  placeholder="Describe your current situation, what you've tried, and what exact advice would help you the most."
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                BROADCAST GUIDANCE REQUEST TO SENIOR NETWORK
              </button>
            </form>

            {/* Open Guidance Requests Feed */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-violet-400 mb-3 font-bold uppercase">
                <span>ACTIVE GUIDANCE REQUESTS FROM JUNIORS ({openRequests.length})</span>
                <span className="text-zinc-400 text-[11px] font-normal">Seniors: Can you guide on these?</span>
              </div>

              <div className="space-y-3">
                {openRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.08] hover:border-violet-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-violet-950/70 border border-violet-400/20 text-[10px] font-mono-tech text-violet-300">
                          {req.category}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono-tech">
                          Format: <strong className="text-zinc-200">{req.format}</strong>
                        </span>
                        <span className="text-[10px] text-violet-300/80 font-mono-tech">
                          Seeking: {req.target}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {req.subject}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-tech">
                        Posted by {req.requester} • {req.responsesCount} mentors volunteered
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSuccessMsg(`You volunteered to mentor for "${req.subject}"! +30 Impact points pending.`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="px-3.5 py-1.5 bg-white/[0.08] hover:bg-violet-600 hover:text-white text-violet-300 border border-violet-400/40 text-xs font-mono-tech font-semibold rounded transition-all cursor-pointer shrink-0"
                    >
                      I CAN GUIDE (+30 IMPACT)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Share Guide Form */}
        {activeTab === 'share' && (
          <form onSubmit={handleShareSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                GUIDE TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to score S-grade in Database Systems with Prof. Sharma"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              >
                <option value="Course Advice">Course Advice</option>
                <option value="Professor Insights">Professor Insights</option>
                <option value="Campus Hack">Campus Hack</option>
                <option value="Career Prep">Career Prep</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                SUMMARY & CONTEXT
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Explain the big picture, common pitfalls, and what to watch out for."
                rows={3}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                ACTIONABLE TIPS (ONE PER LINE)
              </label>
              <textarea
                value={tipsText}
                onChange={(e) => setTipsText(e.target.value)}
                placeholder="Tip 1: Focus on B+ Tree balancing&#10;Tip 2: Submit lab assignments before 6 PM&#10;Tip 3: Check 2024 past papers"
                rows={3}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg"
              >
                PUBLISH TO GUIDANCE REPOSITORY (+50 IMPACT)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
