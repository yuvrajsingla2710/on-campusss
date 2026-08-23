import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  UserPlus, 
  Check, 
  Layers, 
  Rocket, 
  Heart, 
  RefreshCw, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { CampusNotification, UserProfile } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CampusNotification[];
  currentUser?: UserProfile;
  users?: UserProfile[];
  onAcceptFriendRequest: (notificationId: string, senderId: string) => void;
  onDeclineRequest: (notificationId: string) => void;
  onApproveBorrowRequest: (notificationId: string) => void;
  onAcceptProjectInvite: (notificationId: string) => void;
  onAcceptSkillSwap: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onOpenPassport?: (user: UserProfile) => void;
  onOpenDirectMessage?: (user: UserProfile) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUser,
  users = [],
  onAcceptFriendRequest,
  onDeclineRequest,
  onApproveBorrowRequest,
  onAcceptProjectInvite,
  onAcceptSkillSwap,
  onMarkAllAsRead,
  onOpenPassport,
  onOpenDirectMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'activity'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const requestsCount = notifications.filter((n) => 
    n.type === 'friend_request' || n.type === 'borrow_request' || n.type === 'project_invite' || n.type === 'skill_swap'
  ).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'requests') {
      return (
        n.type === 'friend_request' ||
        n.type === 'borrow_request' ||
        n.type === 'project_invite' ||
        n.type === 'skill_swap'
      );
    }
    if (activeFilter === 'activity') {
      return n.type === 'kudos' || n.type === 'marketplace_inquiry' || n.type === 'system';
    }
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-[#00f2ff]" />;
      case 'borrow_request':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'project_invite':
        return <Rocket className="w-4 h-4 text-[#c084fc]" />;
      case 'skill_swap':
        return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'kudos':
        return <Heart className="w-4 h-4 text-pink-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
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
        id="notifications-modal-card"
        className="relative w-full max-w-2xl bg-[#0b0c14] border border-white/15 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-white max-h-[90vh]"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#00f2ff]/20 via-[#c084fc]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between relative z-10 bg-[#0e0f1a]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Campus Notifications & Requests
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#00f2ff] text-black text-[11px] font-mono-tech font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 font-mono-tech">
                Friend connections, hardware loans, and squad invitations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs text-white/80 hover:text-white font-mono-tech transition-colors cursor-pointer border border-white/10"
              >
                Mark all read
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-white/[0.06] flex items-center justify-between gap-2 bg-[#0d0e17]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('requests')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'requests'
                  ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Requests ({requestsCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('activity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'activity'
                  ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Activity</span>
            </button>
          </div>

          <div className="text-[11px] font-mono-tech text-white/40 hidden md:flex items-center gap-1">
            <span>Profile:</span>
            {currentUser?.isPrivate ? (
              <span className="text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Private (Req Required)
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Public (Open Chat)
              </span>
            )}
          </div>
        </div>

        {/* Notifications Feed List */}
        <div className="p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-mono-tech space-y-2">
              <Bell className="w-8 h-8 mx-auto text-white/20" />
              <p className="text-sm">No notifications in this category right now.</p>
              <p className="text-xs text-white/30">You're all caught up on your campus connections!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isPending = notif.status === 'pending';
              const isAccepted = notif.status === 'accepted';
              const isDeclined = notif.status === 'declined';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 relative ${
                    !notif.read
                      ? 'bg-[#131522] border-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.06)]'
                      : 'bg-[#0f1019] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  {/* Unread indicator pip */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
                  )}

                  <div className="flex items-start gap-3.5">
                    {/* Sender Avatar or Icon */}
                    {notif.senderAvatar ? (
                      <div className="relative shrink-0">
                        <img
                          src={notif.senderAvatar}
                          alt={notif.senderName || 'Sender'}
                          className="w-11 h-11 rounded-xl object-cover border border-white/20"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#121420] border border-white/20 flex items-center justify-center">
                          {getNotificationIcon(notif.type)}
                        </div>
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white font-heading">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-mono-tech text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-white/70 font-sans mt-1 leading-relaxed">
                        {notif.description}
                      </p>

                      {/* Additional Metadata / Tags */}
                      {notif.meta?.projectName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/30 text-[11px] font-mono-tech text-[#c084fc]">
                          <Rocket className="w-3 h-3" />
                          <span>Project: {notif.meta.projectName}</span>
                        </div>
                      )}

                      {notif.meta?.itemName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono-tech text-emerald-300">
                          <Layers className="w-3 h-3" />
                          <span>Item: {notif.meta.itemName} ({notif.meta.daysRequested} Days)</span>
                        </div>
                      )}

                      {/* Action Buttons for Interactive Requests */}
                      {isPending && (
                        <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                          {/* FRIEND REQUEST ACCEPT */}
                          {notif.type === 'friend_request' && (
                            <>
                              <button
                                onClick={() => notif.senderId && onAcceptFriendRequest(notif.id, notif.senderId)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#00f2ff] hover:bg-[#38f6ff] text-black font-bold text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,242,255,0.25)]"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept & Connect</span>
                              </button>

                              <button
                                onClick={() => onDeclineRequest(notif.id)}
                                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono-tech transition-colors cursor-pointer border border-white/10"
                              >
                                Decline
                              </button>

                              {notif.meta?.userProfile && (
                                <button
                                  onClick={() => onOpenPassport(notif.meta!.userProfile!)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-[#00f2ff] text-xs font-mono-tech flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <span>View Passport</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          )}

                          {/* BORROW REQUEST APPROVE */}
                          {notif.type === 'borrow_request' && (
                            <>
                              <button
                                onClick={() => onApproveBorrowRequest(notif.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Loan (+10 Karma)</span>
                              </button>

                              <button
                                onClick={() => onDeclineRequest(notif.id)}
                                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono-tech transition-colors cursor-pointer border border-white/10"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {/* PROJECT INVITE / APPLICATION */}
                          {notif.type === 'project_invite' && (
                            <>
                              <button
                                onClick={() => onAcceptProjectInvite(notif.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#c084fc] hover:bg-[#d8b4fe] text-black font-bold text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(192,132,252,0.3)]"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept to Squad</span>
                              </button>

                              <button
                                onClick={() => onDeclineRequest(notif.id)}
                                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono-tech transition-colors cursor-pointer border border-white/10"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {/* SKILL SWAP MATCH */}
                          {notif.type === 'skill_swap' && (
                            <>
                              <button
                                onClick={() => onAcceptSkillSwap(notif.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirm Swap Session</span>
                              </button>

                              <button
                                onClick={() => onDeclineRequest(notif.id)}
                                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono-tech transition-colors cursor-pointer border border-white/10"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* STATUS DISPLAY AFTER ACTION */}
                      {isAccepted && (
                        <div className="mt-2.5 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Request Accepted & Connected</span>
                          </span>

                          {notif.type === 'friend_request' && notif.meta?.userProfile && onOpenDirectMessage && (
                            <button
                              onClick={() => onOpenDirectMessage(notif.meta!.userProfile!)}
                              className="px-2.5 py-1 rounded-lg bg-[#00f2ff]/20 hover:bg-[#00f2ff]/30 text-[#00f2ff] text-xs font-mono-tech flex items-center gap-1 border border-[#00f2ff]/40 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Message Friend</span>
                            </button>
                          )}
                        </div>
                      )}

                      {isDeclined && (
                        <div className="mt-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-red-400/80 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Request Declined</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0c0d16] flex items-center justify-between text-xs font-mono-tech text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
            <span>Zero-Knowledge Cryptographic Peer Audit</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
