import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Radio } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(12);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackTime((prev) => (prev >= 60 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const scenes = [
    { at: 0, text: '00:00 // INTRODUCING THE CAMPUS NEURAL GRAPH' },
    { at: 15, text: '00:15 // DIRECT PEER-TO-PEER RESOURCE SWAPPING' },
    { at: 30, text: '00:30 // RESEARCH RECRUITMENT & MULTIDISCIPLINARY LABS' },
    { at: 45, text: '00:45 // IMPACT KARMA ACCELERATING CAMPUS COHESION' },
  ];

  const currentScene = scenes.slice().reverse().find((s) => playbackTime >= s.at)?.text || scenes[0].text;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <div className="relative w-full max-w-4xl bg-black border border-cyan-400/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-black/70 border border-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Canvas Container with Sci-Fi HUD Overlays */}
        <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
          {/* Animated Background Simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-violet-950/40 to-black animate-pulse-slow" />

          {/* Futuristic Animated Wireframe Mesh */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-[600px] h-[600px] border border-cyan-400/40 rounded-full animate-spin-slow" />
            <div className="absolute w-[450px] h-[450px] border border-violet-400/30 rounded-full animate-spin" />
            <div className="absolute w-[300px] h-[300px] border border-cyan-400/20 rounded-full" />
          </div>

          {/* Center Brand Title */}
          <div className="relative z-10 text-center space-y-3 px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono-tech tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              CINEMATIC PREVIEW
            </div>

            <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight font-heading">
              ON CAMPUS
            </h1>

            <p className="text-sm sm:text-lg text-zinc-300 font-light max-w-lg mx-auto">
              Everything your campus has. Connected into a single unified operating layer.
            </p>
          </div>

          {/* HUD Top Left */}
          <div className="absolute top-4 left-4 z-10 font-mono-tech text-[10px] text-cyan-400 bg-black/60 px-3 py-1.5 rounded border border-cyan-400/20">
            <div>REC ● [4K CINEMA] 60FPS</div>
            <div className="text-zinc-400">{currentScene}</div>
          </div>

          {/* HUD Bottom Telemetry */}
          <div className="absolute bottom-16 left-4 right-4 z-10 flex items-center justify-between font-mono-tech text-[10px] text-zinc-400 px-2">
            <span>NODES: 1,842 ACTIVE</span>
            <span className="text-cyan-400">LATENCY: 12ms</span>
            <span>CAMPUS: NIT CALICUT CLUSTER</span>
          </div>

          {/* Video Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex flex-col gap-2">
            {/* Progress Scrub Bar */}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${(playbackTime / 60) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded hover:bg-white/10 text-white cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded hover:bg-white/10 text-white cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span>
                  00:{String(playbackTime).padStart(2, '0')} / 01:00
                </span>
              </div>

              <div className="text-cyan-400">
                PRODUCED BY ON CAMPUS LABS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
