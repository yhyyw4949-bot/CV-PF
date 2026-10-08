import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { Profile } from '../types';
import { Mail } from 'lucide-react';

interface ContactPageProps {
  profile: Profile;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title Header */}
      <div className="border-b border-cyber-border/80 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-green tracking-widest mb-2">
          <Mail className="w-4 h-4 text-cyber-green" />
          <span>// NODE: 07 // DIRECT_DISPATCH</span>
        </div>
        <h1 className="font-tech text-4xl sm:text-6xl font-extrabold text-white tracking-wide">
          DIRECT TRANSMISSION &amp; COMM
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-2">
          Initiate direct communication for software engineering roles, technical architecture advisory, and contracts.
        </p>
      </div>

      {/* Main Contact Form Component */}
      <ContactSection profile={profile} />
    </div>
  );
};

export default ContactPage;
