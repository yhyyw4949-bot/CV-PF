import React, { useState, useMemo } from 'react';
import { ExternalLink, FolderGit2, Star, ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { GithubIcon } from './Icons';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { sound } from '../utils/sound';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'stars' | 'newest'>('featured');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Category filter
        const matchesCategory = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCategory) return false;

        // Search filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return (b.stars_count || 0) - (a.stars_count || 0);
        if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
        // Default featured
        if (b.is_featured !== a.is_featured) return b.is_featured - a.is_featured;
        return (a.order_index || 0) - (b.order_index || 0);
      });
  }, [projects, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 03. SHIPPED PROTOCOLS &amp; SYSTEMS</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide">
              FEATURED PROJECTS &amp; CODEBASES
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Live web apps, interactive WebGL shaders, distributed backend engines, and developer tools
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded font-mono text-xs tracking-wider border transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cyber-neon/15 border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                    : 'bg-cyber-900/60 border-cyber-border text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort HUD Bar */}
        <div className="p-3 mb-8 rounded-xl bg-cyber-900/60 border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech (e.g. React, Rust, Redis)..."
              className="w-full pl-9 pr-8 py-1.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon text-xs font-mono text-slate-200 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector & Result Counter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-mono text-[11px] text-slate-400">
              Showing <span className="text-cyber-neon font-bold">{filteredProjects.length}</span> of {projects.length}
            </span>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  sound.playClick();
                  setSortBy(e.target.value as any);
                }}
                className="bg-cyber-950 border border-cyber-border rounded px-2.5 py-1 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyber-neon cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="stars">Most Starred</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-xl bg-cyber-900/40 border border-cyber-border font-mono text-xs text-slate-400">
            No protocols found matching &ldquo;{searchQuery}&rdquo;.
            <div className="mt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-cyber-neon hover:underline"
              >
                [Reset Search Filters]
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col rounded-xl bg-cyber-900/70 border border-cyber-border hover:border-cyber-neon/60 transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-neon-cyan/15 hover:-translate-y-1"
              >
                {/* Card Banner / Thumbnail */}
                <div
                  className="relative h-48 w-full bg-cyber-950 overflow-hidden cursor-pointer"
                  onClick={() => {
                    sound.playClick();
                    setActiveProject(project);
                  }}
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback Graphic */}
                  <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center bg-gradient-to-br from-cyber-950 via-cyber-900 to-cyber-950 text-slate-500">
                    <FolderGit2 className="w-12 h-12 text-cyber-neon/40 mb-2 group-hover:text-cyber-neon transition-colors" />
                    <span className="font-mono text-xs text-slate-400 tracking-wider">PROJECT INTEL</span>
                  </div>

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-900 via-transparent to-transparent opacity-70" />

                  {/* Featured Badge */}
                  {project.is_featured ? (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-cyber-950/90 border border-cyber-green text-cyber-green font-mono text-[10px] tracking-wider shadow-neon-green/30">
                      FEATURED
                    </div>
                  ) : null}

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-cyber-950/90 border border-cyber-border text-slate-300 font-mono text-[10px] tracking-wider">
                    {project.category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      onClick={() => {
                        sound.playClick();
                        setActiveProject(project);
                      }}
                      className="text-lg font-tech font-bold text-white group-hover:text-cyber-neon transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                    {project.stars_count > 0 && (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-amber-400 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{project.stars_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Tagline / Snippet */}
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed font-sans">
                    {project.tagline || project.description}
                  </p>

                  {/* Technologies List */}
                  <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(tech)}
                        className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-border/70 hover:border-cyber-neon text-slate-300 font-mono text-[11px] transition-colors"
                        title={`Filter by ${tech}`}
                      >
                        {tech}
                      </button>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 text-slate-400 font-mono text-[11px]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-cyber-border/70 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveProject(project);
                      }}
                      className="font-mono text-xs text-cyber-neon hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <span>VIEW INTEL</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-cyber-800 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-cyber-green hover:text-emerald-300 hover:bg-cyber-800 transition-colors"
                          title="Live Demonstration"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
