import React from 'react';
import { SkillsSection } from '../components/SkillsSection';
import { Skill } from '../types';
import { Cpu } from 'lucide-react';

interface SkillsPageProps {
  skills: Skill[];
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ skills }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-green tracking-widest mb-2">
          <Cpu className="w-4 h-4 text-cyber-neon" />
          <span>// NODE: 02 // TECHNICAL_ARSENAL</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          TECHNICAL STACK &amp; CAPABILITIES
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Categorized frameworks, distributed backend protocols, real-time engines, and proficiency telemetry.
        </p>
      </div>

      {/* Main Skills Component */}
      <SkillsSection skills={skills} />
    </div>
  );
};

export default SkillsPage;
