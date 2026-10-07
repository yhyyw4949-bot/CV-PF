import React from 'react';
import { MessageSquareQuote, Star, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon } from './Icons';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 06. PEER &amp; CLIENT ATTESTATIONS</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide">
              RECOMMENDATIONS &amp; VERIFICATION
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Endorsements from engineering leaders, product directors, and founders
            </p>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl bg-cyber-900/70 border border-cyber-border hover:border-cyber-green/50 p-6 transition-all duration-300 shadow-lg relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-cyber-green px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED
                </span>
              </div>

              {/* Quote text */}
              <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed italic mb-6 flex-1">
                &ldquo;{item.content}&rdquo;
              </p>

              {/* Author Info Footer */}
              <div className="pt-4 border-t border-cyber-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-tech text-base font-bold text-white group-hover:text-cyber-green transition-colors">
                    {item.name}
                  </h4>
                  <div className="font-mono text-[11px] text-slate-400">
                    {item.role} <span className="text-cyber-neon">@ {item.company}</span>
                  </div>
                </div>

                {item.linkedin_url && (
                  <a
                    href={item.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-cyber-950 border border-cyber-border text-slate-400 hover:text-[#0077b5] hover:border-[#0077b5] transition-colors"
                    title="View LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
