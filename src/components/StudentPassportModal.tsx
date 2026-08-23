import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  Zap, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Building2, 
  Mail, 
  Edit3, 
  Lock,
  Globe,
  UserPlus,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface StudentPassportModalProps {
  user: UserProfile | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onGiveKudos: (userId: string) => void;
  onOpenEditProfile?: () => void;
  onOpenDirectMessage?: (user: UserProfile) => void;
  onSendFriendRequest?: (userId: string) => void;
  onTogglePrivacy?: (userId: string) => void;
}

export const StudentPassportModal: React.FC<StudentPassportModalProps> = ({
  user,
  currentUser,
  isOpen,
  onClose,
  onGiveKudos,
  onOpenEditProfile,
  onOpenDirectMessage,
  onSendFriendRequest,
  onTogglePrivacy,
}) => {
  const [kudosSent, setKudosSent] = useState(false);
  const [requestSentLocally, setRequestSentLocally] = useState(false);

  if (!isOpen || !user) return null;

  const isOwnProfile = user.id === currentUser?.id;
  const isPrivate = !!user.isPrivate;
  const isFriend = (currentUser?.friendIds || []).includes(user.id);
  const isPendingFriendRequest = 
    (currentUser?.outgoingFriendRequestUserIds || []).includes(user.id) ||
    requestSentLocally;

  const handleKudos = () => {
    if (kudosSent) return;
    setKudosSent(true);
    onGiveKudos(user.id);
  };

  const handleFriendRequest = () => {
    setRequestSentLocally(true);
    if (onSendFriendRequest) {
      onSendFriendRequest(user.id);
    }
  };

  const handleMessageClick = () => {
    if (onOpenDirectMessage) {
      onOpenDirectMessage(user);
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
        id="student-passport-modal-card"
        className="relative w-full max-w-2xl bg-[#0b0c12] border border-white/15 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-white"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#00f2ff]/20 via-[#c084fc]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between relative z-10 bg-[#0e0f18]/80">
          <div className="flex items-center gap-2 text-[11px] font-mono-tech tracking-[2px] text-[#00f2ff]">
            <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
            <span>VERIFIED ZERO-KNOWLEDGE STUDENT PASSPORT</span>
          </div>

          <button
            id="passport-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.15] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar relative z-10">
          
          {/* Main ID Badge Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-gradient-to-r from-[#141622] to-[#181a28] p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#00f2ff]/60 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                />
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#00f2ff] text-black font-mono-tech font-bold text-[10px] shadow-md">
                  #{user.rank}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-heading">{user.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-[#00f2ff]" />
                </div>
                <div className="text-xs text-[#00f2ff] font-mono-tech mt-0.5">{user.title}</div>
                <div className="text-xs text-white/60 font-mono-tech mt-0.5">{user.department} • {user.year}</div>
                
                {/* Privacy Badge & Hostel */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div className="text-[11px] text-white/50 font-mono-tech flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-white/40" />
                    <span>{user.hostelWing || 'North Block (H4)'}</span>
                  </div>

                  {/* Public / Private Status Pill */}
                  {isPrivate ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono-tech text-amber-300 font-bold">
                      <Lock className="w-3 h-3" /> Private Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono-tech text-emerald-300 font-bold">
                      <Globe className="w-3 h-3" /> Public Profile
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 sm:self-center">
              <div className="font-mono-tech bg-[#0a0a0f] p-3 rounded-xl border border-white/10 text-left sm:text-right">
                <div className="text-[10px] text-white/40 uppercase">Total Karma</div>
                <div className="text-2xl font-black text-white">{user.impactScore} <span className="text-xs text-[#00f2ff]">PTS</span></div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Top {Math.min(10, user.rank * 2)}% on Campus</div>
              </div>

              {isOwnProfile && onTogglePrivacy && (
                <button
                  onClick={() => onTogglePrivacy(user.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
                    isPrivate 
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                  title="Click to toggle Public / Private Profile status"
                >
                  {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>{isPrivate ? 'Set to Public' : 'Set to Private'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Privacy Note Banner */}
          {isPrivate ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs font-mono-tech text-amber-200/90">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Private Profile Mode:</strong> Direct messaging is restricted to accepted friends. Send a friend request to unlock direct communication.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs font-mono-tech text-emerald-200/90">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  <strong>Public Profile Mode:</strong> Direct peer messaging is open to all registered students without requiring a friend request.
                </span>
              </div>
            </div>
          )}

          {/* Bio statement */}
          <div className="p-4 rounded-xl bg-[#12131c] border border-white/5 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
            "{user.bio}"
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
            <div className="p-3.5 rounded-xl bg-[#12131c] border border-white/5 space-y-1">
              <div className="text-[10px] text-[#00f2ff] flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>KNOWLEDGE</span>
              </div>
              <div className="text-xl font-bold text-white">{user.knowledgeScore}</div>
              <div className="text-[10px] text-white/40">{user.notesShared || 24} Course Notes</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12131c] border border-white/5 space-y-1">
              <div className="text-[10px] text-[#c084fc] flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>SKILLS</span>
              </div>
              <div className="text-xl font-bold text-white">{user.skillScore}</div>
              <div className="text-[10px] text-white/40">{user.mentorHours || 35} Mentoring Hrs</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12131c] border border-white/5 space-y-1">
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>RESOURCES</span>
              </div>
              <div className="text-xl font-bold text-white">{user.resourceScore}</div>
              <div className="text-[10px] text-white/40">{user.itemsLent || 18} Hardware Loans</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12131c] border border-white/5 space-y-1">
              <div className="text-[10px] text-rose-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>PROJECTS</span>
              </div>
              <div className="text-xl font-bold text-white">{user.projectScore}</div>
              <div className="text-[10px] text-white/40">5 Active Repos</div>
            </div>
          </div>

          {/* Badges & Accolades */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider">
              Earned Campus Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {(user.badges || ['Verified Peer', 'Top Lender', 'Course TA']).map((b) => (
                <span 
                  key={b}
                  className="px-3 py-1.5 rounded-xl bg-[#161826] border border-white/10 text-xs font-mono-tech text-[#00f2ff] flex items-center gap-1.5 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Skills Offered & Wanted */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#12131c] border border-white/5 space-y-2">
              <div className="text-[11px] font-mono-tech text-emerald-400 uppercase">Teaches / Mentors</div>
              <div className="flex flex-wrap gap-1.5">
                {(user.skillsOffered || []).map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono-tech">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#12131c] border border-white/5 space-y-2">
              <div className="text-[11px] font-mono-tech text-[#c084fc] uppercase">Looking to Learn</div>
              <div className="flex flex-wrap gap-1.5">
                {(user.skillsWanted || []).map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-mono-tech">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ZK Cryptographic Proof Bar */}
          <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-tech text-white/60">
            <div>
              <div className="text-[10px] text-white/40 uppercase">Verified On-Chain Hash</div>
              <div className="text-white font-mono-tech">{user.verifiedHash || '0x7b4a8e2...c91d'}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ZK Authenticated</span>
              </span>
            </div>
          </div>

          {/* Bottom Actions based on Ownership & Privacy */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {!isOwnProfile ? (
              <>
                <button
                  onClick={handleKudos}
                  className={`flex-1 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-mono-tech ${
                    kudosSent
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(244,114,182,0.4)]'
                  }`}
                >
                  <Heart className="w-4 h-4 text-pink-300" />
                  <span>{kudosSent ? 'Kudos Sent (+5 Karma Awarded!)' : 'Send Kudos (+5 Karma)'}</span>
                </button>

                {/* Primary Messaging / Friend Request Action */}
                {isPrivate && !isFriend ? (
                  /* PRIVATE & NOT FRIENDS -> Must Send Friend Request */
                  isPendingFriendRequest ? (
                    <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold font-mono-tech flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>Friend Request Pending</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleFriendRequest}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#38bdf8] hover:from-[#38f6ff] hover:to-[#0284c7] text-black text-xs font-bold font-mono-tech flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:scale-105"
                      title="Send friend request to unlock messaging with this private profile"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Send Friend Request</span>
                    </button>
                  )
                ) : (
                  /* PUBLIC OR ACCEPTED FRIENDS -> Direct Message Unlocked */
                  <button
                    onClick={handleMessageClick}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00f2ff] hover:bg-[#38f6ff] text-black text-xs font-bold font-mono-tech flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isFriend ? 'Message Friend' : 'Direct Message'}</span>
                  </button>
                )}

                <a
                  href={`mailto:${user.contactEmail || 'peer@campus.edu'}`}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all font-mono-tech"
                >
                  <Mail className="w-4 h-4 text-[#00f2ff]" />
                  <span>Email</span>
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenEditProfile) onOpenEditProfile();
                  }}
                  className="flex-1 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-mono-tech bg-[#00f2ff] hover:bg-[#38f6ff] text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile & Preferences</span>
                </button>

                {onTogglePrivacy && (
                  <button
                    onClick={() => onTogglePrivacy(user.id)}
                    className={`w-full sm:w-auto px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all font-mono-tech cursor-pointer ${
                      isPrivate
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {isPrivate ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>Switch to {isPrivate ? 'Public' : 'Private'}</span>
                  </button>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
