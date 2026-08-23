import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { X, Plus, Layers, CheckCircle } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Omit<ProjectItem, 'id' | 'membersCount' | 'followersCount' | 'updatesCount'>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI / ROBOTICS');
  const [skillsText, setSkillsText] = useState('Python, React, Fast API');
  const [recruiting, setRecruiting] = useState(true);
  const [progressPercent, setProgressPercent] = useState(25);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline) return;

    const skillsRequired = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onCreateProject({
      name,
      tagline,
      description: description || tagline,
      category,
      creator: 'You (Project Builder)',
      creatorTitle: 'Project Builder',
      progressPercent: Number(progressPercent),
      skillsRequired: skillsRequired.length > 0 ? skillsRequired : ['Open Collab'],
      recruiting,
      accentColor: '#9B7CFF',
      recentUpdate: 'Project published on the ON CAMPUS Research Hub.',
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setTagline('');
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#090C12] border border-violet-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-400/40 flex items-center justify-center text-violet-300">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              PUBLISH A RESEARCH PROJECT
            </h2>
            <p className="text-xs font-mono-tech text-violet-400">
              Gather a team, find skilled collaborators and build in public. +60 Impact.
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-center font-mono-tech text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <div>Project published to ON CAMPUS showcase!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                PROJECT NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Autonomous Campus Delivery Robot"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                ONE-LINE TAGLINE
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Low-cost LiDAR navigation rover for hostel deliveries"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
                >
                  <option value="AI / ROBOTICS">AI / ROBOTICS</option>
                  <option value="IOT / SUSTAINABILITY">IOT / SUSTAINABILITY</option>
                  <option value="EDTECH / NLP">EDTECH / NLP</option>
                  <option value="SYSTEMS / MOBILITY">SYSTEMS / MOBILITY</option>
                  <option value="BIOTECH / HEALTH">BIOTECH / HEALTH</option>
                  <option value="FINTECH / CRYPTO">FINTECH / CRYPTO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  CURRENT PROGRESS ({progressPercent}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className="w-full mt-2 accent-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                SKILLS REQUIRED (COMMA-SEPARATED)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. Python, ROS 2, SolidWorks, PyTorch"
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                DETAILED RESEARCH ABSTRACT & GOALS
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the hardware architecture, software stack, milestone roadmaps and what teammates will learn."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="recruiting-check"
                checked={recruiting}
                onChange={(e) => setRecruiting(e.target.checked)}
                className="rounded accent-violet-400"
              />
              <label htmlFor="recruiting-check" className="text-xs font-mono-tech text-zinc-300 cursor-pointer">
                Actively looking for collaborators / teammates across campus
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg"
              >
                PUBLISH PROJECT TO CAMPUS (+60 IMPACT)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
