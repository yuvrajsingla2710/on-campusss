import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Users, 
  ArrowUpRight,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

interface CampusAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusAnalyticsModal: React.FC<CampusAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [metricTab, setMetricTab] = useState<'overview' | 'lending' | 'mentorship' | 'zk-proofs'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#0b0c12] border border-white/15 rounded-3xl shadow-[0_0_80px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-white max-h-[90vh]">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-[#00f2ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0e0f18] relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-tech tracking-[2px] text-[#00f2ff]">
              <BarChart3 className="w-4 h-4 text-[#00f2ff]" />
              <span>LIVE CAMPUS TELEMETRY // SEMESTER 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              Detailed Campus Impact & Exchange Analytics
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-[#0d0e14] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Ecosystem Overview' },
            { id: 'lending', label: 'Peer Lending Flow' },
            { id: 'mentorship', label: 'Knowledge & Mentorship' },
            { id: 'zk-proofs', label: 'ZK Security & Trust' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMetricTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer border ${
                metricTab === tab.id
                  ? 'bg-[#00f2ff] text-black font-bold border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                  : 'bg-white/5 text-white/60 border-transparent hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono-tech">
            <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
              <div className="text-[11px] text-white/50 flex items-center justify-between">
                <span>Active Peers</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">1,480</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+32% from last week</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
              <div className="text-[11px] text-white/50">Total Karma Circulating</div>
              <div className="text-2xl sm:text-3xl font-black text-[#00f2ff] mt-1">2.41M</div>
              <div className="text-[10px] text-[#00f2ff] mt-1">100% Non-inflationary</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
              <div className="text-[11px] text-white/50">On-Time Return Rate</div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-300 mt-1">99.99%</div>
              <div className="text-[10px] text-white/40 mt-1">12,480 loans verified</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
              <div className="text-[11px] text-white/50">Saved Student Costs</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">₹4.8L+</div>
              <div className="text-[10px] text-emerald-400 mt-1">Shared calculators & books</div>
            </div>
          </div>

          {/* Interactive Chart Visualization */}
          <div className="p-6 rounded-3xl bg-[#12131c] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-white font-heading">
                  Hourly Campus Activity Velocity (24h Window)
                </h4>
                <p className="text-xs text-white/50 font-mono-tech">
                  Peak transaction windows during lab hours and evening study sprints
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono-tech">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff]" />
                  <span className="text-white/70">Hardware Loans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
                  <span className="text-white/70">Mentorship Hours</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Spectrum */}
            <div className="h-44 flex items-end gap-1.5 sm:gap-3 pt-6 px-2 border-b border-white/10">
              {[30, 45, 25, 60, 80, 95, 70, 85, 100, 90, 65, 80, 50, 40, 75, 90, 85, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div 
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      i % 2 === 0 
                        ? 'bg-gradient-to-t from-[#00f2ff]/40 to-[#00f2ff] group-hover:brightness-125' 
                        : 'bg-gradient-to-t from-[#c084fc]/40 to-[#c084fc] group-hover:brightness-125'
                    }`}
                  />
                  <span className="text-[8px] font-mono-tech text-white/40 hidden sm:block">
                    {i * 1 + 6}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white font-heading">
                Top Departmental Contributions
              </h4>
              
              <div className="space-y-2 font-mono-tech text-xs">
                <div>
                  <div className="flex items-center justify-between text-white/70 mb-1">
                    <span>Computer Science & AI</span>
                    <span className="text-[#00f2ff] font-bold">42% (980 trades)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-[#00f2ff] rounded-full w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-white/70 mb-1">
                    <span>Robotics & Embedded</span>
                    <span className="text-[#c084fc] font-bold">28% (650 trades)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-[#c084fc] rounded-full w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-white/70 mb-1">
                    <span>Mechanical & Makerspace</span>
                    <span className="text-emerald-400 font-bold">18% (420 trades)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-white/70 mb-1">
                    <span>Physics & BioTech</span>
                    <span className="text-amber-400 font-bold">12% (280 trades)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Zero Knowledge Audit Card */}
            <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Zero-Knowledge Proof Audit</span>
                  </h4>
                  <span className="text-[9px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  Reputation math is calculated on cryptographic proofs without tracking student identities or selling student metadata.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-tech text-white/50">
                <span>Proof Block: #940,118</span>
                <span className="text-[#00f2ff]">LATENCY: 12ms</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-[#0e0f18] border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition-all cursor-pointer font-mono-tech"
          >
            Done Viewing Telemetry
          </button>
        </div>

      </div>
    </div>
  );
};
