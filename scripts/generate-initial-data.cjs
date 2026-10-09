const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('client/src/data/initialData.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function safeParse(val, def) {
  if (!val) return def;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return def;
  }
}

const formatted = {
  profile: raw.profile,
  skills: raw.skills,
  experience: raw.experience.map(e => ({
    ...e,
    is_current: Number(e.is_current) || 0,
    technologies: safeParse(e.technologies, [])
  })),
  education: raw.education,
  projects: raw.projects.map(p => {
    const { is_active, ...cleanProject } = p;
    return {
      ...cleanProject,
      is_featured: Number(p.is_featured) || 0,
      technologies: safeParse(p.technologies, []),
      gallery: safeParse(p.gallery, [])
    };
  }),
  stats: raw.stats,
  articles: raw.articles.map(a => ({
    ...a,
    is_published: Number(a.is_published) || 0,
    tags: safeParse(a.tags, [])
  })),
  testimonials: raw.testimonials
};

const tsContent = `import { PublicPortfolioData } from '../types';

export const INITIAL_PORTFOLIO_DATA: PublicPortfolioData = ${JSON.stringify(formatted, null, 2)};
`;

fs.writeFileSync(path.resolve('client/src/data/initialData.ts'), tsContent);
console.log('Successfully written initialData.ts!');
