import React, { useState } from 'react';
import { FileText, Clock, Eye, ArrowUpRight, BookOpen } from 'lucide-react';
import { Article } from '../types';
import { ArticleModal } from './ArticleModal';
import { sound } from '../utils/sound';

interface ArticlesSectionProps {
  articles: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 05. TECHNICAL INSIGHTS &amp; BLOG</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide">
              SYSTEM ARCHITECTURE &amp; WRITING
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Deep dives on distributed systems, WebGL shaders, database telemetry, and engineering patterns
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => {
                sound.playClick();
                setSelectedArticle(art);
              }}
              className="flex flex-col rounded-xl bg-cyber-900/70 border border-cyber-border hover:border-cyber-neon/60 transition-all duration-300 p-6 cursor-pointer group shadow-lg hover:shadow-neon-cyan/15 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                <span className="flex items-center gap-1.5 text-cyber-green">
                  <Clock className="w-3.5 h-3.5" />
                  {art.read_time}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyber-neon" />
                  {art.views_count} views
                </span>
              </div>

              <h3 className="text-lg font-tech font-bold text-white group-hover:text-cyber-neon transition-colors mb-2 leading-snug">
                {art.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 mb-5 font-sans leading-relaxed">
                {art.summary}
              </p>

              <div className="mt-auto pt-4 border-t border-cyber-border/60 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {art.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-border/60 text-slate-300 font-mono text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span className="font-mono text-xs text-cyber-neon group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-1">
                  <span>READ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};
