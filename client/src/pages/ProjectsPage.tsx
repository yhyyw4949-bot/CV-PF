import React from 'react';
import { ProjectsSection } from '../components/ProjectsSection';
import { Project } from '../types';
import { FolderGit2 } from 'lucide-react';

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-neon tracking-widest mb-2">
          <FolderGit2 className="w-4 h-4 text-cyber-green" />
          <span>// NODE: 03 // PRODUCTION_WORK</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          PROJECTS &amp; REPOSITORIES
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Full-stack web applications, interactive 3D simulations, distributed backend APIs, and open-source systems.
        </p>
      </div>

      {/* Main Projects Component */}
      <ProjectsSection projects={projects} />
    </div>
  );
};

export default ProjectsPage;
