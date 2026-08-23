import React, { useState } from 'react';
import { PulsePost } from '../types';
import { ShareData } from './ShareModal';
import { 
  Radio, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Plus, 
  Tag, 
  Send,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CampusPulseSectionProps {
  posts: PulsePost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreatePost: () => void;
  onOpenShare?: (data: ShareData) => void;
}

export const CampusPulseSection: React.FC<CampusPulseSectionProps> = ({
  posts,
  onToggleLike,
  onAddComment,
  onOpenCreatePost,
  onOpenShare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Projects', 'Events', 'Academic', 'Discussions', 'Sports'];

  const filteredPosts = posts.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = (post: PulsePost) => {
    const postUrl = `${window.location.origin}/pulse/${post.id}`;
    const sharePayload: ShareData = {
      title: `${post.author} on Campus OS Pulse (${post.category})`,
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
    <section id="pulse" className="py-28 border-b border-zinc-800 relative bg-[#0d0e13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal font-heading">
              Campus Pulse
            </h2>
            <p className="text-zinc-400 mt-2 text-base sm:text-lg max-w-xl font-normal">
              What's happening right now across university branches. Real-time updates, study groups, hackathons, and announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="pulse-create-post-btn"
              onClick={onOpenCreatePost}
              className="px-6 py-3 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 hover:brightness-105 text-zinc-950 font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-[0_2px_16px_rgba(251,207,232,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Share Update</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap uppercase ${
                selectedCategory === cat
                  ? 'bg-pink-950/40 border border-pink-300/40 text-pink-200 font-bold shadow-[0_0_12px_rgba(251,207,232,0.15)]'
                  : 'bg-[#14151f] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Responsive Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              id={`pulse-post-${post.id}`}
              className="p-6 rounded-2xl bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Author & Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white font-mono-tech">
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5 font-heading">
                        <span>{post.author}</span>
                        {post.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-950/50 border border-pink-300/30 text-[9px] font-mono-tech text-pink-200 uppercase font-bold">
                            {post.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono-tech text-zinc-400">
                        {post.authorDepartment || 'Campus Member'} • {post.timestamp}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-tech text-zinc-400 px-3 py-1 rounded-full bg-[#1c1d29] border border-zinc-800 uppercase">
                    {post.category}
                  </span>
                </div>

                {/* Post Body */}
                <p className="text-sm text-zinc-200 leading-relaxed my-3 font-normal">
                  {post.text}
                </p>
              </div>

              {/* Action Buttons: Like, Comment, Share */}
              <div className="pt-4 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.isLiked ? 'text-pink-300 font-bold' : 'hover:text-pink-300'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.isLiked ? 'fill-pink-300 text-pink-300' : ''
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 hover:text-pink-200 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-pink-950/40 hover:text-pink-200 transition-all cursor-pointer border border-zinc-700/80 hover:border-pink-300/40 text-zinc-300"
                  title="Share to WhatsApp, Telegram, X, etc."
                >
                  {copiedId === post.id ? (
                    <span className="text-pink-300 text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied!
                    </span>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-pink-300" />
                      <span className="text-[11px] font-mono-tech">Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Collapsible Comment Box */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-[#1a1b26] border border-zinc-800 text-xs text-zinc-200"
                        >
                          <div className="flex justify-between text-[10px] font-mono-tech text-pink-200 mb-1">
                            <span>{c.author}</span>
                            <span className="text-zinc-400">{c.time}</span>
                          </div>
                          <div>{c.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      placeholder="Write a response..."
                      className="flex-1 px-4 py-2 bg-[#1a1b26] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-pink-300 font-mono-tech placeholder-zinc-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-200 to-rose-200 hover:brightness-105 text-zinc-950 font-bold rounded-xl text-xs cursor-pointer"
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
    </section>
  );
};
