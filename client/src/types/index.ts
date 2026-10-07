export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  phone: string;
  location: string;
  status_text: string;
  github_url: string;
  linkedin_url: string;
  discord_username: string;
  steam_url: string;
  twitter_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order_index: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  employment_type: string;
  start_date: string;
  end_date: string | null;
  is_current: number;
  description: string;
  technologies: string[];
  order_index: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  grade: string;
  description: string;
  order_index: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technologies: string[];
  image_url: string;
  gallery: string[];
  demo_url: string;
  github_url: string;
  category: string;
  is_featured: number;
  stars_count: number;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  icon?: string;
  order_index: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  tags: string[];
  read_time: string;
  published_at?: string;
  views_count: number;
  is_published: number;
  order_index: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar_url?: string;
  content: string;
  rating: number;
  linkedin_url?: string;
  order_index: number;
  created_at?: string;
}

export interface PublicPortfolioData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  stats: Stat[];
  articles: Article[];
  testimonials: Testimonial[];
}

export interface AdminUser {
  id: number;
  email: string;
}

export interface DashboardOverview {
  projectsCount: number;
  skillsCount: number;
  expCount: number;
  eduCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  featuredProjectsCount: number;
  articlesCount: number;
  testimonialsCount: number;
}
