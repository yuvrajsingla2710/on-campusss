import React, { useState } from 'react';
import { PulsePost } from '../types';
import { X, Radio, Send, CheckCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: Omit<PulsePost, 'id' | 'likesCount' | 'commentsCount' | 'timestamp' | 'comments'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<PulsePost['category']>('Projects');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onCreatePost({
      author: 'You (Campus Member)',
      authorDepartment: 'Verified Student',
      badge: 'CONTRIBUTOR',
      text: text.trim(),
      category,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setText('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#090C12] border border-cyan-400/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              BROADCAST TO CAMPUS PULSE
            </h2>
            <p className="text-xs font-mono-tech text-cyan-400">
              Share updates, ask questions, or announce club activities.
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-center font-mono-tech text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <div>Broadcast dispatched to campus feed!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                TOPIC CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              >
                <option value="Projects">Projects</option>
                <option value="Events">Events</option>
                <option value="Academic">Academic</option>
                <option value="Discussions">Discussions</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                YOUR CAMPUS PULSE MESSAGE
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's happening? e.g. Open hack night at Innovation Lab tonight at 8 PM..."
                rows={4}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST NOW (+10 IMPACT)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
