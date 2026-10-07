import React, { useState } from 'react';
import { ShieldAlert, Key, Mail, Lock, ArrowLeft, Terminal, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser } from '../../types';
import { useToast } from '../Toast';
import { Logo } from '../Logo';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState('admin@yehia.dev');
  const [password, setPassword] = useState('AdminPass123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await api.login(email, password);
      success('Access authorized. Welcome to Admin Command Center.');
      onLoginSuccess(res.user);
    } catch (err: any) {
      const msg = err.message || 'Authentication rejected.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail('admin@yehia.dev');
    setPassword('AdminPass123!');
  };

  return (
    <div className="min-h-screen bg-cyber-950 flex flex-col justify-center items-center px-4 relative py-12">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[300px] bg-cyber-neon/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-cyber-neon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO PUBLIC PORTFOLIO</span>
        </button>
      </div>

      {/* Terminal Card */}
      <div className="w-full max-w-md bg-cyber-900 border border-cyber-border rounded-xl shadow-2xl overflow-hidden relative z-10">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-cyber-950 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyber-neon" />
            <span className="font-mono text-xs font-bold text-cyber-neon tracking-wider">
              ADMIN CONTROL MATRIX
            </span>
          </div>
          <span className="font-mono text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-950/40">
            RESTRICTED
          </span>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center flex flex-col items-center">
            <Logo size={46} showText={false} className="mb-3" />
            <h2 className="text-xl font-tech font-bold text-white mb-1">
              IDENTITY VERIFICATION
            </h2>
            <p className="font-mono text-xs text-slate-400">
              Provide administrator credentials to manipulate portfolio nodes
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded bg-red-950/60 border border-red-500/60 text-red-300 font-mono text-xs">
              &gt; ERROR: {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5">
                OPERATIVE IDENTIFIER (EMAIL)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yehia.dev"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon text-slate-100 font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5">
                SECURITY PASSPHRASE
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded bg-cyber-950 border border-cyber-border focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon text-slate-100 font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded bg-cyber-neon text-cyber-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-neon-cyan/30 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-cyber-950 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING PROTOCOL...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>AUTHENTICATE &amp; ENTER</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Notice */}
          <div className="mt-6 pt-5 border-t border-cyber-border/70 text-center">
            <p className="font-mono text-[11px] text-slate-400 mb-2">
              DEFAULT SEED CREDENTIALS:
            </p>
            <div className="inline-block p-2 rounded bg-cyber-950 border border-cyber-border text-left font-mono text-[11px] text-slate-300">
              <div><span className="text-slate-500">Email:</span> admin@yehia.dev</div>
              <div><span className="text-slate-500">Pass:</span> AdminPass123!</div>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={fillDemoCreds}
                className="font-mono text-[11px] text-cyber-green hover:underline"
              >
                [AUTOFILL SEED CREDENTIALS]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
