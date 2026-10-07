import React, { useEffect } from 'react';
import { X, ExternalLink, Star, Cpu } from 'lucide-react';
import { GithubIcon } from './Icons';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-cyber-900 border border-cyber-neon/40 rounded-xl shadow-2xl shadow-cyber-neon/10 overflow-hidden z-10 my-8">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-cyber-950 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-neon animate-pulse" />
            <span className="font-mono text-xs text-cyber-neon uppercase tracking-wider">
              PROTOCOL // {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-cyber-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Project Image Banner */}
          <div className="relative w-full h-56 sm:h-72 rounded-lg bg-cyber-950 border border-cyber-border overflow-hidden">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            {/* Fallback Graphic */}
            <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center bg-gradient-to-br from-cyber-950 to-cyber-900 text-slate-500">
              <Cpu className="w-16 h-16 text-cyber-neon/30 mb-2" />
              <span className="font-mono text-xs text-slate-400 tracking-widest">{project.title}</span>
            </div>
            {project.is_featured ? (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-cyber-950/90 border border-cyber-neon rounded text-cyber-neon font-mono text-[11px] tracking-wider shadow-neon-cyan/30">
                FEATURED SYSTEM
              </div>
            ) : null}
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-tech font-bold text-white mb-2">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="font-mono text-xs sm:text-sm text-cyber-neon">
                &gt; {project.tagline}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            {project.description.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tech Stack Chips */}
          <div>
            <div className="font-mono text-xs text-slate-400 mb-2 tracking-wider">// SYSTEM ARCHITECTURE:</div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-cyber-950 border border-cyber-border text-slate-200 font-mono text-xs hover:border-cyber-green transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* External Links Bar */}
          <div className="pt-4 border-t border-cyber-border flex flex-wrap items-center gap-3">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-cyan-300 transition-colors shadow-neon-cyan/40"
              >
                <ExternalLink className="w-4 h-4" />
                <span>LAUNCH LIVE DEMO</span>
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded border border-cyber-border bg-cyber-950 text-slate-200 hover:border-cyber-neon hover:text-cyber-neon font-mono text-xs tracking-wider flex items-center gap-2 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>INSPECT SOURCE</span>
              </a>
            )}

            {project.stars_count > 0 && (
              <div className="ml-auto flex items-center gap-1.5 font-mono text-xs text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{project.stars_count} STARS</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
