import React, { useState, useRef, useEffect } from 'react';
import { CompassMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  X, 
  Minimize2, 
  Maximize2, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Zap, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { CompassStarIcon } from './BrandLogos';

interface FloatingCompassWidgetProps {
  messages: CompassMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSelectActionCard?: (action: string, targetId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingCompassWidget: React.FC<FloatingCompassWidgetProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectActionCard,
  isOpen,
  onToggle,
}) => {
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMsgLengthRef = useRef(messages.length);

  const presets = [
    'Where can I borrow a calculator today?',
    'Who has PYQs for Operating Systems?',
    'Any AI squads recruiting members?',
    'Who is offering Figma UX mentorship?',
  ];

  // Track unread messages if widget is closed
  useEffect(() => {
    if (!isOpen && messages.length > prevMsgLengthRef.current) {
      setUnreadCount((prev) => prev + (messages.length - prevMsgLengthRef.current));
    }
    prevMsgLengthRef.current = messages.length;
  }, [messages, isOpen]);

  // Reset unread count when opening & container scroll
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [isOpen, messages.length, isLoading]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    if (!textToSend) setInputText('');
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeechText = text.replace(/[*#`_•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Formatted rendering helper
  const renderFormattedMessage = (rawText: string) => {
    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-sm font-sans">
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-1.5" />;

          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

          return (
            <div key={i} className={`${isBullet ? 'pl-2 text-zinc-300' : 'text-zinc-200'}`}>
              {parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={j} className="text-white font-bold">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code key={j} className="px-1.5 py-0.5 rounded bg-black/40 text-pink-300 font-mono text-xs border border-pink-500/20">
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      
      {/* ========================================================================= */}
      {/* POPUP CHATBOX (Pink & White themed) */}
      {/* ========================================================================= */}
      {isOpen && (
        <div 
          id="compass-floating-chatbox"
          className={`pointer-events-auto mb-3 sm:mb-4 bg-[#0a060e]/95 backdrop-blur-2xl border border-pink-500/30 rounded-3xl shadow-[0_20px_70px_rgba(236,72,153,0.35)] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 origin-bottom-right ${
            isExpanded 
              ? 'w-[calc(100vw-2rem)] sm:w-[500px] h-[82vh] max-h-[750px]' 
              : 'w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[82vh]'
          }`}
        >
          {/* Top Bar with Pink-to-White gradient banner */}
          <div className="px-5 py-4 bg-gradient-to-r from-pink-950/80 via-[#150a1b]/90 to-[#0c0612]/90 border-b border-pink-500/20 flex items-center justify-between relative">
            
            {/* Ambient Pink Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-pink-400 to-transparent" />

            <div className="flex items-center gap-3">
              {/* Compass Icon Badge */}
              <div className="relative">
                <CompassStarIcon size={36} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pink-400 border-2 border-black rounded-full shadow-[0_0_6px_#f472b6]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-heading tracking-wide">
                    COMPASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-white">AI</span>
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-tech uppercase font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm">
                    Gemini 3.7
                  </span>
                </div>
                <p className="text-[11px] text-pink-200/70 font-normal">
                  Your instant campus neural co-pilot
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-pink-500/20 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer"
                title={isExpanded ? 'Collapse view' : 'Expand view'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/30 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-pink-950/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed transition-all shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium shadow-[0_4px_20px_rgba(244,114,182,0.35)] rounded-br-none'
                      : 'bg-[#150a1d]/90 border border-pink-500/25 text-slate-100 rounded-bl-none shadow-black/50'
                  }`}
                >
                  {msg.sender === 'compass' && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-pink-500/20 text-[11px] font-mono-tech">
                      <div className="flex items-center gap-1.5 text-pink-300 font-bold">
                        <Sparkles className="w-3 h-3 text-pink-300" />
                        <span>COMPASS AI</span>
                        {msg.category && (
                          <span className="px-1.5 py-0.5 rounded-full bg-pink-950 text-[9px] text-pink-200 border border-pink-500/30">
                            {msg.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className="p-1 rounded bg-white/5 hover:bg-pink-500/20 text-pink-300 transition-colors cursor-pointer"
                          title="Read aloud"
                        >
                          {speakingMsgId === msg.id ? <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="p-1 rounded bg-white/5 hover:bg-pink-500/20 text-pink-300 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rendered Markdown Body */}
                  {renderFormattedMessage(msg.text)}

                  {/* Interactive Action Cards */}
                  {msg.suggestedCards && msg.suggestedCards.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-pink-500/20">
                      {msg.suggestedCards.map((card, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            onSelectActionCard &&
                            onSelectActionCard(card.type, card.targetId)
                          }
                          className="p-2.5 rounded-xl bg-black/60 border border-pink-500/30 hover:border-pink-400 text-left transition-all cursor-pointer flex items-center justify-between gap-2 group hover:bg-pink-950/40"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono-tech text-pink-300 uppercase px-1.5 py-0.5 rounded bg-pink-500/20 font-bold">
                                {card.tag}
                              </span>
                              <span className="text-[9px] text-pink-200/60 font-mono-tech">
                                {card.actionLabel || 'View'}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white mt-1 group-hover:text-pink-300 transition-colors truncate">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-white/60 truncate">
                              {card.subtitle}
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Follow-Up Chips */}
                  {msg.followUpQueries && msg.followUpQueries.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-pink-500/15">
                      <div className="text-[9px] font-mono-tech text-pink-200/50 uppercase tracking-wider mb-1">
                        FOLLOW UP:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.followUpQueries.map((followUp, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSend(followUp)}
                            className="px-2 py-0.5 rounded-md bg-pink-950/40 hover:bg-pink-500/20 border border-pink-500/30 text-pink-200 hover:text-white text-[11px] transition-colors cursor-pointer text-left"
                          >
                            💬 {followUp}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <span className="text-[10px] font-mono-tech text-white/40 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3 bg-[#150a1d]/80 border border-pink-500/30 rounded-2xl text-xs font-mono-tech text-pink-300 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
                <span>COMPASS is querying campus network...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3.5 py-2 border-t border-pink-500/15 bg-black/40">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 text-[11px] font-medium text-pink-200 whitespace-nowrap transition-all cursor-pointer shrink-0"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3.5 bg-black/70 border-t border-pink-500/20">
            <div className="relative flex items-center">
              <input
                id="floating-compass-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask COMPASS anything..."
                disabled={isLoading}
                className="w-full pl-3.5 pr-11 py-2.5 bg-[#150a1d] border border-pink-500/30 focus:border-pink-400 rounded-xl text-xs sm:text-sm text-white placeholder-pink-200/50 focus:outline-none transition-all shadow-inner focus:shadow-[0_0_12px_rgba(244,114,182,0.15)] font-sans"
              />
              <button
                id="floating-compass-send"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 disabled:opacity-40 text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(244,114,182,0.25)]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING COMPASS LOGO BUTTON (Pink & White Mixture Glow) */}
      {/* ========================================================================= */}
      <button
        id="floating-compass-trigger-btn"
        onClick={onToggle}
        className="pointer-events-auto relative group p-1 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none"
        title="Open COMPASS AI Assistant"
      >
        {/* Outer Dual-Tone Pink + White Ring */}
        <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-pink-500 via-rose-300 to-white p-[2px] flex items-center justify-center">
          
          {/* Inner Dark Radial Capsule */}
          <div className="w-full h-full rounded-full bg-[#120718] flex items-center justify-center relative overflow-hidden">
            <CompassStarIcon size={34} />
          </div>

          {/* Unread Message Badge */}
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-white text-pink-600 font-bold text-[10px]">
              {unreadCount}
            </span>
          ) : (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-pink-400 border-2 border-black" />
          )}

        </div>

        {/* Hover Tooltip Pill */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#14081c]/95 border border-pink-500/40 text-white text-xs font-semibold backdrop-blur-xl shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>Ask COMPASS</span>
        </div>
      </button>

    </div>
  );
};

