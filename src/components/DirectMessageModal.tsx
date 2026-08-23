import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  Globe, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  Building2, 
  Maximize2,
  CheckCheck
} from 'lucide-react';
import { UserProfile, DirectMessage } from '../types';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserProfile | null;
  currentUser: UserProfile;
  messages: DirectMessage[];
  onSendMessage: (targetUserId: string, text: string) => void;
  onSendFriendRequest: (targetUserId: string) => void;
  onOpenPassport?: (user: UserProfile) => void;
  onOpenInPageChat?: (user: UserProfile) => void;
}

const QUICK_CAMPUS_PROMPTS = [
  'Hey! Are you open to collaborating on a project?',
  'Hi! Saw your verified notes, would love to ask a quick question.',
  'Hey, is the lab equipment still available to borrow?',
  'Hi! Would you be up for a skill swap session this week?'
];

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  messages,
  onSendMessage,
  onOpenPassport,
  onOpenInPageChat,
}) => {
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat container to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages.length, isOpen]);

  if (!isOpen || !targetUser) return null;

  const isPrivate = !!targetUser.isPrivate;

  // Filter messages between currentUser and targetUser
  const conversation = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === targetUser.id) ||
      (m.senderId === targetUser.id && m.receiverId === currentUser.id)
  );

  const handleSend = (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (directText !== undefined ? directText : inputText).trim();
    if (!textToSend) return;
    onSendMessage(targetUser.id, textToSend);
    setInputText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="direct-message-modal-card"
        className="relative w-full max-w-xl bg-[#0b0c14] border border-white/15 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-white h-[85vh] max-h-[640px]"
      >
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#00f2ff]/20 via-[#c084fc]/10 to-transparent blur-xl pointer-events-none" />

        {/* Top Chat Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between relative z-10 bg-[#0e0f1a]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onOpenPassport && onOpenPassport(targetUser)}
              className="relative cursor-pointer group shrink-0"
              title="Click to view full Student Passport"
            >
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-[#00f2ff]/50 group-hover:border-[#00f2ff] transition-all"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#00f2ff] text-black text-[9px] font-mono-tech font-bold">
                #{targetUser.rank}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 
                  onClick={() => onOpenPassport && onOpenPassport(targetUser)}
                  className="text-base font-bold text-white font-heading cursor-pointer hover:text-[#00f2ff] transition-colors"
                >
                  {targetUser.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-tech mt-0.5">
                <span className="text-white/60">{targetUser.department}</span>
                <span className="text-white/30">•</span>
                {isPrivate ? (
                  <span className="text-amber-300 flex items-center gap-1 text-[11px]">
                    <Lock className="w-3 h-3" /> Private Peer ID
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <Globe className="w-3 h-3" /> Public Profile
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenInPageChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInPageChat(targetUser);
                }}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-cyan-500/20 text-white/70 hover:text-[#00f2ff] flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="Expand to Full Campus Chat Section"
                aria-label="Open Full Campus Chat Section"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              aria-label="Close direct messaging"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messaging Area */}
        <div 
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar flex flex-col justify-between"
        >
          {/* Top Profile Summary Badge */}
          <div className="p-3 rounded-2xl bg-[#121422] border border-white/5 flex items-center justify-between text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-white/70">
              <Building2 className="w-3.5 h-3.5 text-[#00f2ff]" />
              <span>{targetUser.hostelWing || 'Campus Resident'}</span>
            </div>
            <div className="text-[#00f2ff]">
              Impact: {targetUser.impactScore} PTS
            </div>
          </div>

          {/* Open Chat History */}
          <div className="flex-1 space-y-3 overflow-y-auto py-2">
            {conversation.length === 0 ? (
              <div className="py-10 text-center text-white/40 font-mono-tech space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-white/20" />
                <p className="text-xs">Start of your direct peer chat with {targetUser.name}.</p>
                <p className="text-[11px] text-[#00f2ff]/70">
                  {isPrivate ? '🔒 Encrypted Direct Channel' : '🌐 Verified Campus Messaging'}
                </p>
              </div>
            ) : (
              conversation.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed ${
                        isMine
                          ? 'bg-[#00f2ff] text-black font-medium rounded-br-none shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                          : 'bg-[#181a29] text-white border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] font-mono-tech text-white/40">
                        {msg.timestamp}
                      </span>
                      {isMine && (
                        <CheckCheck className="w-3 h-3 text-[#00f2ff]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Prompts */}
          {conversation.length === 0 && (
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono-tech text-white/40 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00f2ff]" />
                <span>Suggested quick messages:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CAMPUS_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(undefined, prompt)}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] hover:border-[#00f2ff]/30 text-white/70 hover:text-white border border-white/5 transition-colors cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSend}
          className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0e0f1a] flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${targetUser.name.split(' ')[0]} directly...`}
            className="flex-1 px-4 py-2.5 bg-[#141625] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#00f2ff] font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-2xl bg-[#00f2ff] hover:bg-[#38f6ff] disabled:opacity-30 text-black font-bold text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,242,255,0.3)] shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
