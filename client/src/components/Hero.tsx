import React from 'react';
import { Terminal, ArrowDownRight, Download, Send, Sparkles, Cpu, Zap, Code2 } from 'lucide-react';
import { Profile, Stat } from '../types';

interface HeroProps {
  profile: Profile;
  stats: Stat[];
}

export const Hero: React.FC<HeroProps> = ({ profile, stats }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyber-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-cyber-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-start max-w-4xl">
          {/* Status HUD Chip */}
          <div className="hero-animate-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyber-neon/30 bg-cyber-900/80 backdrop-blur-md mb-6 shadow-neon-cyan/20">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
            <span className="font-mono text-[11px] tracking-widest text-slate-200">
              {profile.status_text || 'STATUS: ONLINE // AVAILABLE FOR HIRE'}
            </span>
          </div>

          {/* Main Gamer / Architect Headline */}
          <h1 className="hero-animate-2 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-tech text-white leading-none mb-4">
            <span className="text-slate-400 font-mono text-xl sm:text-2xl block mb-2 font-normal">
              &gt; system.init(&ldquo;portfolio&rdquo;);
            </span>
            I AM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-emerald-400 to-cyber-purple drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">{profile.name.toUpperCase()}</span>
          </h1>

          {/* Subtitle / Role */}
          <div className="hero-animate-2 font-mono text-lg sm:text-2xl text-cyber-neon font-medium mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-green" />
            <span>{profile.title}</span>
          </div>

          {/* Tagline / Bio Hook */}
          <p className="hero-animate-3 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-8 font-sans">
            {profile.tagline || 'Building resilient distributed architectures, high-performance backends, and immersive cyber experiences.'}
          </p>

          {/* Call to Actions */}
          <div className="hero-animate-3 flex flex-wrap items-center gap-4 mb-14">
            <a
              href="#projects"
              className="px-6 py-3.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-cyan-300 transition-all duration-200 shadow-neon-cyan flex items-center gap-2 group"
            >
              <span>BROWSE PROJECTS</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-6 py-3.5 rounded border border-cyber-neon/50 bg-cyber-900/60 hover:bg-cyber-neon/10 hover:border-cyber-neon text-slate-100 font-mono font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-cyber-green" />
              <span>TRANSMIT MESSAGE</span>
            </a>

            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                download
                className="px-5 py-3.5 rounded border border-cyber-border bg-cyber-900/40 hover:border-slate-400 text-slate-300 hover:text-white font-mono text-xs sm:text-sm tracking-wider flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-cyber-purple" />
                <span>RESUME [PDF]</span>
              </a>
            )}
          </div>

          {/* Interactive Gamer / Tech Stats Grid */}
          <div className="hero-animate-4 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-cyber-border/80">
            {stats && stats.length > 0 ? (
              stats.map((st) => (
                <div
                  key={st.id || st.label}
                  className="p-4 rounded-lg bg-cyber-900/60 border border-cyber-border hover:border-cyber-neon/40 hover:bg-cyber-900/90 transition-all group"
                >
                  <div className="font-tech text-2xl sm:text-3xl font-bold text-cyber-neon group-hover:drop-shadow-[0_0_10px_rgba(0,245,255,0.5)] transition-all">
                    {st.value}
                  </div>
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mt-1">
                    {st.label}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-4 rounded-lg bg-cyber-900/60 border border-cyber-border">
                  <div className="font-tech text-3xl font-bold text-cyber-neon">5+</div>
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Years Experience</div>
                </div>
                <div className="p-4 rounded-lg bg-cyber-900/60 border border-cyber-border">
                  <div className="font-tech text-3xl font-bold text-cyber-green">28+</div>
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Production Projects</div>
                </div>
                <div className="p-4 rounded-lg bg-cyber-900/60 border border-cyber-border">
                  <div className="font-tech text-3xl font-bold text-cyber-purple">18+</div>
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Tech Mastered</div>
                </div>
                <div className="p-4 rounded-lg bg-cyber-900/60 border border-cyber-border">
                  <div className="font-tech text-3xl font-bold text-cyber-pink">1.4K+</div>
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Energy Drinks</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
