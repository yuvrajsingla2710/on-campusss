import React from 'react';
import { ArrowRight, Sparkles, Presentation } from 'lucide-react';
import { Campus3DVisualizer } from './Campus3DVisualizer';
import { OnCampusOrbitalIcon, CompassStarIcon } from './BrandLogos';

interface HeroProps {
  onOpenCompass?: () => void;
  onExplore?: () => void;
  onExploreServices?: () => void;
  onEnterNetwork?: () => void;
  onSelectHub?: (hubName: string) => void;
  onOpenPresentation?: () => void;
  onOpenVideo?: () => void;
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenCompass, 
  onExplore,
  onExploreServices,
  onEnterNetwork,
  onSelectHub,
  onOpenPresentation,
  onOpenVideo,
  onOpenChat,
}) => {
  const handleExplore = onExplore || onExploreServices || (() => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleEnter = onEnterNetwork || handleExplore;

  return (
    <section id="hero" className="relative min-h-[92vh] pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 flex flex-col justify-center overflow-hidden bg-[#0d0e13] select-none">
      
      {/* ========================================================================= */}
      {/* 3D CONSTELLATION NETWORK VISUALIZER (Spanning panoramic 3D layer) */}
      {/* ========================================================================= */}
      <Campus3DVisualizer onSelectNode={onSelectHub} />

      {/* Subtle Ambient Vignette & Deep Space Glow (Grey & Soft Pink) */}
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[550px] bg-[#fbcfe8]/[0.05] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/6 w-[500px] h-[400px] bg-[#f472b6]/[0.03] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* HERO CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pointer-events-none">
        <div className="max-w-xl md:max-w-lg lg:max-w-2xl space-y-5 sm:space-y-6 md:space-y-7 pointer-events-none">

          {/* Main Headline with luminous White-Pink Glow */}
          <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] sm:leading-[1.08] font-heading drop-shadow-md">
            Everything your campus has. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#fce7f3] to-[#fbcfe8] drop-shadow-[0_0_20px_rgba(251,207,232,0.25)]">
              Connected.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-lg font-normal leading-relaxed">
            Discover people. Share resources. Build ideas. Make an impact.
          </p>

          {/* Action Buttons in Grey & Very Light Pink */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 md:gap-4 pt-2 pointer-events-auto">
            <button
              id="hero-enter-network-btn"
              onClick={handleEnter}
              className="bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 hover:brightness-105 text-zinc-950 font-bold text-xs sm:text-sm md:text-base px-5 sm:px-6 md:px-7 py-3 sm:py-3.5 rounded-full flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_2px_16px_rgba(251,207,232,0.3)] hover:shadow-[0_4px_22px_rgba(251,207,232,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore On Campus</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-explore-services-btn"
              onClick={() => {
                const videoSection = document.getElementById('walkthrough') || document.getElementById('services');
                videoSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-100 border border-zinc-700 text-xs sm:text-sm md:text-base font-medium px-5 sm:px-6 md:px-7 py-3 sm:py-3.5 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md"
            >
              Watch how it works
            </button>

            {onOpenPresentation && (
              <button
                id="hero-pitch-deck-btn"
                onClick={onOpenPresentation}
                className="bg-zinc-800/60 hover:bg-zinc-700/80 text-pink-200 hover:text-white border border-pink-300/30 hover:border-pink-300/60 text-xs sm:text-sm md:text-base font-medium px-4 sm:px-5 py-3 sm:py-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-[0_0_12px_rgba(251,207,232,0.08)]"
              >
                <Presentation className="w-4 h-4 text-pink-300" />
                <span className="font-heading tracking-wide">Pitch Deck</span>
              </button>
            )}

            {onOpenCompass && (
              <button
                id="hero-ask-compass-btn"
                onClick={onOpenCompass}
                className="bg-pink-950/40 hover:bg-pink-900/60 text-pink-200 hover:text-white border border-pink-300/40 hover:border-pink-300 text-xs sm:text-xs md:text-sm font-medium px-3.5 sm:px-4 md:px-5 py-3 sm:py-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_14px_rgba(251,207,232,0.15)]"
              >
                <CompassStarIcon size={18} glow={false} />
                <span className="font-heading tracking-wide">COMPASS AI</span>
              </button>
            )}
          </div>

          {/* 3 Bottom Clean Live Stats */}
          <div className="pt-5 sm:pt-6 md:pt-8 flex items-center gap-6 sm:gap-10 md:gap-14 pointer-events-auto">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading">6</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-normal mt-0.5">unified services</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading">1</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-normal mt-0.5">student identity</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading">∞</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-normal mt-0.5">connections</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
