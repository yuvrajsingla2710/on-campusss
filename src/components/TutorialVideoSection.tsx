import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Zap, 
  Cpu, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Code2, 
  FastForward, 
  ExternalLink,
  Video
} from 'lucide-react';

interface SceneConfig {
  id: string;
  chapterNumber: string;
  title: string;
  badge: string;
  prompt: string;
  subtitle: string;
  actionText: string;
  metricLabel: string;
  metricValue: string;
  accentColor: string;
  glowColor: string;
  avatar: string;
  hostel: string;
  tags: string[];
}

const SCENES: SceneConfig[] = [
  {
    id: 'ai-prompt',
    chapterNumber: '01',
    title: 'COMPASS AI Neural Prompting',
    badge: 'INSTANT INDEXING // 12MS',
    prompt: 'need macbook pro 16" & casio calculator in hostel 4 for midsem lab',
    subtitle: 'Natural language semantic parsing links requests across 2,400+ peer nodes instantaneously.',
    actionText: 'Routing 3 Verified Matches in H-4 Block B',
    metricLabel: 'Match Latency',
    metricValue: '0.14s',
    accentColor: '#fbcfe8',
    glowColor: 'rgba(251, 207, 232, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostel: 'Hostel 4 • Room 204',
    tags: ['Hardware Borrow', 'Zero Collateral', 'Karma Verified'],
  },
  {
    id: 'squad-match',
    chapterNumber: '02',
    title: 'Autonomous Research Squad Matching',
    badge: 'SKILL BARTER & SQUADS',
    prompt: 'assemble 4-person robotics squad: ROS2 + PyTorch + PCB designer',
    subtitle: 'Automated skill matrix indexing discovers complementary engineering talent on campus.',
    actionText: 'Autonomous Rover Lab • 3/4 Seats Filled',
    metricLabel: 'Squad Synergy',
    metricValue: '98.4%',
    accentColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hostel: 'Tech Block 2 • Lab 102',
    tags: ['AI/ML', 'Robotics', 'Smart Contract'],
  },
  {
    id: 'zero-fee-market',
    chapterNumber: '03',
    title: 'Zero-Fee Verified Peer Marketplace',
    badge: 'CAMPUS COMMERCE // 0% FEE',
    prompt: 'list sony wh-1000xm5 mint condition for peer handoff at library',
    subtitle: 'Direct peer-to-peer commerce without middlemen fees, verified by campus institutional email.',
    actionText: 'Instant Handover Scheduled • Central Library Cafe',
    metricLabel: 'Savings Rate',
    metricValue: '100% Zero Fee',
    accentColor: '#fda4af',
    glowColor: 'rgba(253, 164, 175, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hostel: 'Arya Hostel • Floor 3',
    tags: ['Instant Handover', 'UPI Direct', 'Hostel Pickup'],
  },
  {
    id: 'karma-engine',
    chapterNumber: '04',
    title: 'Decentralized Campus Karma Engine',
    badge: 'PROOF OF REPUTATION',
    prompt: 'verified returned lab equipment on time • awarded +150 karma points',
    subtitle: 'Every positive contribution, mentor session, and return elevates your on-chain reputation score.',
    actionText: 'Reputation Tier: Top 1% Campus Champion',
    metricLabel: 'Trust Rating',
    metricValue: '99.98%',
    accentColor: '#fbcfe8',
    glowColor: 'rgba(251, 207, 232, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hostel: 'Hostel 7 • Room 412',
    tags: ['Karma +150', 'Badge Minted', 'Priority Access'],
  },
];

export const TutorialVideoSection: React.FC = () => {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [activeCustomEmbed, setActiveCustomEmbed] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentScene = SCENES[activeSceneIdx];

  // Synthesize energetic futuristic sound effects when unmuted
  const playSciFiSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.08) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or allowed yet
    }
  };

  // Typing animation effect for the prompt
  useEffect(() => {
    if (!isPlaying) return;

    setTypedText('');
    setCharIndex(0);
    setIsTypingComplete(false);

    const fullText = currentScene.prompt;
    let currentIdx = 0;

    const typeInterval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setTypedText(fullText.slice(0, currentIdx));
        setCharIndex(currentIdx);
        if (currentIdx % 3 === 0) {
          playSciFiSound(520 + (currentIdx % 5) * 60, 'sine', 0.03);
        }
        currentIdx++;
      } else {
        clearInterval(typeInterval);
        setIsTypingComplete(true);
        playSciFiSound(880, 'triangle', 0.15);
      }
    }, Math.max(25, 45 / playbackSpeed));

    return () => clearInterval(typeInterval);
  }, [activeSceneIdx, isPlaying, playbackSpeed]);

  // Scene auto-advance timer and progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const sceneDuration = 5500 / playbackSpeed;
    const intervalTime = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, (elapsed / sceneDuration) * 100);
      setProgressPercent(pct);

      if (elapsed >= sceneDuration) {
        setActiveSceneIdx((prev) => (prev + 1) % SCENES.length);
        elapsed = 0;
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeSceneIdx, isPlaying, playbackSpeed]);

  // Energetic Particle Canvas Background in Video Player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#fbcfe8' : '#f472b6',
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // Deep dark cybernetic charcoal gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0e0f16');
      bgGrad.addColorStop(0.5, '#12131d');
      bgGrad.addColorStop(1, '#0b0c12');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Energetic laser scanline ray sweeping across
      const laserY = (Math.sin(step * 0.02 * playbackSpeed) * 0.5 + 0.5) * height;
      const laserGrad = ctx.createLinearGradient(0, laserY - 30, 0, laserY + 30);
      laserGrad.addColorStop(0, 'rgba(251, 207, 232, 0)');
      laserGrad.addColorStop(0.5, 'rgba(251, 207, 232, 0.06)');
      laserGrad.addColorStop(1, 'rgba(251, 207, 232, 0)');
      ctx.fillStyle = laserGrad;
      ctx.fillRect(0, laserY - 30, width, 60);

      // Draw subtle background glowing radial orb
      const orbGrad = ctx.createRadialGradient(
        width * 0.65, height * 0.45, 10,
        width * 0.65, height * 0.45, width * 0.4
      );
      orbGrad.addColorStop(0, `${currentScene.accentColor}18`);
      orbGrad.addColorStop(0.6, `${currentScene.accentColor}06`);
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw energetic connecting particles
      particles.forEach((p, idx) => {
        p.x += p.vx * playbackSpeed;
        p.y += p.vy * playbackSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect near particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSceneIdx, playbackSpeed]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCustomVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoUrl.trim()) return;

    let embedUrl = customVideoUrl;
    if (customVideoUrl.includes('youtube.com/watch?v=')) {
      const vId = customVideoUrl.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&mute=1`;
    } else if (customVideoUrl.includes('youtu.be/')) {
      const vId = customVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&mute=1`;
    } else if (customVideoUrl.includes('vimeo.com/')) {
      const vId = customVideoUrl.split('vimeo.com/')[1]?.split('?')[0];
      embedUrl = `https://player.vimeo.com/video/${vId}?autoplay=1&muted=1`;
    }

    setActiveCustomEmbed(embedUrl);
    setShowCustomUrlInput(false);
  };

  return (
    <section id="walkthrough" className="relative py-12 sm:py-16 lg:py-20 bg-[#0d0e13] border-t border-zinc-800 overflow-hidden select-none">
      
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-pink-300/10 via-rose-300/08 to-pink-200/06 rounded-full blur-[170px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-heading leading-tight">
            Instant Campus Exchange. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow-[0_0_20px_rgba(251,207,232,0.25)]">
              Everything connected at the speed of thought.
            </span>
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* CINEMATIC VIDEO CONTAINER */}
        {/* ========================================================================= */}
        <div 
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#14151f] shadow-[0_20px_80px_rgba(0,0,0,0.85)] group"
        >
          {/* Top Navigation Bar inside Video Frame */}
          <div className="px-4 sm:px-6 py-3 bg-[#0e0f16]/95 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-end gap-3 relative z-30">
            
            {/* Top Right Controls: Speed, Audio, Fullscreen */}
            <div className="flex items-center gap-2 ml-auto">
              
              {/* 4K 60FPS Badge */}
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-pink-950/50 text-pink-300 text-[10px] font-mono-tech uppercase font-bold border border-pink-300/20">
                4K 60FPS
              </span>

              {/* Playback Speed Selector */}
              <button
                onClick={() => {
                  const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
                  setPlaybackSpeed(nextSpeed);
                  playSciFiSound(700, 'square', 0.04);
                }}
                className="px-2.5 py-1 rounded-md bg-[#181a24] hover:bg-zinc-800 text-zinc-300 text-xs font-mono-tech uppercase border border-zinc-750 transition-all cursor-pointer"
                title="Change Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) playSciFiSound(660, 'sine', 0.1);
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  !isMuted 
                    ? 'bg-pink-300/20 border-pink-300/40 text-pink-300' 
                    : 'bg-[#181a24] border-zinc-750 text-zinc-400 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Fullscreen Expand */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-[#181a24] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 transition-all cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIDEO CANVAS / SCREEN DISPLAY */}
          {/* ========================================================================= */}
          <div className="relative min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            
            {activeCustomEmbed ? (
              <iframe
                src={activeCustomEmbed}
                title="Campus Tutorial Walkthrough"
                className="absolute inset-0 w-full h-full border-0 z-20"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* 60FPS High Performance Particle Canvas Background */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

                {/* Cybernetic Floor Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,207,232,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

                {/* Animated Futuristic Card Mockup */}
                <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-zinc-750 bg-[#12131d]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-all duration-500">
                  
                  {/* Card Top Pill Badge */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-pink-300 animate-ping" />
                      <span className="text-xs font-mono-tech uppercase font-bold text-pink-300 tracking-widest">
                        {currentScene.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-mono-tech">{currentScene.metricLabel}:</span>
                      <span className="text-xs font-bold font-mono-tech text-pink-300 bg-pink-950/50 px-2.5 py-0.5 rounded border border-pink-300/30">
                        {currentScene.metricValue}
                      </span>
                    </div>
                  </div>

                  {/* KINETIC TYPING TERMINAL PROMPT */}
                  <div className="mb-8">
                    <div className="text-xs font-mono-tech text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-pink-300" />
                      <span>Live Prompt Input</span>
                    </div>

                    <div className="min-h-[70px] sm:min-h-[90px] flex items-center">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight leading-tight flex items-center flex-wrap">
                        <span>{typedText}</span>
                        <span className="inline-block w-3 sm:w-4 h-7 sm:h-11 bg-pink-300 ml-1.5 animate-pulse shadow-[0_0_15px_rgba(251,207,232,0.5)]" />
                      </h3>
                    </div>
                  </div>

                  {/* HIGH-TECH RESPONSE GENERATION CARD */}
                  <div className={`rounded-xl border border-zinc-800 bg-[#181a24]/80 p-4 sm:p-6 transition-all duration-500 ${isTypingComplete ? 'opacity-100 translate-y-0 shadow-[0_0_40px_rgba(251,207,232,0.1)]' : 'opacity-40 translate-y-2'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Avatar & Match Details */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={currentScene.avatar} 
                            alt="Peer Avatar" 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-pink-300"
                          />
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-pink-300 rounded-full text-zinc-950">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-bold text-white font-heading">{currentScene.actionText}</span>
                            <ShieldCheck className="w-4 h-4 text-pink-300" />
                          </div>
                          <div className="text-xs text-zinc-400 font-mono-tech mt-0.5">
                            {currentScene.hostel}
                          </div>
                        </div>
                      </div>

                      {/* Tag Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {currentScene.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="px-2.5 py-1 rounded-md bg-[#12131b] border border-zinc-750 text-[11px] font-mono-tech text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              </>
            )}

          </div>

          {/* ========================================================================= */}
          {/* BOTTOM INTERACTIVE SCRUBBER CONTROLS & TIMELINE */}
          {/* ========================================================================= */}
          <div className="px-4 sm:px-6 py-4 bg-[#0e0f16]/95 backdrop-blur-xl border-t border-zinc-800 relative z-30">
            
            {/* Smooth Progress Bar with Scrubber Indicator */}
            <div 
              className="w-full h-2 bg-zinc-800 rounded-full mb-4 cursor-pointer relative overflow-hidden group/scrubber"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                const newIdx = Math.floor(clickPos * SCENES.length);
                setActiveSceneIdx(Math.min(SCENES.length - 1, Math.max(0, newIdx)));
                playSciFiSound(550, 'triangle', 0.05);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-pink-200 via-rose-200 to-pink-400 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(251,207,232,0.5)]"
                style={{ width: `${((activeSceneIdx + progressPercent / 100) / SCENES.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              
              {/* Play / Pause / Reset Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    playSciFiSound(isPlaying ? 400 : 700, 'sine', 0.04);
                  }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 hover:from-pink-100 hover:to-rose-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(251,207,232,0.3)]"
                  title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setActiveSceneIdx(0);
                    setProgressPercent(0);
                    playSciFiSound(500, 'square', 0.05);
                  }}
                  className="p-2.5 rounded-full bg-[#181a24] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 transition-all cursor-pointer"
                  title="Restart Walkthrough"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="text-xs font-mono-tech text-zinc-400 hidden sm:block">
                  <span className="text-pink-300 font-bold">0{activeSceneIdx + 1}</span> / 0{SCENES.length} • {currentScene.title}
                </div>
              </div>

              {/* Quick Jump / Next Scene Button */}
              <button
                onClick={() => {
                  setActiveSceneIdx((prev) => (prev + 1) % SCENES.length);
                  playSciFiSound(750, 'sine', 0.04);
                }}
                className="px-4 py-2 rounded-full bg-pink-950/50 hover:bg-pink-900/50 text-pink-300 border border-pink-300/30 text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Next Scene</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
