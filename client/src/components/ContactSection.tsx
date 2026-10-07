import React, { useState } from 'react';
import { Send, Mail, MapPin, MessageSquare, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { Profile } from '../types';
import { api } from '../services/api';
import { useToast } from './Toast';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await api.sendContactMessage(formData);
      setSentSuccess(true);
      success('Transmission received. Message archived in operative datastore.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      const msg = err.message || 'Failed to transmit message';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-cyber-neon text-sm tracking-widest">// 05. INITIATE TRANSMISSION</span>
          <div className="h-[1px] flex-1 bg-cyber-border/80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Telemetry & Direct Contact Info */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-3xl font-tech font-bold text-white tracking-wide mb-3">
              ESTABLISH DIRECT COMM LINK
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
              Have an ambitious software architecture, high-load platform, game project, or engineering position? Transmit a packet below and I will respond promptly.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-lg bg-cyber-900/70 border border-cyber-border flex items-center gap-3">
                <div className="p-2 rounded bg-cyber-950 border border-cyber-neon/40 text-cyber-neon">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">DIRECT DISPATCH</div>
                  <a href={`mailto:${profile.email}`} className="text-slate-200 hover:text-cyber-neon transition-colors font-medium">
                    {profile.email || 'yehia@wael.dev'}
                  </a>
                </div>
              </div>

              {profile.discord_username && (
                <div className="p-4 rounded-lg bg-cyber-900/70 border border-cyber-border flex items-center gap-3">
                  <div className="p-2 rounded bg-cyber-950 border border-[#5865F2]/40 text-[#5865F2]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">DISCORD HANDLE</div>
                    <div className="text-slate-200">{profile.discord_username}</div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-cyber-900/70 border border-cyber-border flex items-center gap-3">
                <div className="p-2 rounded bg-cyber-950 border border-cyber-green/40 text-cyber-green">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">BASE LOCATION &amp; TIMEZONE</div>
                  <div className="text-slate-200">{profile.location || 'Cairo, Egypt'} (UTC+2 / UTC+3)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Transmission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-cyber-900/80 border border-cyber-border shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyber-border font-mono text-xs text-cyber-neon">
                <span>COMMUNICATION TERMINAL [SECURE]</span>
                <span className="text-cyber-green flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                  PORT 443 READY
                </span>
              </div>

              {sentSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green flex items-center justify-center text-cyber-green shadow-neon-green/30 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-tech font-bold text-white">TRANSMISSION CONFIRMED</h3>
                  <p className="text-slate-300 font-mono text-xs max-w-md">
                    Your transmission has been logged into the datastore. Yehia will review the coordinates and respond soon.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="mt-4 px-4 py-2 rounded bg-cyber-950 border border-cyber-border hover:border-cyber-neon text-cyber-neon font-mono text-xs tracking-wider"
                  >
                    SEND ANOTHER PACKET
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-slate-300 mb-1.5">
                        OPERATIVE / NAME <span className="text-cyber-neon">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon focus:outline-none text-slate-100 font-mono text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-slate-300 mb-1.5">
                        RETURN EMAIL <span className="text-cyber-neon">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon focus:outline-none text-slate-100 font-mono text-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1.5">
                      SUBJECT / TOPIC
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry / Job Opportunity / Collaboration"
                      className="w-full px-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon focus:outline-none text-slate-100 font-mono text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1.5">
                      PAYLOAD / MESSAGE <span className="text-cyber-neon">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Provide project specs, objectives, budget range, or inquiry details..."
                      className="w-full px-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon focus:outline-none text-slate-100 font-mono text-xs transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-neon-cyan/40 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-cyber-950 border-t-transparent rounded-full animate-spin" />
                        <span>TRANSMITTING PACKET...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH PACKET</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
