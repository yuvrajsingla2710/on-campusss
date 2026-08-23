import React, { useState, useRef, useEffect } from 'react';
import { CompassMessage } from '../types';
import { 
  Compass, 
  Send, 
  Sparkles, 
  Loader2, 
  Layers, 
  ArrowUpRight, 
  Bot, 
  User, 
  Volume2, 
  Radio 
} from 'lucide-react';

interface CompassAssistantProps {
  messages: CompassMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSelectActionCard?: (action: string, targetId: string) => void;
}

export const CompassAssistant: React.FC<CompassAssistantProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectActionCard,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const presets = [
    'Where can I find past year papers?',
    'Who is teaching DBMS this sem?',
    'Any internships for CS students?',
    'Where can I borrow a calculator?',
    'Find me an AI project looking for members.',
  ];

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div id="compass" className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#bc13fe] rounded-sm p-6 relative flex flex-col justify-between shadow-2xl h-full">
      <div>
        {/* COMPASS Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#bc13fe]/10 border border-[#bc13fe]/40 flex items-center justify-center text-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.2)]">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-heading tracking-wide">
                COMPASS AI
              </div>
              <div className="text-[10px] font-mono-tech text-white/50">
                Your campus assistant. Always here.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#bc13fe]/10 border border-[#bc13fe]/30 text-[10px] font-mono-tech text-[#bc13fe] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#bc13fe] animate-ping" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Message Thread Body */}
        <div ref={messagesContainerRef} className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-sm text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'bg-[#050505] border border-white/[0.08] text-white/90'
                }`}
              >
                {msg.sender === 'compass' && (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono-tech text-[#bc13fe] uppercase tracking-[2px] mb-1.5 font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-[#bc13fe]" />
                    <span>COMPASS // NEURAL CAMPUS INDEX</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested Action Cards Attached to Compass Responses */}
                {msg.suggestedCards && msg.suggestedCards.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-white/[0.08]">
                    {msg.suggestedCards.map((card, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          onSelectActionCard &&
                          onSelectActionCard(card.type, card.targetId)
                        }
                        className="p-2.5 rounded-sm bg-[#121212] border border-[#00f2ff]/30 hover:border-[#00f2ff] text-left transition-all cursor-pointer flex items-center justify-between gap-2 group"
                      >
                        <div>
                          <span className="text-[8px] font-mono-tech text-[#00f2ff] uppercase px-1.5 py-0.2 rounded-sm bg-[#00f2ff]/10 font-bold">
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
                )}
              </div>
              <span className="text-[9px] font-mono-tech text-white/40 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-[#050505] border border-white/[0.08] rounded-sm text-xs font-mono-tech text-[#00f2ff]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00f2ff]" />
              <span>COMPASS is indexing campus neural database...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Preset Pills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] font-mono-tech text-white/50 tracking-[1px] uppercase">
            QUICK CAMPUS QUERIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(preset)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-sm bg-[#050505] border border-white/[0.08] hover:border-[#00f2ff] text-[10px] font-mono-tech text-white/70 hover:text-[#00f2ff] transition-all cursor-pointer text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box Area */}
      <div className="pt-3 border-t border-white/[0.08]">
        <div className="relative flex items-center">
          <input
            id="compass-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your campus..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-[#050505] border border-white/[0.1] focus:border-[#bc13fe] rounded-sm text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors font-mono-tech shadow-inner"
          />
          <button
            id="compass-send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 rounded-sm bg-[#bc13fe] hover:bg-[#a010d8] disabled:opacity-40 text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(188,19,254,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

