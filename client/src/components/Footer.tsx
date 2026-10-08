import React from 'react';
import { ChevronUp, Shield, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onAdminClick: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyber-border/80 bg-cyber-950 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <Logo size={32} showText={true} />
            <p className="font-mono text-[11px] text-slate-500 mt-1">
              Engineered with React, Tailwind CSS, Node.js &amp; SQLite. High-performance web architecture.
            </p>
          </div>

          {/* Action Center & Back to Top */}
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-cyber-purple px-3 py-1.5 rounded border border-cyber-border hover:border-cyber-purple/50 transition-colors"
                title="Replay Awwwards Intro Animation"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyber-purple" />
                <span>REPLAY INTRO</span>
              </button>
            )}

            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-cyber-neon px-3 py-1.5 rounded border border-cyber-border hover:border-cyber-neon/40 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN ACCESS</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-cyber-900 border border-cyber-border text-slate-300 hover:text-cyber-neon hover:border-cyber-neon transition-colors"
              title="Return to orbital top"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cyber-border/40 text-center font-mono text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} YEHIA WAEL. ALL RIGHTS RESERVED.</span>
          <span className="text-cyber-green/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            LATENCY: 12ms // ARCHITECTURE: DISTRIBUTED
          </span>
        </div>
      </div>
    </footer>
  );
};
