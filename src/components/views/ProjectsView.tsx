import React, { useState } from 'react';
import { 
  Layers3, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Heart, 
  ArrowUpRight, 
  Sparkles,
  GitBranch,
  CheckCircle,
  Tag
} from 'lucide-react';
import { ProjectItem, UserProfile } from '../../types';

interface ProjectsViewProps {
  projects: ProjectItem[];
  currentUser: UserProfile;
  onSelectProject: (project: ProjectItem) => void;
  onOpenCreateProject: () => void;
  onToggleFollow: (projectId: string) => void;
  onJoinProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenCreateProject,
  onToggleFollow,
  onJoinProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recruitingOnly, setRecruitingOnly] = useState<boolean>(false);

  const categories: string[] = ['All', 'Autonomous Systems', 'Robotics & Hardware', 'Distributed Systems', 'HealthTech', 'Green Energy'];

  const filteredProjects = projects.filter((proj) => {
    const matchesCat = selectedCategory === 'All' || proj.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRecruiting = !recruitingOnly || proj.recruiting;
    return matchesCat && matchesSearch && matchesRecruiting;
  });

  return (
    <div id="projects-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#bc13fe] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#bc13fe] tracking-[3px] uppercase font-bold">
            <Layers3 className="w-4 h-4 text-[#bc13fe]" />
            <span>CAMPUS INNOVATION & RESEARCH LABS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            RESEARCH & COLLABORATIVE PROJECTS
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Build real hardware prototypes, publish papers, and participate in national hackathons with cross-department student teams.
          </p>
        </div>

        <button
          id="projects-create-btn"
          onClick={onOpenCreateProject}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#bc13fe] hover:bg-[#a010d8] text-white font-bold text-xs font-mono-tech tracking-[2px] uppercase rounded-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(188,19,254,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ PUBLISH PROJECT</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, skills (e.g. PyTorch, ROS)..."
            className="w-full pl-9 pr-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#bc13fe] font-mono-tech"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono-tech tracking-[1px] uppercase rounded-sm transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#bc13fe]/20 border border-[#bc13fe] text-[#bc13fe] font-bold'
                  : 'bg-[#050505] border border-white/5 text-white/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recruiting filter checkbox */}
        <label className="flex items-center gap-2 text-xs font-mono-tech text-white/80 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={recruitingOnly}
            onChange={(e) => setRecruitingOnly(e.target.checked)}
            className="accent-[#bc13fe]"
          />
          <span>Recruiting Only</span>
        </label>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className="group relative rounded-sm bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#bc13fe] hover:border-[#bc13fe] transition-all duration-300 flex flex-col justify-between p-6 overflow-hidden shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono-tech text-white/50 tracking-[1px] uppercase">
                  {project.category}
                </span>
                {project.recruiting ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[9px] font-mono-tech text-[#00f2ff] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping" />
                    RECRUITING
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-sm bg-[#050505] border border-white/10 text-[9px] font-mono-tech text-white/40">
                    ACTIVE TEAM
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h3 
                onClick={() => onSelectProject(project)}
                className="text-xl font-bold text-white group-hover:text-[#bc13fe] transition-colors font-heading mb-2 cursor-pointer"
              >
                {project.name}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed line-clamp-3 mb-4 font-normal">
                {project.tagline}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.skillsRequired.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-sm bg-[#050505] border border-white/[0.08] text-[10px] font-mono-tech text-white/70"
                  >
                    {skill}
                  </span>
                ))}
                {project.skillsRequired.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded-sm bg-[#050505] text-[10px] font-mono-tech text-white/40">
                    +{project.skillsRequired.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Progress & CTAs */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono-tech text-white/50 mb-1.5">
                  <span>BUILD PROGRESS</span>
                  <span className="text-white font-bold">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#050505] rounded-none overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#bc13fe] to-[#00f2ff]"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-xs font-mono-tech text-white/50">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-white/40" />
                    {project.membersCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                        project.isFollowing ? 'fill-[#bc13fe] text-[#bc13fe]' : 'text-white/40 hover:text-[#bc13fe]'
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
                      className={`px-3 py-1.5 text-xs font-mono-tech rounded-sm transition-all cursor-pointer font-bold ${
                        project.hasApplied
                          ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff]'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {project.hasApplied ? 'APPLIED' : 'JOIN'}
                    </button>
                  )}

                  <button
                    onClick={() => onSelectProject(project)}
                    className="p-1.5 rounded-sm bg-[#050505] hover:bg-white/[0.05] text-[#00f2ff] border border-white/10 hover:border-[#00f2ff] transition-all cursor-pointer"
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
  );
};
