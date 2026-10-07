import {
  PublicPortfolioData,
  Profile,
  Skill,
  Experience,
  Education,
  Project,
  Stat,
  Message,
  AdminUser,
  DashboardOverview,
  Article,
  Testimonial
} from '../types';

const API_BASE = '/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // PUBLIC ENDPOINTS
  async getPublicData(): Promise<PublicPortfolioData> {
    const res = await fetch(`${API_BASE}/public/data`);
    if (!res.ok) {
      throw new Error(`Failed to load portfolio data: ${res.statusText}`);
    }
    return res.json();
  }

  async sendContactMessage(payload: { name: string; email: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to transmit message');
    }
    return data;
  }

  // AUTH ENDPOINTS
  async login(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      localStorage.removeItem('admin_token');
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getHeaders(),
        credentials: 'include'
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  }

  async updateCredentials(payload: { currentPassword: string; newEmail?: string; newPassword?: string }) {
    const res = await fetch(`${API_BASE}/auth/update-credentials`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update credentials');
    }
    return data;
  }

  // ADMIN OVERVIEW
  async getOverview(): Promise<DashboardOverview> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return res.json();
  }

  // ADMIN PROFILE
  async getAdminProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    return data.profile;
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data.profile;
  }

  // PROJECTS CRUD
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.projects;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(project)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create project');
    return data.project;
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(project)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update project');
    return data.project;
  }

  async deleteProject(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete project');
    }
  }

  // SKILLS CRUD
  async getSkills(): Promise<Skill[]> {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch skills');
    const data = await res.json();
    return data.skills;
  }

  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(skill)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create skill');
    return data.skill;
  }

  async updateSkill(id: number, skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(skill)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update skill');
    return data.skill;
  }

  async deleteSkill(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete skill');
  }

  // EXPERIENCE CRUD
  async getExperience(): Promise<Experience[]> {
    const res = await fetch(`${API_BASE}/admin/experience`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch experience');
    const data = await res.json();
    return data.experience;
  }

  async createExperience(exp: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/admin/experience`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(exp)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create experience');
    return data.experience;
  }

  async updateExperience(id: number, exp: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/admin/experience/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(exp)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update experience');
    return data.experience;
  }

  async deleteExperience(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/experience/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete experience');
  }

  // EDUCATION CRUD
  async getEducation(): Promise<Education[]> {
    const res = await fetch(`${API_BASE}/admin/education`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch education');
    const data = await res.json();
    return data.education;
  }

  async createEducation(edu: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/admin/education`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(edu)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create education');
    return data.education;
  }

  async updateEducation(id: number, edu: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/admin/education/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(edu)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update education');
    return data.education;
  }

  async deleteEducation(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/education/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete education');
  }

  // MESSAGES
  async getMessages(): Promise<Message[]> {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return data.messages;
  }

  async toggleMessageRead(id: number, is_read: boolean): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ is_read })
    });
    if (!res.ok) throw new Error('Failed to update message status');
  }

  async deleteMessage(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete message');
  }

  // FILE UPLOAD
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('admin_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'File upload failed');
    }
    return data;
  }

  // ARTICLE VIEW
  async incrementArticleView(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/public/articles/${id}/view`, { method: 'POST' });
    } catch {
      // ignore
    }
  }

  // ARTICLES CRUD
  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE}/admin/articles`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return data.articles;
  }

  async createArticle(article: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(article)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create article');
    return data.article;
  }

  async updateArticle(id: number, article: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/admin/articles/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(article)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update article');
    return data.article;
  }

  async deleteArticle(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/articles/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete article');
  }

  // TESTIMONIALS CRUD
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    const data = await res.json();
    return data.testimonials;
  }

  async createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(testimonial)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create testimonial');
    return data.testimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(testimonial)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update testimonial');
    return data.testimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  }

  // EXPORT BACKUP
  async exportBackup(): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/export-data`, {
      headers: this.getHeaders(),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to export data');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yehia-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const api = new ApiService();
