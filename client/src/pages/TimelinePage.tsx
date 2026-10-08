import React from 'react';
import { TimelineSection } from '../components/TimelineSection';
import { Experience, Education } from '../types';
import { Code2 } from 'lucide-react';

interface TimelinePageProps {
  experience: Experience[];
  education: Education[];
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ experience, education }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-purple tracking-widest mb-2">
          <Code2 className="w-4 h-4 text-cyber-green" />
          <span>// NODE: 04 // CAREER_CHRONOLOGY</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          CAREER &amp; ACADEMIC TIMELINE
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Track record across software engineering roles, team leadership, architectural achievements, and degree qualifications.
        </p>
      </div>

      {/* Main Timeline Component */}
      <TimelineSection experience={experience} education={education} />
    </div>
  );
};

export default TimelinePage;
