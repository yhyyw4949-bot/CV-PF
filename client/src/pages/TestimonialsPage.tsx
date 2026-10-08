import React from 'react';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { Testimonial } from '../types';
import { MessageSquareQuote } from 'lucide-react';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ testimonials }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-gold tracking-widest mb-2">
          <MessageSquareQuote className="w-4 h-4 text-cyber-gold" />
          <span>// NODE: 06 // VERIFIED_RECOMMENDATIONS</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          PEER VERIFICATION &amp; REVIEWS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Endorsements from engineering leads, team members, founders, and cross-functional partners.
        </p>
      </div>

      {/* Main Testimonials Component */}
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
};

export default TestimonialsPage;
