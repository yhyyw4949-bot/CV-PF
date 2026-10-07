import React, { useState, useMemo } from 'react';
import { Cpu, Zap, Layers, Sparkles } from 'lucide-react';
import { Skill } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => set.add(s.category));
    return ['ALL', ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'ALL') return skills;
    return skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 02. TECHNICAL ARSENAL</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide">
              SYSTEM CAPABILITIES &amp; SPECIALIZATIONS
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Proficiency levels calibrated across enterprise engineering, game engines &amp; cloud systems
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-lg bg-cyber-900/70 border border-cyber-border hover:border-cyber-neon/40 hover:bg-cyber-900/90 transition-all duration-300 group shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-neon group-hover:shadow-[0_0_8px_#00f5ff] transition-all" />
                  <span className="font-mono text-sm font-semibold text-slate-100 group-hover:text-cyber-neon transition-colors">
                    {skill.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-cyber-green font-bold">
                  {skill.proficiency}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>CATEGORY</span>
                <span className="text-slate-300">{skill.category}</span>
              </div>

              {/* Progress Bar with glowing cyber gradient */}
              <div className="w-full h-1.5 bg-cyber-950 rounded-full overflow-hidden p-[1px] border border-cyber-border/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-neon to-cyber-green transition-all duration-500 group-hover:shadow-[0_0_10px_#00ff88]"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
