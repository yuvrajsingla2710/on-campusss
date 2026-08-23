import React from 'react';
import { ArrowRight } from 'lucide-react';
import { OnCampusOrbitalIcon } from './BrandLogos';

interface FinalCinematicSectionProps {
  onEnterApp: () => void;
}

export const FinalCinematicSection: React.FC<FinalCinematicSectionProps> = ({
  onEnterApp,
}) => {
  return (
    <section className="py-28 relative overflow-hidden bg-[#0a0b10] text-center border-t border-zinc-800">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-pink-300/10 via-rose-300/5 to-transparent rounded-full blur-2xl pointer-events-none -z-10 animate-pulse-slow" />

      {/* Futuristic Horizon Grid Line */}
      <div className="max-w-5xl mx-auto px-4 h-16 mb-6 relative opacity-60 flex items-center justify-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-pink-300 to-transparent shadow-[0_0_8px_rgba(251,207,232,0.3)]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Big On Campus Emblem */}
        <div className="flex justify-center my-4">
          <div className="p-4 rounded-3xl bg-[#14151f] border border-pink-300/30 shadow-[0_0_20px_rgba(251,207,232,0.12)]">
            <OnCampusOrbitalIcon size={64} />
          </div>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-normal leading-[1.05] font-heading">
          Everything your campus has. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow-[0_0_16px_rgba(251,207,232,0.2)]">
            Connected.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-zinc-400 font-normal max-w-xl mx-auto tracking-widest uppercase font-mono-tech">
          It was all already there. We just connected it.
        </p>

        <div className="pt-4">
          <button
            id="final-enter-btn"
            onClick={onEnterApp}
            className="px-9 py-4 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 hover:from-pink-100 hover:to-rose-200 text-zinc-950 font-bold text-sm font-mono-tech tracking-[2px] uppercase rounded-full inline-flex items-center gap-3 shadow-[0_0_18px_rgba(251,207,232,0.25)] hover:scale-105 transition-all cursor-pointer"
          >
            <span>ENTER ON CAMPUS</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>
        </div>

        {/* 6 Key Manifesto Stats */}
        <div className="pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-left border-t border-zinc-800 mt-16 font-mono-tech">
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-white font-heading">12,850+</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Students</div>
          </div>
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-white font-heading">256+</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Projects</div>
          </div>
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-white font-heading">18,430+</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Connections</div>
          </div>
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-pink-300 font-heading">2.4L+</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Resources Shared</div>
          </div>
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-rose-300 font-heading">96+</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Communities</div>
          </div>
          <div className="p-4 bg-[#14151f] border border-zinc-800 rounded-2xl">
            <div className="text-xl font-black text-white font-heading">∞</div >
            <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

