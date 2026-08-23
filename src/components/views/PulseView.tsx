import React, { useState } from 'react';
import { 
  Radio, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Send, 
  Check, 
  TrendingUp, 
  Sparkles,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PulsePost, UserProfile } from '../../types';
import { ShareData } from '../ShareModal';

interface PulseViewProps {
  posts: PulsePost[];
  currentUser: UserProfile;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenCreatePost: () => void;
  onOpenQuickQuery: (query: string) => void;
  onOpenShare?: (data: ShareData) => void;
}

export const PulseView: React.FC<PulseViewProps> = ({
  posts,
  currentUser,
  onToggleLike,
  onAddComment,
  onOpenCreatePost,
  onOpenQuickQuery,
  onOpenShare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Announcements', 'General', 'Discussion', 'Help Needed'];

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = (post: PulsePost) => {
    const postUrl = `${window.location.origin}/pulse/${post.id}`;
    const sharePayload: ShareData = {
      title: `${post.author} on Campus Pulse (${post.category})`,
      text: post.text,
      url: postUrl,
      category: post.category,
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
      navigator.clipboard.writeText(postUrl);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div id="pulse-view-container" className="space-y-6">
      {/* Top Banner / Pulse Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-white/[0.08] border-l-4 border-l-[#00f2ff] p-4 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech text-white/50 tracking-[2px] uppercase">
              CAMPUS NETWORK STATUS
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
          </div>
          <div className="text-xl font-black text-white font-heading mt-1 flex items-baseline gap-2">
            <span>DTU MAIN CAMPUS</span>
            <span className="text-xs font-mono-tech text-[#00f2ff] font-normal">99.9% LIVE</span>
          </div>
          <div className="text-[11px] text-white/60 mt-1 font-mono-tech">
            12,850+ active students & 38 departmental nodes synced.
          </div>
        </div>

        <div className="bg-[#121212] border border-white/[0.08] border-l-4 border-l-[#bc13fe] p-4 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech text-white/50 tracking-[2px] uppercase">
              TODAY'S ACTIVITY SPIKE
            </span>
            <TrendingUp className="w-4 h-4 text-[#bc13fe]" />
          </div>
          <div className="text-xl font-black text-white font-heading mt-1">
            +328 NEW DISCUSSIONS
          </div>
          <div className="text-[11px] text-white/60 mt-1 font-mono-tech">
            High interest in Hackathon teams & Robotics Lab slots.
          </div>
        </div>

        <div className="bg-[#121212] border border-white/[0.08] border-l-4 border-l-white p-4 rounded-sm flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono-tech text-white/50 tracking-[2px] uppercase">
              YOUR CAMPUS IDENTITY
            </div>
            <div className="text-sm font-bold text-white font-heading mt-0.5">
              {currentUser.name} • #{String(currentUser.rank).padStart(2, '0')}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono-tech text-[#00f2ff]">
            <span>{currentUser.impactScore} KARMA PTS</span>
            <span className="text-white/60 font-bold uppercase">{currentUser.department}</span>
          </div>
        </div>
      </div>

      {/* Main Pulse Stream Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Main Post Stream */}
        <div className="lg:col-span-8 space-y-4">
          {/* Post Creation Trigger Card */}
          <div className="bg-[#121212] border border-white/[0.08] p-4 rounded-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#050505] border border-[#00f2ff] flex items-center justify-center font-mono-tech text-xs font-bold text-[#00f2ff]">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <button
              id="pulse-create-prompt-btn"
              onClick={onOpenCreatePost}
              className="flex-1 text-left px-4 py-2.5 bg-[#050505] hover:bg-[#090909] border border-white/10 hover:border-[#00f2ff] rounded-sm text-xs text-white/50 font-mono-tech transition-all cursor-pointer flex items-center justify-between"
            >
              <span>Broadcast an update, ask for help, or share campus news...</span>
              <Plus className="w-4 h-4 text-[#00f2ff]" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-white/40 mr-1 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-mono-tech tracking-[1px] uppercase rounded-sm transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                      : 'bg-[#050505] border border-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono-tech text-white/40">
              SHOWING {filteredPosts.length} POSTS
            </div>
          </div>

          {/* Post Feed List */}
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={`pulse-post-${post.id}`}
                className="p-5 rounded-sm bg-[#121212] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-[#050505] border border-white/10 flex items-center justify-center font-mono-tech text-xs font-bold text-white">
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                        <span>{post.author}</span>
                        {post.badge && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[9px] font-mono-tech text-[#00f2ff] font-bold uppercase">
                            {post.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono-tech text-white/40">
                        {post.authorDepartment || 'General Member'} • {post.timestamp}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-tech text-white/60 px-2.5 py-0.5 rounded-sm bg-[#050505] border border-white/10 uppercase">
                    {post.category}
                  </span>
                </div>

                {/* Text Content */}
                <p className="text-sm text-white/90 leading-relaxed font-normal">
                  {post.text}
                </p>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech text-white/50">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => onToggleLike(post.id)}
                      className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                        post.isLiked ? 'text-[#bc13fe] font-bold' : 'hover:text-[#bc13fe]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#bc13fe] text-[#bc13fe]' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 hover:text-[#00f2ff] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/[0.03] hover:bg-[#00f2ff]/15 hover:text-[#00f2ff] transition-all cursor-pointer border border-transparent hover:border-[#00f2ff]/30 text-white/70"
                    title="Share to WhatsApp, Telegram, X, Reddit, etc."
                  >
                    {copiedId === post.id ? (
                      <span className="text-[#00f2ff] text-[11px] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono-tech">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </span>
                    )}
                  </button>
                </div>

                {/* Comments Expandable Box */}
                {activeCommentPostId === post.id && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-3 bg-[#050505] p-3 rounded-sm">
                    {post.comments.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {post.comments.map((c) => (
                          <div key={c.id} className="p-2 rounded-sm bg-[#121212] border border-white/5 text-xs text-white/80">
                            <div className="flex justify-between text-[9px] font-mono-tech text-[#00f2ff] mb-0.5">
                              <span>{c.author}</span>
                              <span className="text-white/40">{c.time}</span>
                            </div>
                            <div>{c.text}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono-tech text-white/40">
                        No responses yet. Be the first to reply!
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="Write a peer response..."
                        className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="px-3.5 py-2 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-bold rounded-sm text-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Campus Live Widget & Quick Topics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick AI Prompts */}
          <div className="bg-[#121212] border border-white/[0.08] p-5 rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[2px]">
              <Sparkles className="w-4 h-4" />
              <span>COMPASS QUICK INQUIRIES</span>
            </div>
            <p className="text-xs text-white/60">
              Instantly resolve common queries with campus neural data:
            </p>
            <div className="space-y-1.5">
              {[
                'Find who has a Jetson Nano board to borrow today',
                'What is the grading split for Prof. Raman in ML?',
                'Who can tutor me in DSA tree balancing?',
                'Where are the best quiet study spots with AC?'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenQuickQuery(query)}
                  className="w-full text-left p-2.5 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-xs font-mono-tech text-white/80 hover:text-[#00f2ff] transition-all cursor-pointer"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* Departmental Bulletin */}
          <div className="bg-[#121212] border border-white/[0.08] p-5 rounded-sm space-y-3">
            <div className="text-xs font-mono-tech text-[#bc13fe] font-bold uppercase tracking-[2px] flex items-center justify-between">
              <span>CAMPUS CALENDAR ALERTS</span>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-2 text-xs font-mono-tech">
              <div className="p-2.5 rounded-sm bg-[#050505] border border-white/5">
                <div className="text-[#00f2ff] font-bold">SMART INDIA HACKATHON 2026</div>
                <div className="text-white/60 text-[10px] mt-0.5">Team registration closes Friday 11:59 PM</div>
              </div>
              <div className="p-2.5 rounded-sm bg-[#050505] border border-white/5">
                <div className="text-[#bc13fe] font-bold">ROBOTICS LAB SLOTS OPEN</div>
                <div className="text-white/60 text-[10px] mt-0.5">3D Printer & CNC reserve window live</div>
              </div>
              <div className="p-2.5 rounded-sm bg-[#050505] border border-white/5">
                <div className="text-white font-bold">MID-TERM SYLLABUS REPO</div>
                <div className="text-white/60 text-[10px] mt-0.5">Senior handwritten notes uploaded in Guides</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
