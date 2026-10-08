import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTerminal } from './components/AboutTerminal';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TimelineSection } from './components/TimelineSection';
import { ArticlesSection } from './components/ArticlesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { TerminalModal } from './components/TerminalModal';
import { ProjectModal } from './components/ProjectModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { api } from './services/api';
import { PublicPortfolioData, AdminUser, Project } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

function PortfolioApp() {
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [view, setView] = useState<'public' | 'admin_login' | 'admin_dashboard'>('public');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactive HUD Modals State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [paletteSelectedProject, setPaletteSelectedProject] = useState<Project | null>(null);

  // Global Keydown listener for Command Palette (Ctrl+K / Cmd+K) and Terminal (`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load initial portfolio data and check current session
  const fetchData = async () => {
    try {
      if (!data) setLoading(true);
      setError(null);
      const [portfolioData, user] = await Promise.all([
        api.getPublicData(),
        api.getCurrentUser()
      ]);
      setData(portfolioData);
      setCurrentUser(user);
    } catch (err: any) {
      console.error('Initialization error:', err);
      setError(err.message || 'Failed to initialize portfolio nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminClick = () => {
    if (currentUser) {
      setView('admin_dashboard');
    } else {
      setView('admin_login');
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setView('admin_dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setView('public');
  };

  const handleViewPublic = async () => {
    try {
      const refreshed = await api.getPublicData();
      setData(refreshed);
    } catch (e) {
      console.error('Failed to refresh public data:', e);
    }
    setView('public');
  };

  // If viewing admin login
  if (view === 'admin_login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={() => setView('public')}
      />
    );
  }

  // If viewing admin dashboard
  if (view === 'admin_dashboard' && currentUser) {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
        onViewPublic={handleViewPublic}
        onDataChanged={fetchData}
      />
    );
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-cyber-950 flex flex-col items-center justify-center font-mono text-cyber-neon gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-cyber-neon/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-2 border-cyber-neon border-t-transparent animate-spin" />
        </div>
        <div className="text-sm tracking-widest flex items-center gap-2">
          <span>CONNECTING TO YEHIA WAEL SECURE DATASTORE...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-cyber-950 flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="max-w-md p-8 rounded-xl bg-cyber-900 border border-red-500/40 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2 font-tech tracking-wide">
            TRANSMISSION INTERRUPTED
          </h2>
          <p className="text-xs text-slate-300 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2.5 rounded bg-cyber-neon text-cyber-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto hover:bg-cyan-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RECONNECT PROTOCOL</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 selection:bg-cyber-neon/30 selection:text-cyber-neon relative">
      {/* HUD Navigation */}
      <Navbar
        onAdminClick={handleAdminClick}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          profile={data.profile}
          stats={data.stats}
        />

        {/* Identity & Terminal Bio Section */}
        <AboutTerminal
          profile={data.profile}
        />

        {/* Technical Arsenal Skills Section */}
        <SkillsSection
          skills={data.skills}
        />

        {/* Featured Projects & Protocols Showcase */}
        <ProjectsSection
          projects={data.projects}
        />

        {/* Career & Academic Timeline */}
        <TimelineSection
          experience={data.experience}
          education={data.education}
        />

        {/* Engineering Insights & Technical Articles */}
        <ArticlesSection
          articles={data.articles || []}
        />

        {/* Verified Peer Recommendations */}
        <TestimonialsSection
          testimonials={data.testimonials || []}
        />

        {/* Communication Terminal (Contact Form) */}
        <ContactSection
          profile={data.profile}
        />
      </main>

      {/* Footer */}
      <Footer
        onAdminClick={handleAdminClick}
      />

      {/* Global Command Search Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={data.projects}
        profile={data.profile}
        onSelectProject={(proj) => {
          setIsCommandPaletteOpen(false);
          setPaletteSelectedProject(proj);
        }}
        onOpenTerminal={() => {
          setIsCommandPaletteOpen(false);
          setIsTerminalOpen(true);
        }}
        onAdminClick={handleAdminClick}
      />

      {/* Interactive Developer CLI Terminal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        profile={data.profile}
        skills={data.skills}
        projects={data.projects}
        articles={data.articles || []}
      />

      {/* Project Detail Modal from Command Palette */}
      <ProjectModal
        project={paletteSelectedProject}
        onClose={() => setPaletteSelectedProject(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PortfolioApp />
    </ToastProvider>
  );
}
