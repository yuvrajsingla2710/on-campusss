import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Lock, 
  Globe, 
  UserPlus, 
  Check, 
  CheckCheck,
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Smile, 
  Paperclip, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Video, 
  ChevronLeft, 
  UserCheck, 
  Clock, 
  Zap, 
  Award, 
  Trash2,
  Share2,
  ExternalLink,
  Code2,
  BookOpen,
  Cpu,
  MapPin,
  Play,
  Pause,
  ArrowDown,
  X,
  PhoneOff
} from 'lucide-react';
import { UserProfile, DirectMessage } from '../types';

interface CampusChatSectionProps {
  users: UserProfile[];
  currentUser: UserProfile;
  messages: DirectMessage[];
  onSendMessage: (targetUserId: string, text: string) => void;
  onSendFriendRequest: (targetUserId: string) => void;
  onClearConversation?: (targetUserId: string) => void;
  onOpenPassport: (user: UserProfile) => void;
  selectedUserId?: string;
  onSelectUser?: (user: UserProfile) => void;
}

const CHAT_QUICK_PROMPTS = [
  '👋 Hey, are you free for a quick chat?',
  '📚 Can I borrow your lab notes or study guide?',
  '🚀 Interested in teaming up for the upcoming hackathon?',
  '⚡ Want to do a peer skill-swap session this week?',
  '🛠️ Is your hardware / lab gear available to borrow?',
  '☕ Free for a quick coffee at the campus food court?'
];

export const CampusChatSection: React.FC<CampusChatSectionProps> = ({
  users,
  currentUser,
  messages,
  onSendMessage,
  onSendFriendRequest,
  onClearConversation,
  onOpenPassport,
  selectedUserId,
  onSelectUser,
}) => {
  // Available peers who are NOT the current user
  const availablePeers = users.filter((u) => u.id !== currentUser.id);
  const defaultPeer = availablePeers[0] || users[0];

  // Active peer ID
  const [activePeerId, setActivePeerId] = useState<string>(() => {
    if (selectedUserId && selectedUserId !== currentUser.id && users.some((u) => u.id === selectedUserId)) {
      return selectedUserId;
    }
    return defaultPeer ? defaultPeer.id : 'u1';
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'recent' | 'friends' | 'public' | 'wing'>('all');
  
  // In-chat search
  const [isSearchingInChat, setIsSearchingInChat] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');

  // Input states
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Call simulation state
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Clear confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // References
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Sync external selectedUserId
  useEffect(() => {
    if (selectedUserId && selectedUserId !== currentUser.id && users.some((u) => u.id === selectedUserId)) {
      setActivePeerId(selectedUserId);
      setMobileView('chat');
    }
  }, [selectedUserId, currentUser.id, users]);

  // Keep activePeer valid
  const activePeer = users.find((u) => u.id === activePeerId) || defaultPeer || currentUser;

  // Filter conversation messages
  const conversation = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activePeer.id) ||
      (m.senderId === activePeer.id && m.receiverId === currentUser.id)
  );

  // In-chat searched messages
  const displayedConversation = inChatSearchQuery.trim()
    ? conversation.filter((m) =>
        m.text.toLowerCase().includes(inChatSearchQuery.toLowerCase())
      )
    : conversation;

  // Container-only smooth scroll: NEVER uses scrollIntoView which causes outer screen jumping!
  const scrollToBottom = (smooth = true) => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    // Only scroll within the chat container
    const timeout = setTimeout(() => {
      scrollToBottom(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [conversation.length, isTyping, activePeerId]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Call duration timer
  useEffect(() => {
    if (activeCallType) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCallType]);

  // Calculations for active peer
  const isFriend = (currentUser.friendIds || []).includes(activePeer.id);
  const isPrivate = !!activePeer.isPrivate;

  // Filter peers for left roster
  const filteredPeers = availablePeers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.hostelWing && u.hostelWing.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.skillsOffered && u.skillsOffered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (filterTab === 'friends') {
      return (currentUser.friendIds || []).includes(u.id);
    }
    if (filterTab === 'public') {
      return !u.isPrivate;
    }
    if (filterTab === 'wing') {
      return (
        currentUser.hostelWing &&
        u.hostelWing &&
        currentUser.hostelWing.split('(')[0].trim() === u.hostelWing.split('(')[0].trim()
      );
    }
    if (filterTab === 'recent') {
      return messages.some(
        (m) =>
          (m.senderId === u.id && m.receiverId === currentUser.id) ||
          (m.senderId === currentUser.id && m.receiverId === u.id)
      );
    }
    return true;
  });

  // Last message in thread
  const getLastMessageForPeer = (peerId: string) => {
    const peerMsgs = messages.filter(
      (m) =>
        (m.senderId === currentUser.id && m.receiverId === peerId) ||
        (m.senderId === peerId && m.receiverId === currentUser.id)
    );
    if (peerMsgs.length === 0) return null;
    return peerMsgs[peerMsgs.length - 1];
  };

  // Main send message handler
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text || !activePeer) return;

    onSendMessage(activePeer.id, text);
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    // Auto-focus input
    if (textInputRef.current) {
      textInputRef.current.focus();
    }

    // Trigger typing simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  const handleSelectPeer = (peer: UserProfile) => {
    setActivePeerId(peer.id);
    setMobileView('chat');
    setIsSearchingInChat(false);
    setInChatSearchQuery('');
    if (onSelectUser) onSelectUser(peer);
  };

  // Voice note send
  const handleFinishVoiceRecording = () => {
    if (recordingSeconds < 1) {
      setIsRecording(false);
      return;
    }
    const voiceMsg = `🎙️ [Voice Note • ${recordingSeconds}s] (High-Fidelity Audio Stream)`;
    handleSendMessage(voiceMsg);
    setIsRecording(false);
  };

  // Attachment send options
  const handleSendAttachment = (type: 'notes' | 'code' | 'gear' | 'location') => {
    setShowAttachmentMenu(false);
    let attachText = '';
    if (type === 'notes') {
      attachText = `📄 [Attached Document]: ${activePeer.department.split(',')[0]} Semester Notes & Lab Manual (PDF • 3.8 MB)`;
    } else if (type === 'code') {
      attachText = `💻 [Attached Code Snippet]:\n\`\`\`typescript\n// Campus Hub Controller\nexport const broadcastPeerSync = async () => {\n  console.log("Peer link verified");\n};\n\`\`\``;
    } else if (type === 'gear') {
      attachText = `🛠️ [Equipment Loan Request]: Casio fx-991EX Scientific Calculator & Breadboard Kit`;
    } else if (type === 'location') {
      attachText = `📍 [Campus Location Pin]: Central Library 2nd Floor Study Wing (Near Wi-Fi Hub 04)`;
    }
    handleSendMessage(attachText);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="chat" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#fbcfe8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#f472b6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/40 border border-pink-300/30 text-pink-200 text-xs font-mono-tech uppercase tracking-wider mb-4 shadow-[0_0_10px_rgba(251,207,232,0.1)]">
          <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
          <span>Real-Time P2P Network</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
          CAMPUS <span className="bg-gradient-to-r from-white via-pink-100 to-pink-300 bg-clip-text text-transparent">PEER CHATBOX</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans max-w-2xl mx-auto">
          Direct, interactive campus messaging. Connect with classmates across hostel wings, request lab equipment loans, coordinate hackathons, share notes, or swap skills instantly.
        </p>
      </div>

      {/* Responsive View Switcher (Visible on mobile/tablet screens < lg) */}
      <div className="lg:hidden mb-4 bg-[#141520] border border-zinc-800 rounded-2xl p-1.5 flex items-center gap-1.5 shadow-lg">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileView === 'list'
              ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_12px_rgba(251,207,232,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Peers ({availablePeers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('chat')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileView === 'chat'
              ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_12px_rgba(251,207,232,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="truncate">Chat: {activePeer.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* Main Dual-Pane Chatbox Container */}
      <div 
        id="campus-chatbox-main"
        className="w-full bg-[#12131b] border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] h-[720px] max-h-[85vh] relative backdrop-blur-2xl"
      >
        {/* ======================================================== */}
        {/* LEFT PANEL: Student Contact Directory & Threads (4 Cols) */}
        {/* ======================================================== */}
        <div 
          className={`lg:col-span-4 lg:border-r border-zinc-800 flex flex-col min-h-0 bg-[#0e0f16] h-full ${
            mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Active Peer Quick Banner on mobile roster */}
          <div className="lg:hidden p-2.5 bg-pink-950/20 border-b border-pink-300/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-sans text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active: <strong className="text-pink-200">{activePeer.name}</strong></span>
            </div>
            <button
              onClick={() => setMobileView('chat')}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 text-[11px] font-mono-tech font-bold hover:brightness-105 cursor-pointer"
            >
              Open Chatbox 💬
            </button>
          </div>

          {/* Left Top: Current User Identity & Search */}
          <div className="p-4 border-b border-zinc-800 bg-[#12131d]/90 backdrop-blur-md shrink-0">
            {/* Current user banner */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover border border-pink-300/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0e0f16] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[130px] font-heading">{currentUser.name}</span>
                    <span className="text-[9px] font-mono-tech text-pink-200 px-1 py-0.2 rounded bg-pink-950/40 border border-pink-300/20">#{currentUser.rank}</span>
                  </div>
                  <div className="text-[10px] font-mono-tech text-zinc-400 flex items-center gap-1">
                    {currentUser.isPrivate ? (
                      <span className="text-amber-300 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Globe className="w-2.5 h-2.5" /> Public
                      </span>
                    )}
                    <span>• {currentUser.hostelWing ? currentUser.hostelWing.split('(')[0] : 'Campus'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenPassport(currentUser)}
                className="text-[11px] font-mono-tech px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
                title="View your student passport"
              >
                My ID
              </button>
            </div>

            {/* Peer Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peers, wings, skills..."
                className="w-full bg-[#181926] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-300/60 transition-colors font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono-tech">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_8px_rgba(251,207,232,0.3)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-750'
                }`}
              >
                All ({availablePeers.length})
              </button>

              <button
                onClick={() => setFilterTab('friends')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                  filterTab === 'friends'
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_8px_rgba(251,207,232,0.3)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-750'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                Friends ({(currentUser.friendIds || []).length})
              </button>

              <button
                onClick={() => setFilterTab('recent')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                  filterTab === 'recent'
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_8px_rgba(251,207,232,0.3)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-750'
                }`}
              >
                <Clock className="w-3 h-3" />
                Recent
              </button>

              <button
                onClick={() => setFilterTab('public')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                  filterTab === 'public'
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_8px_rgba(251,207,232,0.3)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-750'
                }`}
              >
                <Globe className="w-3 h-3" />
                Public
              </button>

              <button
                onClick={() => setFilterTab('wing')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                  filterTab === 'wing'
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_8px_rgba(251,207,232,0.3)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-750'
                }`}
              >
                <Building2 className="w-3 h-3" />
                Hostel
              </button>
            </div>
          </div>

          {/* Student Peer List Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-zinc-800/60 p-2 space-y-1 custom-scrollbar">
            {filteredPeers.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono-tech text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p>No peers found matching your filter.</p>
              </div>
            ) : (
              filteredPeers.map((peer) => {
                const isSelected = peer.id === activePeer.id;
                const lastMsg = getLastMessageForPeer(peer.id);
                const isPeerFriend = (currentUser.friendIds || []).includes(peer.id);
                const isPeerPrivate = !!peer.isPrivate;

                return (
                  <div
                    key={peer.id}
                    onClick={() => handleSelectPeer(peer)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-pink-950/30 border border-pink-300/40 shadow-[0_0_15px_rgba(251,207,232,0.12)]'
                        : 'hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    {/* Avatar with rank & online badge */}
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className={`w-11 h-11 rounded-2xl object-cover border transition-all ${
                          isSelected ? 'border-pink-300' : 'border-zinc-700 group-hover:border-zinc-500'
                        }`}
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-[#12131d] border border-zinc-700 text-pink-200 text-[9px] font-mono-tech font-bold">
                        #{peer.rank}
                      </span>
                    </div>

                    {/* Peer details & last message preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`text-xs font-bold font-heading truncate ${isSelected ? 'text-pink-200' : 'text-white'}`}>
                            {peer.name}
                          </span>
                          <ShieldCheck className="w-3 h-3 text-pink-300 shrink-0" />
                        </div>
                        {lastMsg && (
                          <span className="text-[10px] font-mono-tech text-zinc-500 whitespace-nowrap shrink-0">
                            {lastMsg.timestamp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono-tech text-zinc-400 mb-1">
                        <span className="truncate max-w-[130px]">{peer.department.split(',')[0]}</span>
                        <span>•</span>
                        {isPeerPrivate ? (
                          <span className="text-amber-300 flex items-center gap-0.5 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Private
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-0.5 shrink-0">
                            <Globe className="w-2.5 h-2.5" /> Public
                          </span>
                        )}
                      </div>

                      {/* Message preview or skill tags */}
                      {lastMsg ? (
                        <p className={`text-xs truncate ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`}>
                          {lastMsg.senderId === currentUser.id ? 'You: ' : ''}
                          {lastMsg.text}
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-500 truncate">
                          Skills: {peer.skillsOffered && peer.skillsOffered.length > 0 ? peer.skillsOffered.slice(0, 2).join(', ') : 'Peer Exchange'}
                        </p>
                      )}
                    </div>

                    {/* Friend connected dot */}
                    {isPeerFriend && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-3 right-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]" title="Connected Friend" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Active Conversation & Interactive Chat (8 Cols) */}
        {/* ======================================================== */}
        <div 
          className={`lg:col-span-8 flex flex-col h-full min-h-0 bg-[#101119] relative ${
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Simulated P2P Call Banner */}
          {activeCallType && (
            <div className="p-3 bg-gradient-to-r from-pink-950/80 to-zinc-900/90 border-b border-pink-300/30 text-white flex items-center justify-between z-30 shadow-2xl animate-in slide-in-from-top">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-950/60 border border-pink-300 flex items-center justify-center animate-pulse">
                  {activeCallType === 'video' ? <Video className="w-4 h-4 text-pink-300" /> : <PhoneCall className="w-4 h-4 text-pink-300" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{activeCallType === 'video' ? 'Campus P2P Video Call' : 'Encrypted Campus Audio Stream'} with {activePeer.name}</span>
                    <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">CONNECTED</span>
                  </div>
                  <div className="text-[10px] font-mono-tech text-zinc-400">
                    Duration: {formatTimer(callDuration)} • WebRTC P2P Latency: 12ms
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveCallType(null)}
                className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </button>
            </div>
          )}

          {/* Chat Window Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#141521]/95 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              {/* Mobile Back button */}
              <button
                onClick={() => setMobileView('list')}
                className="lg:hidden p-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Active Peer Avatar */}
              <div 
                onClick={() => onOpenPassport(activePeer)}
                className="relative cursor-pointer group shrink-0"
                title="Click to view student passport"
              >
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-pink-300/50 group-hover:border-pink-300 transition-all"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 text-[9px] font-mono-tech font-bold">
                  #{activePeer.rank}
                </span>
              </div>

              {/* Active Peer Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 
                    onClick={() => onOpenPassport(activePeer)}
                    className="text-base font-bold text-white font-heading cursor-pointer hover:text-pink-200 transition-colors"
                  >
                    {activePeer.name}
                  </h3>
                  <span className="text-[10px] font-mono-tech text-pink-200 px-2 py-0.5 rounded-full bg-pink-950/50 border border-pink-300/30">
                    {activePeer.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech mt-0.5">
                  <span className="text-zinc-400">{activePeer.department}</span>
                  <span className="text-zinc-600">•</span>
                  {activePeer.hostelWing && (
                    <>
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-500" />
                        {activePeer.hostelWing}
                      </span>
                      <span className="text-zinc-600">•</span>
                    </>
                  )}
                  {isPrivate ? (
                    <span className="text-amber-300 flex items-center gap-1 text-[11px]">
                      <Lock className="w-3 h-3" /> Private Peer ID
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Globe className="w-3 h-3" /> Public Messaging Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              {/* Call Simulation Buttons */}
              <button
                onClick={() => setActiveCallType('audio')}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-pink-950/40 text-zinc-300 hover:text-pink-200 border border-zinc-700 transition-colors cursor-pointer"
                title="Start Encrypted Campus Audio Call"
              >
                <PhoneCall className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveCallType('video')}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-pink-950/40 text-zinc-300 hover:text-pink-200 border border-zinc-700 transition-colors cursor-pointer"
                title="Start Campus Video Call"
              >
                <Video className="w-4 h-4" />
              </button>

              {/* Search Inside Chat */}
              <button
                onClick={() => setIsSearchingInChat(!isSearchingInChat)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isSearchingInChat
                    ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 border-pink-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700'
                }`}
                title="Search conversation messages"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Clear Thread */}
              {onClearConversation && conversation.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-700 transition-colors cursor-pointer"
                  title="Clear conversation messages"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* View Passport */}
              <button
                onClick={() => onOpenPassport(activePeer)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono-tech px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-pink-300" />
                <span>Passport</span>
              </button>
            </div>
          </div>

          {/* In-Chat Search Bar */}
          {isSearchingInChat && (
            <div className="p-2.5 bg-[#141521] border-b border-zinc-800 flex items-center gap-2 px-4 animate-in fade-in duration-150">
              <Search className="w-3.5 h-3.5 text-pink-300" />
              <input
                type="text"
                value={inChatSearchQuery}
                onChange={(e) => setInChatSearchQuery(e.target.value)}
                placeholder={`Search words in chat with ${activePeer.name}...`}
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none font-sans"
                autoFocus
              />
              {inChatSearchQuery && (
                <span className="text-[10px] font-mono-tech text-zinc-400">
                  {displayedConversation.length} matches
                </span>
              )}
              <button
                onClick={() => {
                  setIsSearchingInChat(false);
                  setInChatSearchQuery('');
                }}
                className="text-zinc-400 hover:text-white text-xs p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clear Conversation Confirmation Modal */}
          {showClearConfirm && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-[#181926] border border-zinc-700 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-heading">Clear Conversation?</h4>
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    This will remove the current message history between you and <strong>{activePeer.name}</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono-tech transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onClearConversation) onClearConversation(activePeer.id);
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-mono-tech font-bold transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Conversation Stream Container */}
          <div 
            ref={chatMessagesContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar"
          >
            {/* Security and encryption notice */}
            <div className="flex justify-center mb-2">
              <div className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono-tech flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-pink-300" />
                <span>Verified On-Campus Peer Link • Student ID Protected</span>
              </div>
            </div>

            {displayedConversation.length === 0 ? (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-pink-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-heading">Start a conversation with {activePeer.name}</p>
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    Send a message below, record a voice note, or pick from quick campus prompts.
                  </p>
                </div>
              </div>
            ) : (
              displayedConversation.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isVoiceNote = msg.text.startsWith('🎙️ [Voice Note');
                const isAttachment = msg.text.startsWith('📄 [Attached') || msg.text.startsWith('💻 [Attached') || msg.text.startsWith('🛠️ [Equipment') || msg.text.startsWith('📍 [Campus');

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={activePeer.avatar}
                        alt={activePeer.name}
                        className="w-8 h-8 rounded-xl object-cover border border-zinc-700 self-end mb-1 shrink-0"
                      />
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs sm:text-sm font-sans ${
                        isMe
                          ? 'bg-pink-950/40 border border-pink-300/40 text-white rounded-br-none shadow-[0_0_15px_rgba(251,207,232,0.08)]'
                          : 'bg-[#181926] border border-zinc-800 text-zinc-100 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-[10px] font-mono-tech text-zinc-400">
                          {isMe ? 'You' : activePeer.name}
                        </span>
                        <span className="text-[9px] font-mono-tech text-zinc-500">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Voice Note Rendering */}
                      {isVoiceNote ? (
                        <div className="flex items-center gap-3 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (playingVoiceId === msg.id) {
                                setPlayingVoiceId(null);
                              } else {
                                setPlayingVoiceId(msg.id);
                                setTimeout(() => setPlayingVoiceId(null), 4000);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-4 h-4 fill-zinc-950" />
                            ) : (
                              <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-0.5 h-5">
                              {[12, 24, 16, 28, 10, 22, 32, 18, 26, 14, 20, 16, 24, 10].map((h, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${h}px` }}
                                  className={`w-1 rounded-full transition-colors ${
                                    playingVoiceId === msg.id
                                      ? 'bg-pink-300 animate-pulse'
                                      : 'bg-zinc-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-[10px] font-mono-tech text-pink-300">
                              {playingVoiceId === msg.id ? 'Playing Voice Stream...' : 'Voice Note'}
                            </div>
                          </div>
                        </div>
                      ) : isAttachment ? (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1 font-mono-tech text-xs">
                          <p className="leading-relaxed whitespace-pre-wrap text-pink-200">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {isMe && (
                        <div className="flex justify-end mt-1 text-[9px] font-mono-tech text-pink-300 items-center gap-0.5">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-8 h-8 rounded-xl object-cover border border-zinc-700 shrink-0"
                />
                <div className="bg-[#181926] border border-zinc-800 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-[11px] font-mono-tech text-pink-300">{activePeer.name} is typing</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Recording Active Bar */}
          {isRecording && (
            <div className="p-3 bg-red-950/80 border-t border-red-500/30 flex items-center justify-between px-4 animate-in slide-in-from-bottom">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono-tech text-red-200">
                  Recording Voice Note: <strong>{formatTimer(recordingSeconds)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecording(false)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono-tech cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinishVoiceRecording}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Audio</span>
                </button>
              </div>
            </div>
          )}

          {/* Message Input Control Bar */}
          <div className="p-3 sm:p-4 bg-[#12131d] border-t border-zinc-800 shrink-0 sticky bottom-0 z-20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 relative"
            >
              {/* Attachment Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentMenu(!showAttachmentMenu);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                  title="Share File, Code, or Location"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {showAttachmentMenu && (
                  <div className="absolute bottom-12 left-0 w-56 p-2 bg-[#181926] border border-zinc-700 rounded-2xl shadow-2xl space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('notes')}
                      className="w-full p-2 rounded-xl hover:bg-zinc-800 text-left text-xs text-zinc-200 hover:text-pink-300 flex items-center gap-2 font-mono-tech transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-pink-300" />
                      <span>Share Study Notes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('code')}
                      className="w-full p-2 rounded-xl hover:bg-zinc-800 text-left text-xs text-zinc-200 hover:text-pink-300 flex items-center gap-2 font-mono-tech transition-colors cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-pink-300" />
                      <span>Share Code Snippet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('gear')}
                      className="w-full p-2 rounded-xl hover:bg-zinc-800 text-left text-xs text-zinc-200 hover:text-pink-300 flex items-center gap-2 font-mono-tech transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-pink-300" />
                      <span>Request Lab Gear</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAttachment('location')}
                      className="w-full p-2 rounded-xl hover:bg-zinc-800 text-left text-xs text-zinc-200 hover:text-pink-300 flex items-center gap-2 font-mono-tech transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-pink-300" />
                      <span>Share Campus Pin</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Emoji Quick Picker Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachmentMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                  title="Quick Reactions"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 p-2 bg-[#181926] border border-zinc-700 rounded-2xl shadow-2xl flex items-center gap-1.5 z-30 animate-in fade-in slide-in-from-bottom-2">
                    {['👍', '🚀', '🔥', '🎉', '💡', '❤️', '👏', '⚡', '☕', '📚'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                          if (textInputRef.current) textInputRef.current.focus();
                        }}
                        className="p-1.5 text-base hover:scale-125 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Note Trigger */}
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 transition-colors cursor-pointer"
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Main Text Input */}
              <input
                ref={textInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${activePeer.name}...`}
                className="flex-1 bg-[#181926] border border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-300/70 transition-all font-sans"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`px-4 sm:px-5 py-3 rounded-2xl font-bold font-mono-tech text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputText.trim()
                    ? 'bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 text-zinc-950 shadow-[0_0_12px_rgba(251,207,232,0.25)] hover:brightness-105'
                    : 'bg-zinc-800 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
