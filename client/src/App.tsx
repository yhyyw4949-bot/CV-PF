import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { TerminalModal } from './components/TerminalModal';
import { ProjectModal } from './components/ProjectModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AwwwardsIntro } from './components/AwwwardsIntro';
import { PageTransition } from './components/PageTransition';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TimelinePage } from './pages/TimelinePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';

import { api } from './services/api';
import { PublicPortfolioData, AdminUser, Project } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

function PortfolioApp() {
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [view, setView] = useState<'public' | 'admin_login' | 'admin_dashboard'>('public');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return false;
    }
    return true;
  });

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

  const handleReplayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Loading state with Cinematic Awwwards Preloader
  if (loading && !data) {
    return (
      <AwwwardsIntro
        onComplete={() => setShowIntro(false)}
        profileName="YEHIA WAEL"
        profileTitle="SENIOR FULL-STACK & INTERACTIVE ARCHITECT"
      />
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
    <div className="min-h-screen bg-cyber-950 text-slate-100 selection:bg-cyber-neon/30 selection:text-cyber-neon relative flex flex-col justify-between">
      {/* Awwwards Award-Winning Opening Entrance Animation */}
      {showIntro && (
        <AwwwardsIntro
          onComplete={() => setShowIntro(false)}
          profileName={data.profile?.name || 'YEHIA WAEL'}
          profileTitle={data.profile?.title || 'SENIOR FULL-STACK & INTERACTIVE ARCHITECT'}
        />
      )}

      {/* Persistent HUD Navigation */}
      <Navbar
        onAdminClick={handleAdminClick}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onReplayIntro={handleReplayIntro}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      {/* Main Multi-Page Routed Content with Awwwards Portal Shutter Transition */}
      <main className="flex-1">
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage data={data} onSelectProject={(p) => setPaletteSelectedProject(p)} />} />
            <Route path="/about" element={<AboutPage profile={data.profile} education={data.education} />} />
            <Route path="/skills" element={<SkillsPage skills={data.skills} />} />
            <Route path="/projects" element={<ProjectsPage projects={data.projects} onSelectProject={(p) => setPaletteSelectedProject(p)} />} />
            <Route path="/timeline" element={<TimelinePage experience={data.experience} education={data.education} />} />
            <Route path="/articles" element={<ArticlesPage articles={data.articles || []} />} />
            <Route path="/testimonials" element={<TestimonialsPage testimonials={data.testimonials || []} />} />
            <Route path="/contact" element={<ContactPage profile={data.profile} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </main>

      {/* Persistent Footer */}
      <Footer
        onAdminClick={handleAdminClick}
        onReplayIntro={handleReplayIntro}
      />

      {/* Global Command Search Palette (Ctrl+K / Cmd+K) */}
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
        onReplayIntro={handleReplayIntro}
      />

      {/* Interactive Developer CLI Terminal (`) */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        profile={data.profile}
        skills={data.skills}
        projects={data.projects}
        articles={data.articles || []}
      />

      {/* Project Details Modal */}
      {paletteSelectedProject && (
        <ProjectModal
          project={paletteSelectedProject}
          onClose={() => setPaletteSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <PortfolioApp />
      </ToastProvider>
    </BrowserRouter>
  );
}
