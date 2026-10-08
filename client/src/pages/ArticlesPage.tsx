import React from 'react';
import { ArticlesSection } from '../components/ArticlesSection';
import { Article } from '../types';
import { FileText } from 'lucide-react';

interface ArticlesPageProps {
  articles: Article[];
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-neon tracking-widest mb-2">
          <FileText className="w-4 h-4 text-cyber-green" />
          <span>// NODE: 05 // TECHNICAL_BLOG</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          ARTICLES &amp; ENGINEERING INSIGHTS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Deep dives on distributed database patterns, Web Audio API synthesis, frontend performance, and full-stack engineering.
        </p>
      </div>

      {/* Main Articles Component */}
      <ArticlesSection articles={articles} />
    </div>
  );
};

export default ArticlesPage;
