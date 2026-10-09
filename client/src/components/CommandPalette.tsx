import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Terminal, FolderGit2, Cpu, Briefcase, Mail,
  Download, FileText, MessageSquare, Volume2, VolumeX,
  ExternalLink, ArrowRight, X, Sparkles
} from 'lucide-react';
import { Project, Profile } from '../types';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  profile: Profile;
  onSelectProject: (project: Project) => void;
  onOpenTerminal: () => void;
  onAdminClick: () => void;
  onReplayIntro?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Projects' | 'Tools';
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  profile,
  onSelectProject,
  onOpenTerminal,
  onAdminClick,
  onReplayIntro
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      sound.playBlip();
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Navigate to Home Overview',
      subtitle: 'Hero, featured highlights & telemetry',
      icon: Terminal,
      action: () => {
        navigate('/');
        onClose();
      }
    },
    {
      id: 'nav-bio',
      category: 'Navigation',
      title: 'Navigate to Operative Bio',
      subtitle: 'View summary and profile channels',
      icon: Terminal,
      action: () => {
        navigate('/about');
        onClose();
      }
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      title: 'Navigate to Skills Matrix',
      subtitle: 'Technical competencies & proficiencies',
      icon: Cpu,
      action: () => {
        navigate('/skills');
        onClose();
      }
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Navigate to Projects',
      subtitle: 'Browse all shipped codebases',
      icon: FolderGit2,
      action: () => {
        navigate('/projects');
        onClose();
      }
    },
    {
      id: 'nav-timeline',
      category: 'Navigation',
      title: 'Navigate to Timeline',
      subtitle: 'Work experience & education record',
      icon: Briefcase,
      action: () => {
        navigate('/timeline');
        onClose();
      }
    },
    {
      id: 'nav-articles',
      category: 'Navigation',
      title: 'Navigate to Technical Articles',
      subtitle: 'Architecture insights & engineering blog',
      icon: FileText,
      action: () => {
        navigate('/articles');
        onClose();
      }
    },
    {
      id: 'nav-testimonials',
      category: 'Navigation',
      title: 'Navigate to Testimonials',
      subtitle: 'Recommendations & peer verification',
      icon: MessageSquare,
      action: () => {
        navigate('/testimonials');
        onClose();
      }
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Initiate Direct Transmission',
      subtitle: 'Dispatch message through secure comm link',
      icon: Mail,
      action: () => {
        navigate('/contact');
        onClose();
      }
    },
    // Tools
    {
      id: 'tool-replay-intro',
      category: 'Tools',
      title: 'Replay Awwwards Cinematic Intro',
      subtitle: 'Watch the boot sequence & curtain shutter entrance animation',
      icon: Sparkles,
      action: () => {
        onClose();
        onReplayIntro?.();
      }
    },
    {
      id: 'tool-terminal',
      category: 'Tools',
      title: 'Launch Interactive Dev Terminal',
      subtitle: 'Execute CLI commands: help, bio, skills, projects...',
      icon: Terminal,
      action: () => {
        onClose();
        onOpenTerminal();
      }
    },
    {
      id: 'tool-admin',
      category: 'Tools',
      title: 'Access Admin Command Matrix',
      subtitle: 'Authenticate to manage site data',
      icon: Sparkles,
      action: () => {
        onClose();
        onAdminClick();
      }
    },
    // Actions
    {
      id: 'act-download-cv',
      category: 'Actions',
      title: 'Download Resume [PDF]',
      subtitle: 'Fetch digital CV document',
      icon: Download,
      action: () => {
        window.open(profile.resume_url || '/Yehia_Wael_CV.pdf', '_blank');
        onClose();
      }
    },
    {
      id: 'act-copy-email',
      category: 'Actions',
      title: 'Copy Email Address',
      subtitle: profile.email || 'yehia@wael.dev',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(profile.email || 'yehia@wael.dev');
        sound.playChime();
        onClose();
      }
    },
    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.id}`,
      category: 'Projects' as const,
      title: p.title,
      subtitle: `${p.category} // ${p.technologies.slice(0, 3).join(', ')}`,
      icon: FolderGit2,
      action: () => {
        onSelectProject(p);
        onClose();
      }
    }))
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      sound.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      sound.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        sound.playClick();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-cyber-900 border border-cyber-neon/40 rounded-xl shadow-2xl shadow-cyber-neon/15 overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Input Bar */}
        <div className="p-4 bg-cyber-950 border-b border-cyber-border flex items-center gap-3">
          <Search className="w-5 h-5 text-cyber-neon shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, protocols, projects, skills... (↑↓ to navigate, ↵ to execute)"
            className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-cyber-900 border border-cyber-border text-slate-400 font-mono text-[10px]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-slate-500">
              NO PROTOCOLS FOUND MATCHING &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                      : 'border border-transparent text-slate-300 hover:bg-cyber-950'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`p-2 rounded shrink-0 ${
                        isSelected
                          ? 'bg-cyber-neon text-cyber-950'
                          : 'bg-cyber-950 border border-cyber-border text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-mono text-xs font-semibold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyber-950/80 border border-cyber-border/80 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <div className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-cyber-neon shrink-0 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-cyber-950/90 border-t border-cyber-border flex items-center justify-between font-mono text-[10px] text-slate-500">
          <div className="flex items-center gap-4">
            <span>[↑↓] Select</span>
            <span>[↵] Execute</span>
            <span>[ESC] Dismiss</span>
          </div>
          <span className="text-cyber-green">CMD // PALETTE V2.6</span>
        </div>
      </div>
    </div>
  );
};
