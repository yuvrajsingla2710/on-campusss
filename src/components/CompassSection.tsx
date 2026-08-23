import React, { useState, useRef, useEffect } from 'react';
import { CompassMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  ArrowUpRight,
  Zap,
  Copy,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CompassStarIcon } from './BrandLogos';

interface CompassSectionProps {
  messages: CompassMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSelectActionCard?: (action: string, targetId: string) => void;
}

export const CompassSection: React.FC<CompassSectionProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectActionCard,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'academic' | 'gear' | 'projects' | 'skills' | 'campus'>('all');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const categorizedPresets = {
    all: [
      'Who can lend me a Casio fx-991 calculator today?',
      'Find me an AI or robotics project recruiting developers.',
      'Who is offering Figma UI/UX mentorship?',
      'Where can I find past year papers for Operating Systems?',
      'What are the Central Library 24/7 exam hours and Wi-Fi proxy?',
    ],
    academic: [
      'Where can I find past year papers for Operating Systems?',
      'Are Prof. Menon’s Signals & Systems exams open-notes?',
      'Who has handwritten DSA & DBMS notes for Semester 3?',
      'How do I apply for Summer Research Internships?',
    ],
    gear: [
      'Who can lend me a Casio fx-991 calculator today?',
      'Where can I reserve a 50MHz Oscilloscope on campus?',
      'Where can I borrow a Lab Coat & UV safety goggles?',
      'Who has an Arduino Mega and sensor kit available?',
    ],
    projects: [
      'Find me an AI or robotics project recruiting developers.',
      'How do I join the CampusVision attendance project?',
      'What skills does the SoilSense IoT squad need?',
      'Are there any NLP or speech recognition projects looking for members?',
    ],
    skills: [
      'Who is offering Figma UI/UX mentorship?',
      'Who can teach me KiCAD & PCB soldering?',
      'Find someone who knows ROS 2 and Gazebo robotics.',
      'How does the peer skill swap match score work?',
    ],
    campus: [
      'What are the Central Library 24/7 exam hours and Wi-Fi proxy?',
      'What are the hostel mess timings and special dinners?',
      'What is the campus emergency medical dispensary number?',
      'Where are the nearest printing and xerox shops on campus?',
    ],
  };

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

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, isLoading]);

  // Clean formatted rendering for markdown bold and bullet points
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
    <section id="compass" className="py-24 border-b border-zinc-800 relative bg-[#0e0f16] overflow-hidden select-none">
      {/* Background Pink & Rose Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#fbcfe8]/[0.04] rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-heading">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow-[0_0_15px_rgba(251,207,232,0.18)]">COMPASS</span>, your campus AI.
          </h2>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left: Chat Terminal (8 cols) */}
          <div className="lg:col-span-8 bg-[#12131d] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl relative flex flex-col justify-between min-h-[540px]">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <CompassStarIcon size={34} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-heading">COMPASS AI</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-tech uppercase font-bold bg-pink-950/50 text-pink-200 border border-pink-300/30">
                      Gemini 3.7 Flash
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-750 text-[11px] font-mono-tech text-zinc-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-pink-300 animate-pulse shadow-[0_0_6px_rgba(251,207,232,0.6)]" />
                  <span>ONLINE</span>
                </div>
              </div>
            </div>

            {/* Query Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-zinc-800/80 scrollbar-none text-xs font-mono-tech">
              {[
                { id: 'all', label: 'All Queries' },
                { id: 'academic', label: '🎓 Academics & PYQs' },
                { id: 'gear', label: '📦 Lab & Gear' },
                { id: 'projects', label: '🚀 Squads' },
                { id: 'skills', label: '⚡ Skill Swap' },
                { id: 'campus', label: '📍 Campus Life' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer text-xs ${
                    activeCategoryTab === tab.id
                      ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-zinc-950 font-bold shadow-[0_0_10px_rgba(251,207,232,0.3)]'
                      : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-750 border border-zinc-750'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="space-y-4 max-h-[340px] overflow-y-auto pr-2 mb-3 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[92%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 text-zinc-950 font-medium shadow-[0_0_15px_rgba(251,207,232,0.18)] rounded-br-sm'
                        : 'bg-[#181926] border border-zinc-800 text-zinc-200 rounded-bl-sm shadow-lg'
                    }`}
                  >
                    {msg.sender === 'compass' && (
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-750 text-[11px] font-mono-tech">
                        <div className="flex items-center gap-2 text-pink-300 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                          <span>COMPASS INTELLIGENCE</span>
                          {msg.category && (
                            <span className="px-2 py-0.5 rounded-full bg-pink-950/60 text-[10px] text-pink-200 border border-pink-300/30">
                              {msg.category}
                            </span>
                          )}
                        </div>

                        {/* Speech & Copy utilities */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakText(msg.id, msg.text)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title={speakingMsgId === msg.id ? "Stop voice readout" : "Listen to response"}
                          >
                            {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy response to clipboard"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rendered Body */}
                    {renderFormattedMessage(msg.text)}

                    {/* Action Cards attached */}
                    {msg.suggestedCards && msg.suggestedCards.length > 0 && (
                      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-750">
                        {msg.suggestedCards.map((card, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              onSelectActionCard &&
                              onSelectActionCard(card.type, card.targetId)
                            }
                            className="p-3 rounded-xl bg-[#141522] border border-zinc-750 hover:border-pink-300/60 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-[0_0_15px_rgba(251,207,232,0.12)]"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[9px] font-mono-tech text-pink-200 uppercase px-1.5 py-0.5 rounded bg-pink-950/50 border border-pink-300/30 font-bold">
                                  {card.tag}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono-tech">
                                  {idx === 0 ? '98% Match' : idx === 1 ? '92% Match' : '88% Match'}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-white mt-1 group-hover:text-pink-200 transition-colors line-clamp-2 font-heading">
                                {card.title}
                              </div>
                              <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                                {card.subtitle}
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-pink-300 font-semibold">
                              <span>{card.actionLabel || 'View Detail'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Follow-Up Questions */}
                    {msg.followUpQueries && msg.followUpQueries.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-750">
                        <div className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-wider mb-1.5">
                          SUGGESTED FOLLOW-UPS:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.followUpQueries.map((followUp, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(followUp)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-pink-950/40 border border-zinc-700 hover:border-pink-300/40 text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer text-left"
                            >
                              💬 {followUp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5 p-3.5 bg-[#181926] border border-zinc-750 rounded-2xl text-xs sm:text-sm font-mono-tech text-pink-300 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-pink-300" />
                  <span>COMPASS is synthesizing campus neural network data...</span>
                </div>
              )}
            </div>

            {/* Quick Query Pills */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {categorizedPresets[activeCategoryTab].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl bg-zinc-850 border border-zinc-750 hover:border-pink-300/50 text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0 text-xs"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="relative flex items-center">
              <input
                id="compass-section-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask COMPASS anything about gear, projects, mentors, PYQs, exams, timings..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3.5 bg-[#181926] border border-zinc-800 focus:border-pink-300 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors font-sans focus:ring-2 focus:ring-pink-300/20"
              />
              <button
                id="compass-section-send-btn"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-pink-200 to-rose-200 disabled:opacity-40 text-zinc-950 font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(251,207,232,0.25)] hover:brightness-105"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right: Holographic Star Pedestal */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#12131d] border border-zinc-800 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            
            {/* Ambient Pink Backlight */}
            <div className="absolute inset-0 bg-radial-at-c from-pink-300/10 via-rose-300/5 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 md:gap-8 lg:flex lg:flex-col lg:gap-0 items-center justify-center text-center md:text-left lg:text-center">
              {/* Holographic Glowing Pedestal Stage */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4 md:mb-0 lg:mb-4 mx-auto">
                <div className="absolute inset-0 rounded-full border border-pink-300/30 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-rose-300/25 animate-reverse-spin" />
                <div className="absolute inset-10 rounded-full border border-white/20 border-dashed" />
                <div className="absolute bottom-4 w-36 h-8 rounded-full bg-pink-300/20 blur-md" />

                <div className="relative z-10 animate-float">
                  <CompassStarIcon size={100} glow={true} />
                </div>
              </div>

              <div className="w-full flex flex-col justify-center">
                <div className="space-y-1.5 mt-2 md:mt-0 lg:mt-2">
                  <h4 className="text-base font-bold text-white font-heading tracking-wide">
                    Campus Neural Core
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xs md:max-w-none lg:max-w-xs mx-auto md:mx-0 lg:mx-auto leading-relaxed">
                    Autonomous reasoning connecting student rosters, borrow items, skill exchanges, and timetable sync with sub-second latency.
                  </p>
                </div>

                {/* Quick Live Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 sm:mt-5 w-full pt-4 border-t border-zinc-800 text-left font-mono-tech">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-400">INTELLIGENCE</div>
                    <div className="text-xs font-bold text-pink-300">Gemini 3.7 + Graph</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] text-zinc-400">CAMPUS REACH</div>
                    <div className="text-xs font-bold text-white">6 Unified Layers</div>
                  </div>
                </div>

                {/* Prompt trigger cards */}
                <div className="w-full mt-4 space-y-2">
                  <button
                    onClick={() => handleSend("Give me a quick 3-point briefing of what's happening on campus today.")}
                    className="w-full p-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-[11px] font-mono-tech text-zinc-300 hover:text-white transition-colors text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Get Today's Campus Briefing</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-pink-300" />
                  </button>
                  <button
                    onClick={() => handleSend("What emergency and medical contacts are available 24/7?")}
                    className="w-full p-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-[11px] font-mono-tech text-zinc-300 hover:text-white transition-colors text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>🚨 Emergency & Medical Contacts</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-pink-300" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

