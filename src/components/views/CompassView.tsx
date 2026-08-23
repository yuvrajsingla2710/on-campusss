import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Send, 
  Sparkles, 
  Loader2, 
  ArrowUpRight, 
  Terminal, 
  HelpCircle,
  Cpu,
  BookOpen,
  ShoppingBag,
  Layers3,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CompassMessage, UserProfile } from '../../types';

interface CompassViewProps {
  messages: CompassMessage[];
  isLoading: boolean;
  currentUser: UserProfile;
  onSendMessage: (text: string) => void;
  onSelectActionCard?: (type: string, targetId?: string) => void;
}

export const CompassView: React.FC<CompassViewProps> = ({
  messages,
  isLoading,
  currentUser,
  onSendMessage,
  onSelectActionCard,
}) => {
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const presetQueries = [
    'Where can I borrow a digital multimeter or Arduino board today?',
    'What are the past exam patterns and lab tips for Prof. Raman?',
    'Find peer tutors available for Data Structures & Algorithms',
    'Who is recruiting for robotics and autonomous drone research?',
    'Recommend top affordable textbooks listed in the marketplace',
    'Explain how to get GPU cluster access for AI model training'
  ];

  return (
    <div id="compass-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <Compass className="w-4 h-4 text-[#00f2ff] animate-spin-slow" />
            <span>NEURAL CAMPUS ASSISTANT // LIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            COMPASS AI WORKSPACE
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Your instant cognitive campus copilot. Ask about lab inventory, course guidelines, senior intel, peer skills, and campus deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-xs font-mono-tech text-[#00f2ff] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
          <span>DTU CAMPUS REPO INDEXED</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Full Chat Thread */}
        <div className="lg:col-span-8 bg-[#121212] border border-white/[0.08] rounded-sm p-6 flex flex-col justify-between min-h-[600px] shadow-2xl">
          {/* Messages scroll box */}
          <div ref={chatContainerRef} className="space-y-5 overflow-y-auto max-h-[500px] pr-2 mb-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-4 rounded-sm text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-semibold shadow-lg'
                      : 'bg-[#050505] border border-white/[0.08] text-white/90'
                  }`}
                >
                  {msg.sender === 'compass' && (
                    <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] uppercase tracking-[2px] mb-2 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" />
                      <span>COMPASS // NEURAL INDEX</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line font-mono-tech text-xs sm:text-sm">
                    {msg.text}
                  </p>

                  {/* Suggestion Action Cards */}
                  {msg.actionCards && msg.actionCards.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2">
                      <div className="text-[10px] font-mono-tech text-[#bc13fe] uppercase tracking-wider font-bold">
                        ACTIONABLE CAMPUS SHORTCUTS:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.actionCards.map((card, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              onSelectActionCard &&
                              onSelectActionCard(card.type, card.targetId)
                            }
                            className="p-3 rounded-sm bg-[#121212] border border-[#00f2ff]/30 hover:border-[#00f2ff] text-left transition-all cursor-pointer flex items-center justify-between gap-2 group"
                          >
                            <div>
                              <span className="text-[9px] font-mono-tech text-[#00f2ff] uppercase px-1.5 py-0.2 rounded-sm bg-[#00f2ff]/10 font-bold">
                                {card.tag}
                              </span>
                              <div className="text-xs font-bold text-white mt-1 group-hover:text-[#00f2ff] transition-colors font-heading">
                                {card.title}
                              </div>
                              <div className="text-[10px] text-white/50">
                                {card.subtitle}
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#00f2ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono-tech text-white/40 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3.5 bg-[#050505] border border-white/[0.08] rounded-sm text-xs font-mono-tech text-[#00f2ff]">
                <Loader2 className="w-4 h-4 animate-spin text-[#00f2ff]" />
                <span>COMPASS is processing campus neural database and cross-referencing nodes...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="pt-4 border-t border-white/[0.08]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask COMPASS anything about labs, faculty, equipment, or peer matchmaking..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3.5 bg-[#050505] border border-white/[0.1] focus:border-[#00f2ff] rounded-sm text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors font-mono-tech shadow-inner"
              />
              <button
                id="compass-send-submit-btn"
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 p-2.5 rounded-sm bg-[#00f2ff] hover:bg-[#00f2ff]/80 disabled:opacity-40 text-black font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Presets & Intelligence Hub */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#121212] border border-white/[0.08] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[2px]">
              <span>QUICK CAMPUS PROMPTS</span>
              <Terminal className="w-4 h-4 text-[#00f2ff]" />
            </div>

            <p className="text-xs text-white/60">
              Click any question below to immediately run an inquiry across the campus index:
            </p>

            <div className="space-y-2">
              {presetQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(query)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-sm bg-[#050505] border border-white/5 hover:border-[#00f2ff] text-xs font-mono-tech text-white/80 hover:text-[#00f2ff] transition-all cursor-pointer flex items-start gap-2"
                >
                  <span className="text-[#00f2ff] mt-0.5">›</span>
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Knowledge Pillars */}
          <div className="bg-[#121212] border border-white/[0.08] p-5 rounded-sm space-y-3 font-mono-tech text-xs">
            <div className="text-white font-bold uppercase tracking-[1px] text-[11px] text-[#bc13fe]">
              INDEXED DATA STREAMS
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Lab Hardware & Sensors</span>
              <span className="text-[#00f2ff]">100% Synced</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Senior Course Reviews</span>
              <span className="text-[#00f2ff]">Verified</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Peer Marketplace Listings</span>
              <span className="text-[#00f2ff]">Live</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Campus Project Recruitment</span>
              <span className="text-[#00f2ff]">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
