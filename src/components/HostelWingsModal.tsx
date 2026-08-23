import React from 'react';
import { 
  X, 
  Globe, 
  Building2, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface HostelWingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostelWingsModal: React.FC<HostelWingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const wings = [
    {
      id: 'h4',
      code: 'H4',
      name: 'North Block Hostel',
      status: '98% Active',
      studentsCount: 380,
      inventoryCount: 42,
      topLenders: ['Ananya Rao', 'Yuvraj Sen', 'Rhea Nair'],
      liveNodes: '14 Hardware Nodes Online',
      accentColor: 'from-[#00f2ff] to-[#38bdf8]',
      borderGlow: 'border-[#00f2ff]/40',
    },
    {
      id: 'h7',
      code: 'H7',
      name: 'Tech Tower Hostel',
      status: '100% Active',
      studentsCount: 420,
      inventoryCount: 58,
      topLenders: ['Devansh Iyer', 'Aman Tiwari', 'Siddharth V.'],
      liveNodes: '18 Hardware Nodes Online',
      accentColor: 'from-[#c084fc] to-[#a855f7]',
      borderGlow: 'border-[#c084fc]/40',
    },
    {
      id: 'pg',
      code: 'PG',
      name: 'Research & Postgrad Enclave',
      status: '90% Active',
      studentsCount: 260,
      inventoryCount: 34,
      topLenders: ['Kabir Shah', 'Tanvi Joshi'],
      liveNodes: '11 Hardware Nodes Online',
      accentColor: 'from-emerald-400 to-teal-500',
      borderGlow: 'border-emerald-500/40',
    },
    {
      id: 'h2',
      code: 'H2',
      name: 'East Wing Hostel',
      status: '85% Active',
      studentsCount: 310,
      inventoryCount: 26,
      topLenders: ['Priya Malhotra', 'Meera Chawla'],
      liveNodes: '9 Hardware Nodes Online',
      accentColor: 'from-amber-400 to-orange-500',
      borderGlow: 'border-amber-500/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-[#0b0c12] border border-white/15 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.15)] flex flex-col overflow-hidden text-white max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0e0f18]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 flex items-center justify-center text-[#c084fc]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-tech text-[#c084fc] tracking-[2px] uppercase">
                HOSTEL LOCALIZATION HUBS
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                Campus Wings & Node Distribution
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wings List */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-xs text-white/60 font-mono-tech">
            Lend or collect items locally from your nearest hostel lobby within 5 minutes without crossing the campus perimeter.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wings.map((wing) => (
              <div
                key={wing.id}
                className={`p-5 rounded-2xl bg-[#12131c] border ${wing.borderGlow} space-y-3 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 font-mono-tech font-black text-sm flex items-center justify-center text-white">
                      {wing.code}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{wing.name}</h4>
                      <span className="text-[10px] font-mono-tech text-[#00f2ff]">{wing.liveNodes}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono-tech font-bold text-emerald-400">
                    {wing.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech pt-2 border-t border-white/5">
                  <div className="bg-[#090a0f] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] text-white/40">Active Peers</div>
                    <div className="text-white font-bold">{wing.studentsCount}</div>
                  </div>
                  <div className="bg-[#090a0f] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] text-white/40">Lobby Inventory</div>
                    <div className="text-white font-bold">{wing.inventoryCount} items</div>
                  </div>
                </div>

                <div className="text-xs font-mono-tech text-white/50">
                  <span>Top Lenders: </span>
                  <span className="text-white/80">{wing.topLenders && wing.topLenders.length > 0 ? wing.topLenders.join(', ') : 'Hostel Active Peers'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-[#0e0f18] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-tech text-white/60">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>All 4 Hostel Drop Points Operational</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
