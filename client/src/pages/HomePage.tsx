import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { PublicPortfolioData, Project } from '../types';
import { ArrowRight, Code2, Cpu, Terminal, FolderGit2, Sparkles, Send, ExternalLink, Star } from 'lucide-react';
import { sound } from '../utils/sound';

interface HomePageProps {
  data: PublicPortfolioData;
  onSelectProject: (project: Project) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onSelectProject }) => {
  const featuredProjects = data.projects.filter(p => p.is_featured).slice(0, 3);
  const featuredSkills = data.skills.slice(0, 8);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <Hero profile={data.profile} stats={data.stats} />

      {/* Featured Projects Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-cyber-border/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyber-neon font-mono text-xs tracking-widest mb-1">
              <FolderGit2 className="w-4 h-4 text-cyber-green" />
              <span>// PROTOCOLS // FEATURED WORK</span>
            </div>
            <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              FLAGSHIP ARCHITECTURES
            </h2>
          </div>

          <Link
            to="/projects"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 font-mono text-xs text-cyber-neon hover:text-white px-4 py-2 rounded bg-cyber-900/60 border border-cyber-border hover:border-cyber-neon transition-all group"
          >
            <span>VIEW ALL PROJECTS ({data.projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="rounded-xl border border-cyber-border bg-cyber-900/60 hover:bg-cyber-900/90 hover:border-cyber-neon/50 p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-neon-cyan/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-cyber-950 border border-cyber-border font-mono text-[10px] text-cyber-neon uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs text-cyber-gold">
                    <Star className="w-3 h-3 fill-cyber-gold" />
                    <span>{project.stars_count}</span>
                  </div>
                </div>

                <h3 className="font-tech text-xl font-bold text-white group-hover:text-cyber-neon transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-slate-300 line-clamp-3 mb-6 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-border font-mono text-[10px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-border font-mono text-[10px] text-slate-500">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cyber-border/60 font-mono text-xs text-cyber-neon group-hover:translate-x-0.5 transition-transform">
                  <span>INSPECT PROTOCOL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operative Identity & Bio Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyber-border bg-gradient-to-r from-cyber-900/80 via-cyber-950/90 to-cyber-900/80 p-8 sm:p-12 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-neon/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 font-mono text-xs text-cyber-green mb-3">
                <Terminal className="w-4 h-4" />
                <span>// OPERATIVE SPECIFICATION</span>
              </div>
              <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white mb-4">
                DISTRIBUTED SYSTEMS &amp; INTERACTIVE EXPERIENCES
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans mb-6">
                Specializing in robust backend infrastructure, distributed low-latency APIs, and cutting-edge frontend interfaces with real-time audio and graphics telemetry.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  onClick={() => sound.playClick()}
                  className="px-5 py-2.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-300 transition-colors shadow-neon-cyan"
                >
                  <Terminal className="w-4 h-4" />
                  <span>EXPLORE IDENTITY &amp; RESUME</span>
                </Link>
                <Link
                  to="/skills"
                  onClick={() => sound.playClick()}
                  className="px-5 py-2.5 rounded border border-cyber-border hover:border-cyber-green text-slate-300 hover:text-white font-mono text-xs tracking-wider flex items-center gap-2 bg-cyber-900/60 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-cyber-green" />
                  <span>INSPECT TECHNICAL ARSENAL</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-cyber-950 border border-cyber-border">
                <span className="text-slate-500 block text-[10px]">CURRENT ROLE:</span>
                <span className="text-cyber-neon font-bold">{data.profile.title}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-cyber-950 border border-cyber-border">
                <span className="text-slate-500 block text-[10px]">OPERATING BASE:</span>
                <span className="text-slate-200">{data.profile.location || 'Cairo, Egypt / Worldwide'}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-cyber-950 border border-cyber-border">
                <span className="text-slate-500 block text-[10px]">VERIFIED CONTACT:</span>
                <span className="text-cyber-green">{data.profile.email || 'yehia@wael.dev'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Transmission Prompt */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="py-12 px-6 rounded-2xl border border-cyber-neon/30 bg-cyber-900/40 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,245,255,0.08),transparent_70%)] pointer-events-none" />
          <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white mb-3 relative z-10">
            HAVE A PROJECT OR VISION IN MIND?
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 relative z-10">
            Available for enterprise contracts, architecture consulting, full-stack builds, and high-performance engineering roles.
          </p>
          <Link
            to="/contact"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-neon-cyan relative z-10"
          >
            <Send className="w-4 h-4 text-cyber-950" />
            <span>TRANSMIT DIRECT MESSAGE</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
