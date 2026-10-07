import React, { useState } from 'react';
import { Terminal, MapPin, Mail, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, DiscordIcon, SteamIcon } from './Icons';
import { Profile } from '../types';

interface AboutTerminalProps {
  profile: Profile;
}

export const AboutTerminal: React.FC<AboutTerminalProps> = ({ profile }) => {
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const copyDiscord = () => {
    if (profile.discord_username) {
      navigator.clipboard.writeText(profile.discord_username);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2500);
    }
  };

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 01. IDENTITY &amp; BIO</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        {/* Terminal Card */}
        <div className="rounded-xl border border-cyber-border bg-cyber-900/70 backdrop-blur-md overflow-hidden shadow-2xl">
          {/* Terminal Window Header Bar */}
          <div className="px-4 py-3 bg-cyber-950/90 border-b border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-cyber-green inline-block" />
              <span className="ml-3 font-mono text-xs text-slate-400">
                terminal@yehia-os: ~/identity/profile.json
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-cyber-neon/80">
              <span>ENCRYPTION: AES-256</span>
              <span>//</span>
              <span className="text-cyber-green">STATUS: VERIFIED</span>
            </div>
          </div>

          {/* Terminal Content Body */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Avatar & Cyber Frame Column */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group">
                {/* Glow border ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyber-neon via-cyber-green to-cyber-purple rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                
                {/* Image Container */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-lg bg-cyber-950 border border-cyber-neon/50 overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-900 text-cyber-neon -z-10">
                    <Terminal className="w-16 h-16 text-cyber-neon/50 mb-2" />
                    <span className="font-mono text-xs tracking-widest text-slate-400">OPERATIVE YW</span>
                  </div>

                  {/* Cyber Scanline Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neon/10 to-transparent opacity-20 pointer-events-none animate-scanline" />
                </div>

                {/* Level / Status badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyber-950 border border-cyber-green rounded font-mono text-[10px] text-cyber-green tracking-wider whitespace-nowrap shadow-neon-green/20">
                  LEVEL 99 ARCHITECT
                </div>
              </div>

              {/* Quick Spec Chips Under Avatar */}
              <div className="mt-8 flex flex-col gap-2 w-full max-w-xs font-mono text-xs">
                {profile.location && (
                  <div className="flex items-center gap-2 text-slate-300 bg-cyber-950/60 p-2 rounded border border-cyber-border">
                    <MapPin className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-cyber-neon bg-cyber-950/60 p-2 rounded border border-cyber-border transition-colors"
                  >
                    <Mail className="w-4 h-4 text-cyber-green shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Bio & Operative Telemetry Column */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="inline-block font-mono text-xs text-cyber-neon mb-2">
                &gt; cat /var/log/operative_summary.txt
              </div>
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-white mb-4">
                ENGINEERING INTELLIGENCE &amp; DIGITAL SYSTEMS
              </h2>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-sans mb-8">
                {profile.bio ? (
                  profile.bio.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>
                    Full-Stack Engineer specialized in developing high-throughput web applications, resilient distributed systems, and real-time interactive game platforms.
                  </p>
                )}
              </div>

              {/* Social and Gaming Links Grid */}
              <div className="pt-6 border-t border-cyber-border flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-slate-400 mr-2">// CHANNELS:</span>

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-cyber-neon text-slate-200 hover:text-cyber-neon font-mono text-xs transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-[#0077b5] text-slate-200 hover:text-[#0077b5] font-mono text-xs transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {profile.discord_username && (
                  <button
                    onClick={copyDiscord}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-[#5865F2] text-slate-200 hover:text-[#5865F2] font-mono text-xs transition-colors"
                    title="Click to copy Discord ID"
                  >
                    <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                    <span>{profile.discord_username}</span>
                    {copiedDiscord ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                  </button>
                )}

                {profile.steam_url && (
                  <a
                    href={profile.steam_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-cyber-purple text-slate-200 hover:text-cyber-purple font-mono text-xs transition-colors"
                  >
                    <SteamIcon className="w-4 h-4" />
                    <span>Steam ID</span>
                  </a>
                )}

                {profile.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-slate-300 text-slate-200 hover:text-white font-mono text-xs transition-colors"
                  >
                    <TwitterIcon className="w-4 h-4" />
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
