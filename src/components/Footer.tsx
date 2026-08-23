import React from 'react';
import { Sparkles, ArrowUp, Shield, Zap } from 'lucide-react';
import { OnCampusOrbitalIcon } from './BrandLogos';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0c12] border-t border-zinc-800 text-zinc-300 text-sm">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <OnCampusOrbitalIcon size={32} />
              <span className="text-lg font-bold tracking-[3px] text-white font-mono-tech uppercase">
                ON CAMPUS
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              The unified digital platform for university students. Borrowing, guidance, skill exchange, peer marketplace, connections, and an AI co-pilot.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono-tech uppercase text-white font-bold tracking-[2px]">
              SERVICES
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors cursor-pointer">
                  Borrow Network
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors cursor-pointer">
                  Senior Guidance
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors cursor-pointer">
                  Skill Exchange
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Campus Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('projects')} className="hover:text-white transition-colors cursor-pointer">
                  Projects & Connect
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <div className="text-xs font-mono-tech uppercase text-white font-bold tracking-[2px]">
              PLATFORM
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => scrollTo('impact')} className="hover:text-white transition-colors cursor-pointer">
                  Impact Engine
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('impact')} className="hover:text-white transition-colors cursor-pointer">
                  Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('compass')} className="hover:text-white transition-colors cursor-pointer">
                  COMPASS AI
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pulse')} className="hover:text-white transition-colors cursor-pointer">
                  Campus Pulse
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Nodes */}
          <div className="space-y-3">
            <div className="text-xs font-mono-tech uppercase text-white font-bold tracking-[2px]">
              SECURITY
            </div>
            <div className="p-4 rounded-2xl bg-[#141520] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-mono-tech">
                <Shield className="w-4 h-4 text-pink-300" />
                <span>VERIFIED CAMPUS ID</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-mono-tech">
                Zero spam. Only active university credentials and encrypted peer verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Sub-Bar: Connect Learn Share Build Lead */}
      <div className="border-t border-zinc-850 bg-[#08090f] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4 sm:gap-8 text-xs font-mono-tech uppercase text-zinc-400 tracking-[3px]">
          <span>Connect</span>
          <span>•</span>
          <span>Learn</span>
          <span>•</span>
          <span>Share</span>
          <span>•</span>
          <span>Build</span>
          <span>•</span>
          <span>Lead</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800 bg-[#08090f] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} ON CAMPUS • BY STUDENTS, FOR STUDENTS.
          </div>

          <div className="flex items-center gap-6">
            <span>PRIVACY PROTOCOL</span>
            <span>CAMPUS TERMS</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-pink-300 transition-colors cursor-pointer ml-2"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

