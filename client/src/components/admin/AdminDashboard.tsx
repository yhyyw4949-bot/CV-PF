import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, UserCheck, FolderGit2, Cpu, Briefcase,
  GraduationCap, Mail, Shield, LogOut, ArrowLeft, Plus,
  Trash2, Edit3, Save, CheckCircle, ExternalLink, RefreshCw,
  Star, Eye, Check, X, Key, Upload, FileText, MessageSquareQuote, Download
} from 'lucide-react';

import {
  Profile, Project, Skill, Experience, Education,
  Message, AdminUser, DashboardOverview, Article, Testimonial
} from '../../types';
import { api } from '../../services/api';
import { useToast } from '../Toast';
import { FileUpload } from './FileUpload';
import { Logo } from '../Logo';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onViewPublic: () => void;
  onDataChanged: () => void;
}

type TabType = 'overview' | 'profile' | 'projects' | 'skills' | 'experience' | 'education' | 'articles' | 'testimonials' | 'messages' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onViewPublic,
  onDataChanged
}) => {
  const { success, error: toastError, info } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Dashboard Data State
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Project Editor Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Skill Editor Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  // Experience Editor Modal State
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);

  // Education Editor Modal State
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);

  // Article Editor Modal State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Testimonial Editor Modal State
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Security Credentials Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newEmail: user.email,
    newPassword: ''
  });

  // Fetch all admin data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [ov, prof, projs, sks, exps, edus, arts, tests, msgs] = await Promise.all([
        api.getOverview(),
        api.getAdminProfile(),
        api.getProjects(),
        api.getSkills(),
        api.getExperience(),
        api.getEducation(),
        api.getArticles(),
        api.getTestimonials(),
        api.getMessages()
      ]);
      setOverview(ov);
      setProfile(prof);
      setProjects(projs);
      setSkills(sks);
      setExperience(exps);
      setEducation(edus);
      setArticles(arts);
      setTestimonials(tests);
      setMessages(msgs);
    } catch (err: any) {
      toastError(err.message || 'Failed to load command center data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // PROFILE SAVE
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      success('Operative profile saved to persistent datastore.');
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
    }
  };

  // PROJECT SAVE (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.description) {
      toastError('Title and description are required.');
      return;
    }

    try {
      if (editingProject.id) {
        const updated = await api.updateProject(editingProject.id, editingProject);
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
        success(`Project "${updated.title}" updated.`);
      } else {
        const created = await api.createProject(editingProject);
        setProjects([created, ...projects]);
        success(`Project "${created.title}" initialized.`);
      }
      setProjectModalOpen(false);
      setEditingProject(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: number, title: string) => {
    if (!window.confirm(`Delete protocol "${title}" permanently?`)) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      success(`Project "${title}" eradicated.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete project');
    }
  };

  // SKILL SAVE
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name || !editingSkill.category) return;

    try {
      if (editingSkill.id) {
        const updated = await api.updateSkill(editingSkill.id, editingSkill);
        setSkills(skills.map((s) => (s.id === updated.id ? updated : s)));
        success(`Skill "${updated.name}" updated.`);
      } else {
        const created = await api.createSkill(editingSkill);
        setSkills([...skills, created]);
        success(`Skill "${created.name}" registered.`);
      }
      setSkillModalOpen(false);
      setEditingSkill(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save skill');
    }
  };

  const handleDeleteSkill = async (id: number, name: string) => {
    if (!window.confirm(`Remove skill "${name}"?`)) return;
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      success(`Skill "${name}" deleted.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete skill');
    }
  };

  // EXPERIENCE SAVE
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.company || !editingExp.role || !editingExp.start_date || !editingExp.description) {
      toastError('Please complete all required experience fields.');
      return;
    }

    try {
      if (editingExp.id) {
        const updated = await api.updateExperience(editingExp.id, editingExp);
        setExperience(experience.map((ex) => (ex.id === updated.id ? updated : ex)));
        success(`Experience at ${updated.company} updated.`);
      } else {
        const created = await api.createExperience(editingExp);
        setExperience([created, ...experience]);
        success(`Experience at ${created.company} registered.`);
      }
      setExpModalOpen(false);
      setEditingExp(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: number, company: string) => {
    if (!window.confirm(`Remove experience entry for ${company}?`)) return;
    try {
      await api.deleteExperience(id);
      setExperience(experience.filter((ex) => ex.id !== id));
      success(`Experience at ${company} deleted.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete experience');
    }
  };

  // EDUCATION SAVE
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.institution || !editingEdu.degree || !editingEdu.start_date) {
      toastError('Please complete all required education fields.');
      return;
    }

    try {
      if (editingEdu.id) {
        const updated = await api.updateEducation(editingEdu.id, editingEdu);
        setEducation(education.map((ed) => (ed.id === updated.id ? updated : ed)));
        success(`Education record updated.`);
      } else {
        const created = await api.createEducation(editingEdu);
        setEducation([created, ...education]);
        success(`Education record added.`);
      }
      setEduModalOpen(false);
      setEditingEdu(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: number, institution: string) => {
    if (!window.confirm(`Remove education record for ${institution}?`)) return;
    try {
      await api.deleteEducation(id);
      setEducation(education.filter((ed) => ed.id !== id));
      success(`Education record deleted.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete education');
    }
  };

  // MESSAGES
  const handleToggleMessageRead = async (msg: Message) => {
    try {
      const nextReadState = !msg.is_read;
      await api.toggleMessageRead(msg.id, nextReadState);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: nextReadState ? 1 : 0 } : m)));
      if (overview) {
        setOverview({
          ...overview,
          unreadMessagesCount: Math.max(0, overview.unreadMessagesCount + (nextReadState ? -1 : 1))
        });
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update message');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      success('Message deleted.');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete message');
    }
  };

  // ARTICLE HANDLERS
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.summary || !editingArticle.content) {
      toastError('Title, summary, and content are required.');
      return;
    }

    try {
      if (editingArticle.id) {
        const updated = await api.updateArticle(editingArticle.id, editingArticle);
        setArticles(articles.map((a) => (a.id === updated.id ? updated : a)));
        success(`Article "${updated.title}" updated.`);
      } else {
        const created = await api.createArticle(editingArticle);
        setArticles([created, ...articles]);
        success(`Article "${created.title}" published.`);
      }
      setArticleModalOpen(false);
      setEditingArticle(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save article');
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await api.deleteArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
      success(`Article "${title}" removed.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete article');
    }
  };

  // TESTIMONIAL HANDLERS
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name || !editingTestimonial.role || !editingTestimonial.content) {
      toastError('Name, role, and endorsement content are required.');
      return;
    }

    try {
      if (editingTestimonial.id) {
        const updated = await api.updateTestimonial(editingTestimonial.id, editingTestimonial);
        setTestimonials(testimonials.map((t) => (t.id === updated.id ? updated : t)));
        success(`Testimonial from "${updated.name}" updated.`);
      } else {
        const created = await api.createTestimonial(editingTestimonial);
        setTestimonials([created, ...testimonials]);
        success(`Testimonial from "${created.name}" registered.`);
      }
      setTestimonialModalOpen(false);
      setEditingTestimonial(null);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to save testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: number, name: string) => {
    if (!window.confirm(`Delete recommendation from "${name}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      success(`Testimonial removed.`);
      onDataChanged();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete testimonial');
    }
  };

  // EXPORT BACKUP
  const handleExportBackup = async () => {
    try {
      await api.exportBackup();
      success('Database snapshot JSON downloaded.');
    } catch (err: any) {
      toastError(err.message || 'Failed to export backup');
    }
  };

  // SECURITY FORM
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.currentPassword) {
      toastError('Current password is required.');
      return;
    }

    try {
      await api.updateCredentials(securityForm);
      success('Security credentials updated.');
      setSecurityForm({
        currentPassword: '',
        newEmail: securityForm.newEmail,
        newPassword: ''
      });
    } catch (err: any) {
      toastError(err.message || 'Failed to update credentials');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-950 flex flex-col items-center justify-center font-mono text-cyber-neon gap-3">
        <div className="w-10 h-10 border-2 border-cyber-neon border-t-transparent rounded-full animate-spin" />
        <span className="text-xs tracking-widest">INITIALIZING COMMAND MATRIX...</span>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans">
      {/* Top HUD Nav */}
      <header className="bg-cyber-900/90 border-b border-cyber-border px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size={36} showText={false} />
          <div>
            <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
              ADMIN COMMAND CENTER
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              OPERATIVE: {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewPublic}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border hover:border-cyber-neon text-slate-300 hover:text-cyber-neon font-mono text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VIEW LIVE SITE</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-300 font-mono text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5">
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-1">
            CONTROL DOMAINS
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyber-neon" />
            <span>OVERVIEW HUD</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-cyber-green" />
            <span>PROFILE &amp; BIO</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'projects'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-cyber-purple" />
            <span>PROJECTS ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'skills'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyber-pink" />
            <span>SKILLS ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'experience'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>EXPERIENCE ({experience.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'education'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>EDUCATION ({education.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'articles'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>ARTICLES &amp; BLOG ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'testimonials'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4 text-amber-400" />
            <span>TESTIMONIALS ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'messages'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>INQUIRIES</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyber-green text-cyber-950 font-bold text-[10px] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs tracking-wider transition-all text-left ${
              activeTab === 'security'
                ? 'bg-cyber-neon/15 border border-cyber-neon text-cyber-neon shadow-neon-cyan/20'
                : 'text-slate-300 hover:bg-cyber-900 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-red-400" />
            <span>CREDENTIALS</span>
          </button>
        </aside>

        {/* Dynamic Tab Body Panel */}
        <main className="flex-1 bg-cyber-900/60 border border-cyber-border rounded-xl p-6 md:p-8 min-h-[600px] relative">
          {/* TAB 1: OVERVIEW HUD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-tech font-bold text-white mb-1">
                  SYSTEM OVERVIEW // METRICS
                </h2>
                <p className="font-mono text-xs text-slate-400">
                  Telemetry status of all managed entities in persistent SQLite storage
                </p>
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">PROJECTS</div>
                  <div className="text-3xl font-tech font-bold text-cyber-neon mt-1">
                    {projects.length}
                  </div>
                  <div className="font-mono text-[10px] text-cyber-green mt-1">
                    {projects.filter((p) => p.is_featured).length} Featured
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">SKILLS</div>
                  <div className="text-3xl font-tech font-bold text-cyber-green mt-1">
                    {skills.length}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">
                    Categorized matrix
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">EXPERIENCE</div>
                  <div className="text-3xl font-tech font-bold text-cyber-purple mt-1">
                    {experience.length}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">
                    Milestones logged
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">ARTICLES &amp; BLOG</div>
                  <div className="text-3xl font-tech font-bold text-cyan-400 mt-1">
                    {articles.length}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">
                    Technical notes
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">TESTIMONIALS</div>
                  <div className="text-3xl font-tech font-bold text-emerald-400 mt-1">
                    {testimonials.length}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">
                    Peer verifications
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">INCOMING MESSAGES</div>
                  <div className="text-3xl font-tech font-bold text-amber-400 mt-1">
                    {messages.length}
                  </div>
                  <div className="font-mono text-[10px] text-cyber-green mt-1">
                    {unreadCount} Unread transmissions
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-5 rounded-lg bg-cyber-950 border border-cyber-border">
                <div className="font-mono text-xs text-cyber-neon mb-3">// QUICK PROTOCOL ACTIONS</div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        slug: '',
                        tagline: '',
                        description: '',
                        technologies: ['TypeScript', 'React'],
                        category: 'Full-Stack',
                        is_featured: 1,
                        stars_count: 0,
                        order_index: 0
                      });
                      setProjectModalOpen(true);
                    }}
                    className="px-4 py-2 rounded bg-cyber-neon text-cyber-950 font-mono text-xs font-bold flex items-center gap-2 hover:bg-cyan-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>CREATE PROJECT</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingSkill({
                        name: '',
                        category: 'Languages',
                        proficiency: 85,
                        order_index: skills.length + 1
                      });
                      setSkillModalOpen(true);
                    }}
                    className="px-4 py-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-green text-cyber-green font-mono text-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD SKILL</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-4 py-2 rounded bg-cyber-900 border border-cyber-border hover:border-amber-400 text-amber-400 font-mono text-xs flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>INSPECT INBOX ({unreadCount} NEW)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & BIO EDITOR */}
          {activeTab === 'profile' && profile && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">OPERATIVE PROFILE &amp; BIO</h2>
                  <p className="font-mono text-xs text-slate-400">Updates live presentation parameters across the public portfolio</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 shadow-neon-cyan/30"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE MODIFICATIONS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">OPERATIVE FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">HEADLINE TITLE</label>
                  <input
                    type="text"
                    required
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">MISSION TAGLINE</label>
                <input
                  type="text"
                  value={profile.tagline || ''}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">BIOGRAPHY (PARAGRAPHS)</label>
                <textarea
                  rows={6}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-sans text-xs text-slate-100 focus:outline-none focus:border-cyber-neon resize-y"
                />
              </div>

              {/* File Uploads for Avatar and Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                <FileUpload
                  label="PROFILE AVATAR (PHOTO)"
                  currentValue={profile.avatar_url || ''}
                  accept="image/*"
                  onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
                  helperText="Upload custom avatar image (PNG, JPG, WEBP, SVG)"
                />

                <FileUpload
                  label="RESUME DOCUMENT [PDF]"
                  currentValue={profile.resume_url || ''}
                  accept="application/pdf"
                  onUploadComplete={(url) => setProfile({ ...profile, resume_url: url })}
                  helperText="Upload digital resume PDF file for public download"
                />
              </div>

              {/* Contact & Status Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">DISPATCH EMAIL</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">PHONE / COMM</label>
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">LOCATION &amp; TIMEZONE</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">STATUS HUD TEXT</label>
                <input
                  type="text"
                  value={profile.status_text || ''}
                  onChange={(e) => setProfile({ ...profile, status_text: e.target.value })}
                  placeholder="STATUS: ONLINE // AVAILABLE FOR HIRE"
                  className="w-full px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                />
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-cyber-border">
                <div className="font-mono text-xs text-cyber-neon mb-3">// SOCIAL CHANNELS &amp; HANDLES</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">GITHUB URL</label>
                    <input
                      type="text"
                      value={profile.github_url || ''}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">LINKEDIN URL</label>
                    <input
                      type="text"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">DISCORD HANDLE</label>
                    <input
                      type="text"
                      value={profile.discord_username || ''}
                      onChange={(e) => setProfile({ ...profile, discord_username: e.target.value })}
                      placeholder="username#0001"
                      className="w-full px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">STEAM PROFILE URL</label>
                    <input
                      type="text"
                      value={profile.steam_url || ''}
                      onChange={(e) => setProfile({ ...profile, steam_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">TWITTER / X URL</label>
                    <input
                      type="text"
                      value={profile.twitter_url || ''}
                      onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">PROJECT INVENTORY</h2>
                  <p className="font-mono text-xs text-slate-400">Add, edit, upload screenshots, or reorder showcase systems</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      slug: '',
                      tagline: '',
                      description: '',
                      technologies: ['TypeScript', 'Node.js'],
                      category: 'Full-Stack',
                      is_featured: 1,
                      stars_count: 0,
                      order_index: projects.length + 1
                    });
                    setProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>NEW PROJECT</span>
                </button>
              </div>

              {/* Projects Table / Card List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-lg bg-cyber-950 border border-cyber-border hover:border-cyber-neon/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-16 h-12 rounded bg-cyber-900 border border-cyber-border shrink-0 overflow-hidden flex items-center justify-center">
                        {proj.image_url ? (
                          <img src={proj.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FolderGit2 className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="font-tech text-base font-bold text-white truncate">{proj.title}</h4>
                          {proj.is_featured ? (
                            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyber-green/10 border border-cyber-green text-cyber-green">
                              FEATURED
                            </span>
                          ) : null}
                          <span className="font-mono text-[10px] text-slate-400">[{proj.category}]</span>
                        </div>
                        <p className="font-mono text-xs text-slate-400 truncate max-w-md">
                          {proj.tagline || proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setProjectModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-neon text-slate-300 hover:text-cyber-neon transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-red-500 text-slate-300 hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS MANAGER */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">SKILLS MATRIX MANAGER</h2>
                  <p className="font-mono text-xs text-slate-400">Configure competencies and mastery percentages</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill({
                      name: '',
                      category: 'Languages',
                      proficiency: 85,
                      order_index: skills.length + 1
                    });
                    setSkillModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-cyber-green text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD SKILL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded bg-cyber-950 border border-cyber-border flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <div className="font-mono text-xs font-bold text-white truncate">{s.name}</div>
                      <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{s.category}</span>
                        <span>//</span>
                        <span className="text-cyber-green">{s.proficiency}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setSkillModalOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-cyber-900 text-slate-400 hover:text-cyber-neon"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id, s.name)}
                        className="p-1.5 rounded hover:bg-cyber-900 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXPERIENCE MANAGER */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">WORK EXPERIENCE TIMELINE</h2>
                  <p className="font-mono text-xs text-slate-400">Manage career positions, responsibilities, and achievements</p>
                </div>
                <button
                  onClick={() => {
                    setEditingExp({
                      company: '',
                      role: '',
                      location: 'Remote',
                      employment_type: 'Full-time',
                      start_date: '2024',
                      end_date: null,
                      is_current: 1,
                      description: '',
                      technologies: ['React', 'Node.js'],
                      order_index: experience.length + 1
                    });
                    setExpModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD POSITION</span>
                </button>
              </div>

              <div className="space-y-3">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg bg-cyber-950 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-tech text-lg font-bold text-white">{exp.role}</h4>
                        <span className="font-mono text-xs text-cyber-green">@ {exp.company}</span>
                        {exp.is_current ? (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
                            CURRENT
                          </span>
                        ) : null}
                      </div>
                      <div className="font-mono text-xs text-slate-400 mt-0.5">
                        {exp.start_date} {exp.end_date ? `— ${exp.end_date}` : '— Present'} // {exp.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingExp(exp);
                          setExpModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-neon text-slate-300 hover:text-cyber-neon"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id, exp.company)}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-red-500 text-slate-300 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EDUCATION MANAGER */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">ACADEMIC &amp; CERTIFICATIONS</h2>
                  <p className="font-mono text-xs text-slate-400">Degrees, academic institutions, and specialized training</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEdu({
                      institution: '',
                      degree: 'Bachelor of Science (B.Sc.)',
                      field_of_study: 'Computer Science',
                      start_date: '2019',
                      end_date: '2023',
                      grade: 'Honors',
                      description: '',
                      order_index: education.length + 1
                    });
                    setEduModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-emerald-400 text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD EDUCATION</span>
                </button>
              </div>

              <div className="space-y-3">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg bg-cyber-950 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-tech text-lg font-bold text-white">{edu.degree}</h4>
                      <div className="font-mono text-xs text-cyber-neon mt-0.5">
                        {edu.institution} {edu.field_of_study ? `— ${edu.field_of_study}` : ''}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-1">
                        {edu.start_date} {edu.end_date ? `— ${edu.end_date}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingEdu(edu);
                          setEduModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-green text-slate-300 hover:text-cyber-green"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu.id, edu.institution)}
                        className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-red-500 text-slate-300 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ARTICLES & BLOG */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">TECHNICAL ARTICLES &amp; BLOG</h2>
                  <p className="font-mono text-xs text-slate-400">Manage engineering notes, architectural write-ups, and developer insights</p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      slug: '',
                      summary: '',
                      content: '',
                      tags: ['Architecture', 'Performance'],
                      read_time: '5 min read',
                      is_published: 1,
                      cover_image: '',
                      published_at: new Date().toISOString()
                    });
                    setArticleModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-cyan-400 text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>NEW ARTICLE</span>
                </button>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-slate-500">
                  NO ARTICLES CURRENTLY PUBLISHED IN DATASTORE
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="p-5 rounded-lg bg-cyber-950 border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              art.is_published
                                ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40'
                                : 'bg-amber-400/15 text-amber-400 border border-amber-400/40'
                            }`}
                          >
                            {art.is_published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {art.read_time}
                          </span>
                          <span className="font-mono text-[11px] text-cyan-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {art.views_count} views
                          </span>
                        </div>
                        <h4 className="font-tech text-lg font-bold text-white hover:text-cyan-400 transition-colors">
                          {art.title}
                        </h4>
                        <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                          {art.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {art.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-cyber-900 border border-cyber-border text-slate-300 font-mono text-[10px]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingArticle(art);
                            setArticleModalOpen(true);
                          }}
                          className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id, art.title)}
                          className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-red-500 text-slate-300 hover:text-red-400 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">ENDORSEMENTS &amp; TESTIMONIALS</h2>
                  <p className="font-mono text-xs text-slate-400">Recommendations from engineering leaders, collaborators, and clients</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTestimonial({
                      name: '',
                      role: 'Senior Engineering Manager',
                      company: 'Tech Studio',
                      avatar_url: '',
                      content: '',
                      rating: 5,
                      order_index: testimonials.length + 1
                    });
                    setTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded bg-emerald-400 text-cyber-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-emerald-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TESTIMONIAL</span>
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-slate-500">
                  NO TESTIMONIALS LOGGED IN DATASTORE
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((test) => (
                    <div
                      key={test.id}
                      className="p-5 rounded-lg bg-cyber-950 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {test.avatar_url ? (
                          <img
                            src={test.avatar_url}
                            alt={test.name}
                            className="w-12 h-12 rounded-full object-cover border border-cyber-border shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-cyber-900 border border-cyber-border flex items-center justify-center font-mono font-bold text-cyber-neon shrink-0">
                            {test.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-tech text-base font-bold text-white">
                              {test.name}
                            </h4>
                            <span className="font-mono text-xs text-slate-400">
                              // {test.role} {test.company ? `@ ${test.company}` : ''}
                            </span>
                            <div className="flex items-center text-amber-400 text-xs">
                              {Array.from({ length: test.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 italic line-clamp-2">
                            "{test.content}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingTestimonial(test);
                            setTestimonialModalOpen(true);
                          }}
                          className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-emerald-400 text-slate-300 hover:text-emerald-400 transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(test.id, test.name)}
                          className="p-2 rounded bg-cyber-900 border border-cyber-border hover:border-red-500 text-slate-300 hover:text-red-400 transition-colors"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: INQUIRIES / MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div>
                  <h2 className="text-2xl font-tech font-bold text-white">COMMUNICATION INBOX</h2>
                  <p className="font-mono text-xs text-slate-400">Incoming packets sent through the public contact terminal</p>
                </div>
                <div className="font-mono text-xs text-cyber-neon">
                  {unreadCount} UNREAD // {messages.length} TOTAL
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-slate-500">
                  NO TRANSMISSIONS RECORDED IN DATASTORE
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-lg border transition-all ${
                        msg.is_read
                          ? 'bg-cyber-950/70 border-cyber-border text-slate-300'
                          : 'bg-cyber-900 border-cyber-neon/60 shadow-neon-cyan/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${msg.is_read ? 'bg-slate-500' : 'bg-cyber-neon animate-pulse'}`} />
                          <span className="font-mono text-xs font-bold text-white">{msg.name}</span>
                          <span className="font-mono text-xs text-cyber-green">&lt;{msg.email}&gt;</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>

                      {msg.subject && (
                        <div className="font-mono text-xs text-cyber-neon mb-2">
                          SUBJECT: {msg.subject}
                        </div>
                      )}

                      <p className="text-slate-200 text-xs sm:text-sm font-sans whitespace-pre-wrap mb-4 bg-cyber-950/50 p-3 rounded border border-cyber-border/50">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-cyber-border/40 font-mono text-xs">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                          className="px-3 py-1 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-green text-cyber-green flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          <span>DISPATCH EMAIL REPLY</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMessageRead(msg)}
                            className="px-3 py-1 rounded bg-cyber-900 border border-cyber-border hover:border-slate-400 text-slate-300 text-xs transition-colors"
                          >
                            {msg.is_read ? 'MARK UNREAD' : 'MARK READ'}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-2xl font-tech font-bold text-white">ADMIN SECURITY CREDENTIALS</h2>
                <p className="font-mono text-xs text-slate-400">Update administrative identifier or change account passphrase</p>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-4 p-6 rounded-lg bg-cyber-950 border border-cyber-border">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    CURRENT PASSPHRASE <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded bg-cyber-900 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    ADMINISTRATOR EMAIL
                  </label>
                  <input
                    type="email"
                    value={securityForm.newEmail}
                    onChange={(e) => setSecurityForm({ ...securityForm, newEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-cyber-900 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">
                    NEW PASSPHRASE (OPTIONAL)
                  </label>
                  <input
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    placeholder="Leave blank to keep current passphrase"
                    className="w-full px-3.5 py-2 rounded bg-cyber-900 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-neon-cyan/20"
                >
                  UPDATE CREDENTIALS
                </button>
              </form>

              {/* DATABASE BACKUP EXPORT */}
              <div className="p-6 rounded-lg bg-cyber-950 border border-cyber-border space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyber-neon" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    DATABASE PERSISTENCE &amp; SNAPSHOT EXPORT
                  </h3>
                </div>
                <p className="font-mono text-xs text-slate-400 leading-relaxed">
                  Export complete datastore state (profile bio, projects, skills, experience, education, articles, testimonials, and contact inquiries) to a downloadable JSON snapshot file.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded bg-cyber-900 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon hover:text-cyber-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-neon-cyan/10"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT SYSTEM BACKUP (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PROJECT CREATE / EDIT MODAL */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-cyber-900 border border-cyber-neon/40 rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="px-5 py-3.5 bg-cyber-950 border-b border-cyber-border flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyber-neon">
                {editingProject.id ? `EDIT PROTOCOL: ${editingProject.title}` : 'INITIALIZE NEW PROJECT'}
              </span>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">PROJECT TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">CATEGORY</label>
                  <select
                    value={editingProject.category || 'Full-Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Game Dev">Game Dev</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Tools">Tools</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">TAGLINE / ELEVATOR PITCH</label>
                <input
                  type="text"
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  placeholder="Real-time WebGL battle arena..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">DETAILED DESCRIPTION *</label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon resize-y"
                />
              </div>

              {/* Technologies Tag Editor */}
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  TECHNOLOGIES (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  placeholder="React, TypeScript, Three.js, Node.js, WebSockets"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                />
              </div>

              {/* Persistent Project Image Upload */}
              <FileUpload
                label="PROJECT SCREENSHOT / BANNER IMAGE"
                currentValue={editingProject.image_url || ''}
                accept="image/*"
                onUploadComplete={(url) => setEditingProject({ ...editingProject, image_url: url })}
                helperText="Upload project visual (PNG, JPG, WEBP) or input image URL"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">LIVE DEMO URL</label>
                  <input
                    type="text"
                    value={editingProject.demo_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">GITHUB REPO URL</label>
                  <input
                    type="text"
                    value={editingProject.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.is_featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded bg-cyber-950 border-cyber-border text-cyber-neon focus:ring-0"
                  />
                  <span>FEATURED ON PORTFOLIO</span>
                </label>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <span>STARS:</span>
                  <input
                    type="number"
                    value={editingProject.stars_count || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, stars_count: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-cyber-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs"
                >
                  SAVE PROJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-cyber-900 border border-cyber-green/40 rounded-xl shadow-2xl p-6">
            <h3 className="font-tech text-xl font-bold text-white mb-4">
              {editingSkill.id ? 'EDIT ARSENAL SKILL' : 'ADD ARSENAL SKILL'}
            </h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">SKILL NAME *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. TypeScript, Unreal Engine"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">CATEGORY *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.category || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  placeholder="Languages, Frontend & UI, Backend & Systems"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                  <span>MASTERY PROFICIENCY:</span>
                  <span className="text-cyber-green">{editingSkill.proficiency || 80}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                  className="w-full accent-cyber-green"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-cyber-950 font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyber-green text-cyber-950 font-mono font-bold text-xs"
                >
                  COMMIT SKILL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-cyber-900 border border-cyber-border rounded-xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-tech text-xl font-bold text-white mb-4">
              {editingExp.id ? 'EDIT EXPERIENCE' : 'ADD WORK EXPERIENCE'}
            </h3>
            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">COMPANY *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">ROLE / TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="Remote / City"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">START DATE *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.start_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    placeholder="2022"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">END DATE</label>
                  <input
                    type="text"
                    value={editingExp.end_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    placeholder="Present"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingExp.is_current)}
                  onChange={(e) => setEditingExp({ ...editingExp, is_current: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded bg-cyber-950"
                />
                <span>CURRENT ACTIVE ROLE</span>
              </label>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">DESCRIPTION (BULLET POINTS) *</label>
                <textarea
                  rows={4}
                  required
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  placeholder="• Engineered microservices...&#10;• Reduced latency by 40%..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">TECHNOLOGIES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={Array.isArray(editingExp.technologies) ? editingExp.technologies.join(', ') : ''}
                  onChange={(e) => setEditingExp({
                    ...editingExp,
                    technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-cyber-950 font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs"
                >
                  SAVE POSITION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {eduModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-cyber-900 border border-cyber-border rounded-xl shadow-2xl p-6">
            <h3 className="font-tech text-xl font-bold text-white mb-4">
              {editingEdu.id ? 'EDIT EDUCATION' : 'ADD EDUCATION'}
            </h3>
            <form onSubmit={handleSaveEducation} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">INSTITUTION *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="University / Academy"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">DEGREE / CERTIFICATE *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="B.Sc. in Computer Science"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">START DATE *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.start_date || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">END DATE</label>
                  <input
                    type="text"
                    value={editingEdu.end_date || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">GRADE / DISTINCTION</label>
                <input
                  type="text"
                  value={editingEdu.grade || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                  placeholder="Graduated with Honors"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-cyber-950 font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-400 text-cyber-950 font-mono font-bold text-xs"
                >
                  SAVE RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {articleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-cyber-900 border border-cyan-400/40 rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="px-5 py-3.5 bg-cyber-950 border-b border-cyber-border flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400">
                {editingArticle.id ? `EDIT ARTICLE: ${editingArticle.title}` : 'WRITE NEW TECHNICAL ARTICLE'}
              </span>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">ARTICLE TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Architecting Ultra-Low Latency WebSocket Systems..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">URL SLUG</label>
                  <input
                    type="text"
                    value={editingArticle.slug || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    placeholder="architecting-low-latency-websockets"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">READ TIME ESTIMATE</label>
                  <input
                    type="text"
                    value={editingArticle.read_time || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                    placeholder="6 min read"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">SUMMARY / EXCERPT *</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="Brief synopsis shown on the article preview card..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">FULL ARTICLE CONTENT (MARKDOWN SUPPORTED) *</label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Write your in-depth technical analysis, architecture decisions, and code snippets here..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={Array.isArray(editingArticle.tags) ? editingArticle.tags.join(', ') : ''}
                  onChange={(e) => setEditingArticle({
                    ...editingArticle,
                    tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  placeholder="TypeScript, WebSockets, Performance, Systems"
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <FileUpload
                label="ARTICLE HEADER / COVER IMAGE"
                currentValue={editingArticle.cover_image || ''}
                accept="image/*"
                onUploadComplete={(url) => setEditingArticle({ ...editingArticle, cover_image: url })}
                helperText="Upload cover image or leave blank for gradient backdrop"
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={Boolean(editingArticle.is_published)}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_published: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded bg-cyber-950 border border-cyber-border text-cyan-400 focus:ring-0"
                />
                <label htmlFor="publishedCheckbox" className="font-mono text-xs text-slate-300 cursor-pointer">
                  PUBLISH PUBLICLY (Visible on portfolio website)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-cyber-950 font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-400 text-cyber-950 font-mono font-bold text-xs"
                >
                  SAVE ARTICLE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL CREATE / EDIT MODAL */}
      {testimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-cyber-900 border border-emerald-400/40 rounded-xl shadow-2xl p-6">
            <h3 className="font-tech text-xl font-bold text-white mb-4">
              {editingTestimonial.id ? 'EDIT TESTIMONIAL' : 'ADD NEW TESTIMONIAL'}
            </h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">RECOMMENDER NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="Alex Mercer"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">ROLE / TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="Lead Systems Architect"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">COMPANY / ORGANIZATION</label>
                  <input
                    type="text"
                    value={editingTestimonial.company || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    placeholder="Nexus Systems"
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">RATING (1 - 5 STARS)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <FileUpload
                label="AVATAR PHOTO / HEADSHOT"
                currentValue={editingTestimonial.avatar_url || ''}
                accept="image/*"
                onUploadComplete={(url) => setEditingTestimonial({ ...editingTestimonial, avatar_url: url })}
                helperText="Upload avatar photo or leave blank for initials"
              />

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">ENDORSEMENT TESTIMONIAL *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  placeholder="Working with Yehia transformed our system throughput..."
                  className="w-full px-3 py-2 rounded bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-100"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-cyber-950 font-mono text-xs text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-400 text-cyber-950 font-mono font-bold text-xs"
                >
                  SAVE TESTIMONIAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
