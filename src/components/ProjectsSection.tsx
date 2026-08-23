import React from 'react';
import { ProjectItem } from '../types';
import { 
  ArrowUpRight, 
  Users, 
  Heart, 
  Plus, 
  Layers3
} from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenCreateProject: () => void;
  onToggleFollow: (projectId: string) => void;
  onJoinProject: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenCreateProject,
  onToggleFollow,
  onJoinProject,
}) => {
  return (
    <section id="projects" className="py-28 border-b border-zinc-800 relative bg-[#0d0e13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-heading max-w-2xl leading-[1.12]">
              Don't just study what's being built.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300">
                Help build what's next.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="create-project-btn"
              onClick={onOpenCreateProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 hover:brightness-105 text-zinc-950 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-[0_2px_16px_rgba(251,207,232,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Start a Project</span>
            </button>
          </div>
        </div>

        {/* Horizontal Project Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="group relative rounded-2xl bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-6 overflow-hidden shadow-xl"
            >
              {/* Glowing Ambient Top */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: '#fbcfe8' }}
              />

              <div>
                {/* Status & Category */}
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-800">
                  <span className="text-[10px] font-mono-tech text-zinc-400 tracking-[1px] uppercase">
                    {project.category}
                  </span>
                  {project.recruiting ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950/50 border border-pink-300/40 text-[9px] font-mono-tech text-pink-200 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-ping" />
                      RECRUITING
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1c1d29] border border-zinc-800 text-[9px] font-mono-tech text-zinc-400">
                      ACTIVE TEAM
                    </span>
                  )}
                </div>

                {/* Project Title & Tagline */}
                <h3 
                  onClick={() => onSelectProject(project)}
                  className="text-lg font-bold text-white group-hover:text-pink-200 transition-colors font-heading mb-2 cursor-pointer leading-snug"
                >
                  {project.name}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                  {project.tagline}
                </p>

                {/* Skills Required Tags */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {project.skillsRequired.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full bg-[#1a1b26] border border-zinc-800 text-[10px] font-mono-tech text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skillsRequired.length > 3 && (
                    <span className="px-2 py-1 rounded-full bg-[#1a1b26] text-[10px] font-mono-tech text-zinc-400">
                      +{project.skillsRequired.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress & Actions Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800 space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                    <span>BUILD PROGRESS</span>
                    <span className="text-white font-bold">{project.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-300 to-rose-300 rounded-full"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics & CTA Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs font-mono-tech text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      {project.membersCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart 
                        className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                          project.isFollowing ? 'fill-pink-300 text-pink-300' : 'text-zinc-400 hover:text-pink-300'
                        }`}
                        onClick={() => onToggleFollow(project.id)}
                      />
                      {project.followersCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.recruiting && (
                      <button
                        onClick={() => onJoinProject(project.id)}
                        disabled={project.hasApplied}
                        className={`px-3.5 py-1.5 text-xs font-mono-tech rounded-full transition-all cursor-pointer font-semibold ${
                          project.hasApplied
                            ? 'bg-pink-950/40 border border-pink-300/40 text-pink-200'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        }`}
                      >
                        {project.hasApplied ? 'Applied' : 'Join'}
                      </button>
                    )}

                    <button
                      onClick={() => onSelectProject(project)}
                      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-pink-200 border border-zinc-700 hover:border-pink-300/50 transition-all cursor-pointer"
                      title="View Project Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
