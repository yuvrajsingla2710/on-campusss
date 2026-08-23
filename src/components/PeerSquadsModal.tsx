import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Plus, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  MessageSquare,
  ArrowRight,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';

interface PeerSquadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const PeerSquadsModal: React.FC<PeerSquadsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [squads, setSquads] = useState([
    {
      id: 'sq-1',
      name: 'hackathon-squad-ai',
      topic: 'Inter-College GenAI Hackathon 2026',
      members: [
        { name: 'Aarav Patel', role: 'Frontend Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
        { name: 'Devansh Iyer', role: 'ML Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
        { name: 'Priya M.', role: 'IoT Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
      ],
      lookingFor: ['Next.js / Rust Dev', 'UI/UX Designer'],
      status: 'Recruiting',
      activeSprint: 'Drafting architecture proposal',
      joined: false,
    },
    {
      id: 'sq-2',
      name: 'os-distributed-core',
      topic: 'Kernel & Distributed Storage Study Group',
      members: [
        { name: 'Ananya Rao', role: 'Lead TA', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
        { name: 'Yuvraj Sen', role: 'Peer Reviewer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
      ],
      lookingFor: ['C / Go Programmer'],
      status: 'Active',
      activeSprint: 'Mock Mid-Sem Question Sprint',
      joined: false,
    },
    {
      id: 'sq-3',
      name: 'rover-firmware-crew',
      topic: 'Autonomous University Mars Rover 2026',
      members: [
        { name: 'Kabir Shah', role: 'Fabrication', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80' },
        { name: 'Rhea Nair', role: 'Physics Calc', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
      ],
      lookingFor: ['ROS 2 / STM32 Dev'],
      status: 'Recruiting',
      activeSprint: 'Telemetry Testing in Main Ground',
      joined: false,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadTopic, setNewSquadTopic] = useState('');

  if (!isOpen) return null;

  const handleJoinSquad = (squadId: string) => {
    setSquads((prev) =>
      prev.map((s) => (s.id === squadId ? { ...s, joined: true } : s))
    );
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;

    const newSq = {
      id: `sq-${Date.now()}`,
      name: newSquadName.toLowerCase().replace(/\s+/g, '-'),
      topic: newSquadTopic || 'Campus Build Sprint',
      members: [
        { name: currentUser.name, role: 'Founder', avatar: currentUser.avatar },
      ],
      lookingFor: ['Open for all peers'],
      status: 'Recruiting',
      activeSprint: 'Sprint planning',
      joined: true,
    };

    setSquads([newSq, ...squads]);
    setIsCreating(false);
    setNewSquadName('');
    setNewSquadTopic('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-[#0b0c12] border border-white/15 rounded-3xl shadow-[0_0_25px_rgba(0,242,255,0.08)] flex flex-col overflow-hidden text-white max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0e0f18]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-tech text-[#00f2ff] tracking-[2px] uppercase">
                PEER SQUAD ENGINE
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                Campus Hackathon & Study Squads
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-3.5 py-1.5 rounded-xl bg-[#00f2ff] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#00f2ff]/90 transition-all cursor-pointer font-mono-tech"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Form Squad</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Squad Form Drawer */}
        {isCreating && (
          <form onSubmit={handleCreateSquad} className="p-5 bg-[#12131e] border-b border-white/10 space-y-3">
            <div className="text-xs font-mono-tech text-[#00f2ff] uppercase font-bold">
              Form New Campus Peer Squad
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text"
                placeholder="Squad handle (e.g. quantum-sim-dev)"
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
                required
                className="px-3.5 py-2 rounded-xl bg-[#0a0a0f] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00f2ff]"
              />
              <input 
                type="text"
                placeholder="Topic / Hackathon Goal"
                value={newSquadTopic}
                onChange={(e) => setNewSquadTopic(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#0a0a0f] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00f2ff]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#00f2ff] text-black font-bold text-xs font-mono-tech"
              >
                Launch Squad (+30 Karma)
              </button>
            </div>
          </form>
        )}

        {/* Squads List */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {squads.map((squad) => (
            <div 
              key={squad.id}
              className="p-5 rounded-2xl bg-[#12131c] border border-white/10 space-y-4 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] animate-ping" />
                    <span className="font-mono-tech font-bold text-sm text-[#00f2ff]">
                      {squad.name}
                    </span>
                    <span className="text-[10px] font-mono-tech bg-white/10 text-white px-2 py-0.5 rounded-full">
                      {squad.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white font-heading mt-1">
                    {squad.topic}
                  </h4>
                </div>

                <button
                  onClick={() => handleJoinSquad(squad.id)}
                  disabled={squad.joined}
                  className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    squad.joined
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-[#00f2ff]'
                  }`}
                >
                  {squad.joined ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Joined Squad</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-[#00f2ff]" />
                      <span>Request to Join</span>
                    </>
                  )}
                </button>
              </div>

              {/* Members */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
                <div className="text-xs font-mono-tech text-white/50">Crew:</div>
                <div className="flex items-center gap-2">
                  {squad.members.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-[#090a0f] px-2.5 py-1 rounded-lg border border-white/5 text-xs">
                      <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                      <span className="text-white font-medium">{m.name}</span>
                      <span className="text-[9px] text-[#00f2ff] font-mono-tech">({m.role})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Looking for */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
                <span className="text-white/40">Looking for:</span>
                {squad.lookingFor.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px]">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
