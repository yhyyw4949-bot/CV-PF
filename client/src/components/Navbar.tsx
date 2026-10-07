import React, { useState, useEffect } from 'react';
import {
  Menu, X, Shield, Terminal, Code2, FolderGit2, Cpu, Mail,
  Search, Volume2, VolumeX, FileText, MessageSquareQuote
} from 'lucide-react';
import { Logo } from './Logo';
import { sound } from '../utils/sound';

interface NavbarProps {
  onAdminClick: () => void;
  onOpenSearch: () => void;
  onOpenTerminal: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAdminClick,
  onOpenSearch,
  onOpenTerminal,
  isAdminLoggedIn
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(sound.isEnabled());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    const next = sound.toggle();
    setIsAudioOn(next);
  };

  const navLinks = [
    { label: '// BIO', href: '#about', icon: Terminal },
    { label: '// SKILLS', href: '#skills', icon: Cpu },
    { label: '// PROJECTS', href: '#projects', icon: FolderGit2 },
    { label: '// TIMELINE', href: '#timeline', icon: Code2 },
    { label: '// INSIGHTS', href: '#articles', icon: FileText },
    { label: '// REVIEWS', href: '#testimonials', icon: MessageSquareQuote },
    { label: '// TRANSMIT', href: '#contact', icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-cyber-950/85 backdrop-blur-md border-b border-cyber-border/70 py-2.5 shadow-lg shadow-black/40'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Clean Web Engineering Brand Logo */}
          <a
            href="#"
            className="group focus:outline-none"
            aria-label="Yehia Wael - Home"
          >
            <Logo size={36} showText={true} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => sound.playClick()}
                className="px-2.5 py-1.5 font-mono text-[11px] text-slate-300 hover:text-cyber-neon hover:bg-cyber-neon/5 rounded border border-transparent hover:border-cyber-neon/30 transition-all tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Admin Gate */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Search / Command Palette (Ctrl+K) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSearch();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-cyber-900/60 border border-cyber-border hover:border-cyber-neon text-slate-300 hover:text-cyber-neon font-mono text-xs transition-colors"
              title="Search and Commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyber-neon" />
              <span className="hidden md:inline text-[11px] text-slate-400">Search</span>
              <kbd className="text-[10px] bg-cyber-950 px-1.5 py-0.5 rounded border border-cyber-border/60 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Interactive Terminal Shell Launch */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenTerminal();
              }}
              className="p-1.5 rounded bg-cyber-900/60 border border-cyber-border hover:border-cyber-green text-slate-300 hover:text-cyber-green transition-colors"
              title="Launch Interactive Dev Terminal"
            >
              <Terminal className="w-4 h-4 text-cyber-green" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`p-1.5 rounded border transition-colors ${
                isAudioOn
                  ? 'bg-cyber-900/60 border-cyber-border text-cyber-neon hover:border-cyber-neon'
                  : 'bg-cyber-900/60 border-cyber-border text-slate-500 hover:text-slate-300'
              }`}
              title={isAudioOn ? 'Audio FX Enabled (Click to Mute)' : 'Audio FX Muted (Click to Enable)'}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => {
                sound.playClick();
                onAdminClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs tracking-wider border transition-all duration-300 ${
                isAdminLoggedIn
                  ? 'border-cyber-green text-cyber-green bg-cyber-green/10 hover:bg-cyber-green/20 shadow-neon-green/30'
                  : 'border-cyber-border text-slate-300 hover:border-cyber-neon hover:text-cyber-neon bg-cyber-900/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'ADMIN' : 'PORTAL'}</span>
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-slate-300 hover:text-cyber-neon rounded border border-cyber-border"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenTerminal}
              className="p-1.5 text-slate-300 hover:text-cyber-green rounded border border-cyber-border"
              title="Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-cyber-neon rounded border border-cyber-border focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cyber-950/95 backdrop-blur-xl border-b border-cyber-border/80 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    sound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded font-mono text-xs text-slate-200 hover:text-cyber-neon hover:bg-cyber-neon/10 border border-transparent hover:border-cyber-neon/30"
                >
                  <Icon className="w-4 h-4 text-cyber-neon" />
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="pt-3 border-t border-cyber-border/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-mono text-xs border border-cyber-border text-slate-300 hover:border-cyber-neon"
              >
                <Search className="w-4 h-4 text-cyber-neon" />
                <span>COMMAND SEARCH (CTRL+K)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider border border-cyber-neon text-cyber-neon bg-cyber-neon/10"
              >
                <Shield className="w-4 h-4" />
                <span>{isAdminLoggedIn ? 'ACCESS ADMIN DASHBOARD' : 'LOGIN TO ADMIN PORTAL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
