import React from 'react';
import { AboutTerminal } from '../components/AboutTerminal';
import { Profile, Education } from '../types';
import { Terminal, GraduationCap, Calendar, MapPin, Award, FileText } from 'lucide-react';

interface AboutPageProps {
  profile: Profile;
  education?: Education[];
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile, education = [] }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-neon tracking-widest mb-2">
          <Terminal className="w-4 h-4 text-cyber-green" />
          <span>// NODE: 01 // IDENTITY_RECORD</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          OPERATIVE IDENTITY &amp; BIO
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          System telemetry, hardware architecture mindset, background specifications, and credentials.
        </p>
      </div>

      {/* Main Terminal Profile Component */}
      <AboutTerminal profile={profile} />

      {/* Academic Qualifications & Degrees */}
      {education.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-purple tracking-widest mb-6 pb-2 border-b border-cyber-border">
            <GraduationCap className="w-4 h-4" />
            <span>// FORMAL EDUCATION &amp; CREDENTIALS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded-xl border border-cyber-border bg-cyber-900/60 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-tech text-xl font-bold text-white">
                    {edu.degree}
                  </h3>
                  {edu.grade && (
                    <span className="px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/40 font-mono text-[10px] text-cyber-green">
                      {edu.grade}
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs text-cyber-neon mb-3">
                  {edu.institution} {edu.field_of_study ? `// ${edu.field_of_study}` : ''}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {edu.start_date} &ndash; {edu.end_date || 'Present'}
                  </span>
                </div>

                {edu.description && (
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
