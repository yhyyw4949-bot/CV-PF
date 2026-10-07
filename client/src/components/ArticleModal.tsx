import React, { useEffect } from 'react';
import { X, Calendar, Clock, Eye, Tag, Share2, Check } from 'lucide-react';
import { Article } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/sound';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      api.incrementArticleView(article.id);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    sound.playChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-cyber-900 border border-cyber-neon/40 rounded-xl shadow-2xl shadow-cyber-neon/15 overflow-hidden z-10 my-8">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-cyber-950 border-b border-cyber-border flex items-center justify-between">
          <span className="font-mono text-xs text-cyber-neon uppercase tracking-wider">
            TECHNICAL MEMORANDUM // {article.read_time}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded hover:bg-cyber-800 text-slate-400 hover:text-white transition-colors"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-cyber-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Cover Header Banner */}
          {article.cover_image && (
            <div className="w-full h-48 sm:h-64 rounded-lg bg-cyber-950 border border-cyber-border overflow-hidden">
              <img
                src={article.cover_image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-xs mb-3">
              <span className="flex items-center gap-1.5 text-cyber-green">
                <Clock className="w-3.5 h-3.5" />
                {article.read_time}
              </span>
              <span>//</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyber-neon" />
                {article.views_count + 1} Reads
              </span>
              <span>//</span>
              <span>
                {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Published'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-tech font-bold text-white mb-3">
              {article.title}
            </h1>

            <p className="font-mono text-xs sm:text-sm text-cyber-neon border-l-2 border-cyber-neon pl-3 italic">
              {article.summary}
            </p>
          </div>

          {/* Article Markdown/Paragraphs */}
          <div className="prose prose-invert max-w-none text-slate-300 font-sans text-sm sm:text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-tech font-bold text-white pt-2 border-b border-cyber-border pb-1">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('- ')) {
                const items = block.split('\n- ').map(i => i.replace('- ', ''));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-300">
                    {items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                );
              }
              return <p key={idx}>{block}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-cyber-border flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-400 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-cyber-neon" />
              TAGS:
            </span>
            {article.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-cyber-950 border border-cyber-border text-slate-300 font-mono text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
