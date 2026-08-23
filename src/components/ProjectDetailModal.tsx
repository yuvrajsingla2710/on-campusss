import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { ShareData } from './ShareModal';
import { 
  X, 
  Users, 
  Heart, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle, 
  Send, 
  Radio, 
  Layers,
  Share2,
  Check
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onJoinProject: (projectId: string) => void;
  onToggleFollow: (projectId: string) => void;
  onPostUpdate: (projectId: string, updateText: string) => void;
  onOpenShare?: (data: ShareData) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onJoinProject,
  onToggleFollow,
  onPostUpdate,
  onOpenShare,
}) => {
  const [updateInput, setUpdateInput] = useState('');
  const [justApplied, setJustApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const handleShare = () => {
    const projectUrl = `${window.location.origin}/projects/${project.id}`;
    const rolesText = (project.openRoles || []).join(', ');
    const sharePayload: ShareData = {
      title: `${project.name} — ${project.tagline}`,
      text: `${project.description} Lead: ${project.leadName} (${project.department}).${rolesText ? ` Recruiting: ${rolesText}` : ''}`,
      url: projectUrl,
      category: project.category,
    };

    if (onOpenShare) {
      onOpenShare(sharePayload);
    } else if (navigator.share) {
      navigator.share({
        title: sharePayload.title,
        text: sharePayload.text,
        url: sharePayload.url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    onJoinProject(project.id);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2500);
  };

  const handleSendUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateInput.trim()) return;
    onPostUpdate(project.id, updateInput.trim());
    setUpdateInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090C12] border border-violet-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Top Controls */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-[#00f2ff] hover:border-[#00f2ff]/40 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono-tech"
            title="Share Project"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between gap-3 text-xs font-mono-tech mb-2">
              <span className="text-zinc-400 tracking-wider">
                {project.category}
              </span>
              {project.recruiting ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-semibold">
                  ● RECRUITING MEMBERS
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
                  CORE TEAM ASSEMBLED
                </span>
              )}
            </div>

            <h2 className="text-3xl font-bold text-white font-heading">
              {project.name}
            </h2>
            <p className="text-sm text-cyan-300 font-mono-tech mt-1">
              {project.tagline}
            </p>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-center font-mono-tech">
            <div>
              <div className="text-xl font-bold text-white font-heading">
                {project.membersCount}
              </div>
              <div className="text-[10px] text-zinc-400">Active Members</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400 font-heading">
                {project.followersCount}
              </div>
              <div className="text-[10px] text-zinc-400">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-violet-400 font-heading">
                {project.progressPercent}%
              </div>
              <div className="text-[10px] text-zinc-400">Milestone Progress</div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-2">
            <div className="text-xs font-mono-tech text-zinc-400 uppercase">
              ABOUT THE BUILD
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills Required */}
          <div>
            <div className="text-xs font-mono-tech text-zinc-400 uppercase mb-2">
              LOOKING FOR SKILLS IN:
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded bg-zinc-900 border border-cyan-400/30 text-xs font-mono-tech text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Updates Stream */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-300">
              <div className="flex items-center gap-1.5 text-violet-300">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>LATEST PROJECT LOG</span>
              </div>
              <span className="text-[10px] text-zinc-400">
                {project.updatesCount} Updates Logged
              </span>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded border border-white/5 font-mono-tech leading-relaxed">
              {project.recentUpdate || 'Initial prototype architecture committed to repository.'}
            </p>

            {/* Post update form */}
            <form onSubmit={handleSendUpdate} className="flex gap-2 pt-2">
              <input
                type="text"
                value={updateInput}
                onChange={(e) => setUpdateInput(e.target.value)}
                placeholder="Post a new sprint update or changelog..."
                className="flex-1 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-violet-400 font-mono-tech"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded text-xs font-mono-tech cursor-pointer"
              >
                LOG UPDATE
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => onToggleFollow(project.id)}
              className={`px-4 py-2.5 rounded text-xs font-mono-tech tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                project.isFollowing
                  ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${project.isFollowing ? 'fill-rose-500' : ''}`} />
              <span>{project.isFollowing ? 'FOLLOWING' : 'FOLLOW PROJECT'}</span>
            </button>

            {project.recruiting && (
              <button
                onClick={handleApply}
                disabled={project.hasApplied || justApplied}
                className={`px-6 py-2.5 text-xs font-mono-tech tracking-wider uppercase font-bold rounded transition-all cursor-pointer shadow-lg ${
                  project.hasApplied || justApplied
                    ? 'bg-emerald-950 border border-emerald-400/60 text-emerald-300'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white'
                }`}
              >
                {project.hasApplied || justApplied ? 'APPLICATION SUBMITTED ✓' : 'REQUEST TO JOIN TEAM'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
