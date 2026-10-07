import React, { useState } from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Experience, Education } from '../types';

interface TimelineSectionProps {
  experience: Experience[];
  education: Education[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ experience, education }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="timeline" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 04. TRAJECTORY &amp; BACKGROUND</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide">
              CAREER &amp; ACADEMIC RECORD
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Field experience, distributed engineering teams &amp; formal computer science foundation
            </p>
          </div>

          <div className="inline-flex p-1 rounded-lg bg-cyber-900 border border-cyber-border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider transition-all ${
                activeTab === 'experience'
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40 shadow-neon-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>EXPERIENCE ({experience.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider transition-all ${
                activeTab === 'education'
                  ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40 shadow-neon-green/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>EDUCATION ({education.length})</span>
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="relative border-l border-cyber-border ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-10">
          {activeTab === 'experience' ? (
            experience.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Node Connector */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                    exp.is_current
                      ? 'bg-cyber-neon border-cyber-neon shadow-[0_0_12px_#00f5ff] animate-pulse'
                      : 'bg-cyber-950 border-slate-500 group-hover:border-cyber-neon'
                  }`}
                />

                {/* Card Container */}
                <div className="p-6 rounded-xl bg-cyber-900/60 border border-cyber-border group-hover:border-cyber-neon/40 group-hover:bg-cyber-900/90 transition-all shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyber-950 border border-cyber-border text-cyber-neon flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.start_date} {exp.end_date ? `— ${exp.end_date}` : '— Present'}
                    </span>

                    {exp.is_current ? (
                      <span className="font-mono text-[11px] text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 rounded">
                        ACTIVE OPERATIVE
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-tech font-bold text-white mb-1">
                    {exp.role} <span className="text-cyber-green">@ {exp.company}</span>
                  </h3>

                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mb-4">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyber-neon" />
                        {exp.location}
                      </span>
                    )}
                    <span>//</span>
                    <span>{exp.employment_type}</span>
                  </div>

                  {/* Bullet points description */}
                  <div className="space-y-1.5 text-slate-300 text-sm leading-relaxed font-sans mb-4 whitespace-pre-line">
                    {exp.description}
                  </div>

                  {/* Tech stack tags */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cyber-border/60">
                      {exp.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-border text-slate-300 font-mono text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            education.map((edu) => (
              <div key={edu.id} className="relative group">
                {/* Node Connector */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-cyber-950 border-cyber-green shadow-[0_0_8px_#00ff88]" />

                {/* Card Container */}
                <div className="p-6 rounded-xl bg-cyber-900/60 border border-cyber-border group-hover:border-cyber-green/40 group-hover:bg-cyber-900/90 transition-all shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyber-950 border border-cyber-border text-cyber-green flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.start_date} {edu.end_date ? `— ${edu.end_date}` : ''}
                    </span>

                    {edu.grade && (
                      <span className="font-mono text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-tech font-bold text-white mb-1">
                    {edu.degree}
                  </h3>

                  <div className="font-mono text-xs text-cyber-neon mb-4">
                    {edu.institution} {edu.field_of_study ? `— ${edu.field_of_study}` : ''}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed font-sans whitespace-pre-line">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
