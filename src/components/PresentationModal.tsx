import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Share2, 
  Trophy, 
  Activity, 
  Cpu, 
  Users, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
  Box,
  Play,
  Pause,
  Repeat
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchService?: (serviceId: string) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  onLaunchService
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const slides = [
    {
      id: 'vision',
      badge: 'VISION & MANIFESTO',
      title: 'ON CAMPUS',
      subtitle: 'Everything your campus has. Connected.',
      tagline: 'A unified digital ecosystem connecting students with campus resources, skills, knowledge, projects, communities and opportunities.',
      highlights: [
        { label: 'Campus Connected', desc: 'Transform isolated dorms and faculties into an active, collaborative network.' },
        { label: 'Peer-to-Peer First', desc: 'Empower students to share hardware, mentor juniors, and build high-impact projects.' },
        { label: 'ZK Student Identity', desc: 'Privacy-preserving cryptographic student verification and skill attestation.' }
      ]
    },
    {
      id: 'problem',
      badge: 'THE PROBLEM & OPPORTUNITY',
      title: 'The Fragmented Campus Paradox',
      subtitle: 'Why thousands of students on the same campus remain disconnected.',
      points: [
        { icon: '📦', title: 'Idle Physical Resources', desc: 'Laptops, lab kits, books, and graphing calculators gather dust in hostel rooms while other students struggle to buy them.' },
        { icon: '🧠', title: 'Lost Senior Wisdom', desc: 'Crucial advice on courses, electives, and professors gets lost every graduation cycle without structured archival.' },
        { icon: '🔍', title: 'Siloed Talent & Projects', desc: 'Founders cannot find developers; designers cannot find teammates; clubs struggle with recruitment across batches.' },
        { icon: '⚠️', title: 'Spammy Chat Groups', desc: 'Vital announcements, lost-and-found items, and peer requests get buried under endless unmoderated messaging groups.' }
      ]
    },
    {
      id: 'core-services',
      badge: 'CORE 6 PILLARS',
      title: 'The Six Core Services',
      subtitle: 'Engineered for seamless campus life, collaboration, and mutual growth.',
      services: [
        { id: 'borrow', icon: '🛠️', title: 'Borrow', desc: 'Borrow lab tools, cameras, notes & hardware with verified escrow security.', action: 'Launch Borrowing' },
        { id: 'guidance', icon: '🧭', title: 'Guidance', desc: '1-on-1 senior mentorship, course insights, professor prep, and exam strategies.', action: 'Explore Mentorship' },
        { id: 'skills', icon: '🤝', title: 'Skill Exchange', desc: 'Swap skills: teach Python in exchange for UI/UX design or guitar tutoring.', action: 'Open Skill Swaps' },
        { id: 'marketplace', icon: '🛒', Marketplace: 'Marketplace', desc: 'Zero-commission student commerce for textbooks, electronics, and hostel essentials.', action: 'Browse Market' },
        { id: 'impact', icon: '🌟', title: 'Impact & Leaderboard', desc: 'Gamified campus contributions, karma rankings, and top-tier student badges.', action: 'View Rankings' },
        { id: 'compass', icon: '🧭', title: 'COMPASS AI', desc: 'Intelligent natural-language agent that routes you across the campus ecosystem.', action: 'Ask COMPASS' }
      ]
    },
    {
      id: 'innovations',
      badge: 'DEEP TECH INNOVATIONS',
      title: 'Key Platform Innovations',
      subtitle: 'Modern architectural primitives built for next-generation universities.',
      features: [
        {
          title: '3D Campus Digital Twin',
          desc: 'Interactive WebGL/Three.js spatial map with live building occupancy, lab statuses, and hostel activity zones.',
          tag: 'Three.js / WebGL',
          color: 'from-cyan-500/20 to-blue-500/20'
        },
        {
          title: 'Zero-Knowledge Student Passport',
          desc: 'Cryptographically attest student status, GPA thresholds, and verified skills without leaking private data.',
          tag: 'ZK Attestation',
          color: 'from-purple-500/20 to-pink-500/20'
        },
        {
          title: 'Campus Pulse Realtime Feed',
          desc: 'High-velocity campus updates, hackathon calls, lost-and-found alerts, and peer squads with live voting.',
          tag: 'Realtime SSE',
          color: 'from-amber-500/20 to-orange-500/20'
        },
        {
          title: 'Student Project Incubator',
          desc: 'Recruit co-founders, post open roles, share prototypes, and accumulate campus-wide backing.',
          tag: 'Ecosystem Engine',
          color: 'from-emerald-500/20 to-teal-500/20'
        }
      ]
    },
    {
      id: 'tech-stack',
      badge: 'ARCHITECTURE & STACK',
      title: 'Built with Modern Web Standards',
      subtitle: 'Production-ready, highly responsive full-stack TypeScript stack.',
      stack: [
        { category: 'Frontend Framework', tech: 'React 18 + Next.js Architectural Primitives', desc: 'Component modularity, optimized lifecycle hooks, client-side caching' },
        { category: 'Type Safety & Speed', tech: 'TypeScript + Strict Mode', desc: '100% end-to-end typed schemas, zero any-leakage, robust interfaces' },
        { category: 'Visual & 3D Engine', tech: 'Tailwind CSS + Three.js / WebGL', desc: 'Custom cyberpunk-glass aesthetic, responsive mobile-first typography' },
        { category: 'Server & API Proxy', tech: 'Express Node.js + Safe Proxy Endpoints', desc: 'Zero API keys exposed in browser, secure REST & event streams' }
      ]
    },
    {
      id: 'live-demo',
      badge: 'LIVE INTERACTIVE DEMO',
      title: 'Experience ON CAMPUS Now',
      subtitle: 'Jump directly into any module to test the live capabilities.',
      actions: [
        { label: '🏛️ Explore 3D Campus Twin', id: 'campus3d', desc: 'Navigate the interactive 3D map' },
        { label: '🛠️ Test Borrowing System', id: 'borrow', desc: 'Simulate peer hardware lending' },
        { label: '💬 Launch Campus Live Chat', id: 'chat', desc: 'Connect with active peers in real-time' },
        { label: '🚀 View Student Projects', id: 'projects', desc: 'Browse research & hackathon teams' },
        { label: '🏆 Open Impact Leaderboard', id: 'leaderboard', desc: 'See top campus contributors' },
        { label: '🧭 Chat with COMPASS AI', id: 'compass', desc: 'Ask campus navigation queries' }
      ]
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  // Autoplay timer
  useEffect(() => {
    if (!isOpen || !isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isOpen, isAutoplay, slides.length]);

  if (!isOpen) return null;

  const current = slides[currentSlide];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn ${isFullscreen ? 'p-0' : ''}`}>
      <div 
        id="presentation-deck-card"
        className={`relative w-full ${isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl h-[88vh] rounded-3xl'} bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04070d] border border-cyan-500/30 overflow-hidden shadow-[0_0_80px_rgba(0,242,255,0.2)] flex flex-col`}
      >
        {/* Top Presentation Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,242,255,0.4)]">
              <div className="w-full h-full bg-[#080c16] rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">ON CAMPUS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono-tech">
                  ECOSYSTEM PITCH DECK
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoplay 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title={isAutoplay ? 'Pause auto-slides' : 'Start auto-slides'}
            >
              {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono-tech text-[11px]">{isAutoplay ? 'Autoplay ON' : 'Autoplay'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              title={isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Close presentation (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presentation Slide Stage */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 overflow-y-auto flex flex-col justify-center relative">
          {/* Background Atmospheric Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            {/* Slide Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              {current.badge}
            </div>

            {/* Slide Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              {current.title}
            </h2>
            <p className="text-base sm:text-xl text-cyan-300/90 font-medium mb-6">
              {current.subtitle}
            </p>

            {/* SLIDE 1: VISION */}
            {current.id === 'vision' && (
              <div className="space-y-6">
                <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl bg-white/[0.03] p-5 rounded-2xl border border-white/10">
                  {current.tagline}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {current.highlights?.map((h, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-cyan-500/40 transition-all">
                      <div className="text-cyan-400 font-bold text-base mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        {h.label}
                      </div>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 2: THE PROBLEM */}
            {current.id === 'problem' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.points?.map((pt, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-rose-500/30 transition-all flex gap-4">
                    <span className="text-3xl p-2 rounded-xl bg-white/5 h-fit">{pt.icon}</span>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{pt.title}</h4>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3: 6 CORE SERVICES */}
            {current.id === 'core-services' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {current.services?.map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-xl">{s.icon}</span>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{s.title}</h4>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed mb-3">{s.desc}</p>
                    </div>
                    {onLaunchService && (
                      <button
                        onClick={() => {
                          onClose();
                          onLaunchService(s.id);
                        }}
                        className="text-[11px] font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <span>{s.action}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 4: INNOVATIONS */}
            {current.id === 'innovations' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.features?.map((f, i) => (
                  <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${f.color} border border-white/15 backdrop-blur-sm space-y-2`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-base sm:text-lg font-bold text-white">{f.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono-tech text-white/80 border border-white/15">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 5: TECH STACK */}
            {current.id === 'tech-stack' && (
              <div className="space-y-3">
                {current.stack?.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono-tech text-cyan-400 uppercase">{st.category}</span>
                      <h4 className="text-sm font-bold text-white">{st.tech}</h4>
                    </div>
                    <p className="text-xs text-white/60 sm:text-right max-w-sm">{st.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 6: LIVE DEMO LAUNCHER */}
            {current.id === 'live-demo' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {current.actions?.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onClose();
                        if (onLaunchService) onLaunchService(act.id);
                      }}
                      className="p-4 text-left rounded-2xl bg-white/[0.04] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-sm text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <span>{act.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-white/60 mt-1">{act.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                  <span className="text-xs font-mono-tech text-cyan-300">
                    💡 Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">⌘K</kbd> anywhere in the application to access instant command search.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Slide Controller */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
          {/* Slide Dots / Selector */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.6)]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Slide Numbers & Prev/Next buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-tech text-white/50">
              Slide {currentSlide + 1} of {slides.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
                disabled={currentSlide === slides.length - 1}
                className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next Slide (Right Arrow or Space)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
