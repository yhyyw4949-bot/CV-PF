import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { Profile, Skill, Project, Article } from '../types';
import { sound } from '../utils/sound';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  articles: Article[];
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  profile,
  skills,
  projects,
  articles
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playBlip();
      setTimeout(() => inputRef.current?.focus(), 50);
      if (history.length === 0) {
        setHistory([
          {
            command: 'welcome',
            output: (
              <div className="space-y-1 text-slate-300">
                <div className="text-cyber-neon font-bold">
                  ⚡ YEHIA-OS v2.6.0 (x86_64-pc-cyber-matrix)
                </div>
                <div>Type <span className="text-cyber-green font-bold">&apos;help&apos;</span> to inspect all available system instructions.</div>
                <div className="text-slate-500 text-[11px]">Type &apos;exit&apos; or press ESC to terminate terminal shell.</div>
              </div>
            )
          }
        ]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    sound.playClick();
    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    const parts = cmd.toLowerCase().split(' ');
    const main = parts[0];
    const arg = parts.slice(1).join(' ');

    let output: React.ReactNode = null;

    switch (main) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-cyber-neon font-bold">// RECOGNIZED INSTRUCTIONS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <div><span className="text-cyber-green font-mono">whoami / bio</span> — Operative background &amp; summary</div>
              <div><span className="text-cyber-green font-mono">skills</span> — Technical capabilities matrix</div>
              <div><span className="text-cyber-green font-mono">projects</span> — List all shipped systems</div>
              <div><span className="text-cyber-green font-mono">project &lt;slug&gt;</span> — Inspect specific project specs</div>
              <div><span className="text-cyber-green font-mono">articles</span> — Technical articles &amp; engineering notes</div>
              <div><span className="text-cyber-green font-mono">contact</span> — Comm link &amp; transmission coordinates</div>
              <div><span className="text-cyber-green font-mono">socials</span> — GitHub, LinkedIn, Discord &amp; Steam</div>
              <div><span className="text-cyber-green font-mono">resume</span> — CV download link</div>
              <div><span className="text-cyber-green font-mono">clear</span> — Wipe terminal viewport</div>
              <div><span className="text-cyber-green font-mono">sudo</span> — Elevate to superuser privilege</div>
              <div><span className="text-cyber-green font-mono">exit</span> — Close terminal shell</div>
            </div>
          </div>
        );
        break;

      case 'bio':
      case 'whoami':
        output = (
          <div className="space-y-2 text-slate-300">
            <div className="text-white font-bold text-sm">{profile.name} — {profile.title}</div>
            <div className="text-cyber-neon text-xs">{profile.tagline}</div>
            <div className="text-xs leading-relaxed whitespace-pre-line">{profile.bio}</div>
            <div className="text-xs text-cyber-green">BASE: {profile.location}</div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2">
            <div className="text-cyber-neon font-bold text-xs">// TECHNICAL ARSENAL:</div>
            <div className="space-y-1.5 text-xs">
              {skills.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-36 text-slate-200 truncate">{s.name}</span>
                  <div className="w-32 bg-cyber-950 h-2 rounded overflow-hidden border border-cyber-border/60">
                    <div className="bg-cyber-neon h-full" style={{ width: `${s.proficiency}%` }} />
                  </div>
                  <span className="text-cyber-green font-mono text-[11px]">{s.proficiency}%</span>
                  <span className="text-slate-500 text-[10px]">[{s.category}]</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2">
            <div className="text-cyber-neon font-bold text-xs">// SHIPPED PROTOCOLS:</div>
            <div className="space-y-1 text-xs">
              {projects.map((p) => (
                <div key={p.id} className="p-1.5 rounded bg-cyber-950/70 border border-cyber-border/40">
                  <span className="text-white font-bold">{p.title}</span>{' '}
                  <span className="text-cyber-neon font-mono text-[11px]">({p.slug})</span>{' '}
                  <span className="text-slate-400">— {p.tagline || p.description.slice(0, 70)}...</span>
                  <div className="text-[10px] text-cyber-green mt-0.5">
                    Tech: {p.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tip: Type &apos;project &lt;slug&gt;&apos; to inspect a specific protocol.
            </div>
          </div>
        );
        break;

      case 'project':
        if (!arg) {
          output = <div className="text-red-400 text-xs">Usage: project &lt;slug&gt; (e.g. project cybervanguard-arena)</div>;
        } else {
          const match = projects.find((p) => p.slug.toLowerCase().includes(arg) || p.title.toLowerCase().includes(arg));
          if (match) {
            output = (
              <div className="space-y-2 text-xs">
                <div className="text-cyber-neon font-bold text-sm">{match.title}</div>
                <div className="text-slate-300">{match.description}</div>
                <div className="text-cyber-green">Tech Stack: {match.technologies.join(', ')}</div>
                {match.demo_url && <div>Demo: <a href={match.demo_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{match.demo_url}</a></div>}
                {match.github_url && <div>GitHub: <a href={match.github_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{match.github_url}</a></div>}
              </div>
            );
          } else {
            output = <div className="text-red-400 text-xs">Protocol not found matching: &ldquo;{arg}&rdquo;</div>;
          }
        }
        break;

      case 'articles':
        output = (
          <div className="space-y-2 text-xs">
            <div className="text-cyber-neon font-bold">// TECHNICAL ARTICLES:</div>
            {articles.map((a) => (
              <div key={a.id} className="p-1.5 rounded bg-cyber-950/70 border border-cyber-border/40">
                <div className="text-white font-semibold">{a.title}</div>
                <div className="text-slate-400 text-[11px]">{a.summary}</div>
                <div className="text-[10px] text-cyber-green mt-0.5">{a.read_time} // {a.tags.join(', ')}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'socials':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-cyber-neon font-bold">// TRANSMISSION CHANNELS:</div>
            {profile.github_url && <div>GitHub: <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{profile.github_url}</a></div>}
            {profile.linkedin_url && <div>LinkedIn: <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{profile.linkedin_url}</a></div>}
            {profile.discord_username && <div>Discord: <span className="text-cyber-green">{profile.discord_username}</span></div>}
            {profile.steam_url && <div>Steam: <a href={profile.steam_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{profile.steam_url}</a></div>}
            {profile.twitter_url && <div>X / Twitter: <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{profile.twitter_url}</a></div>}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-cyber-neon font-bold">// DIRECT COMM SPEC:</div>
            <div>Email: <a href={`mailto:${profile.email}`} className="text-cyber-green underline">{profile.email}</a></div>
            {profile.phone && <div>Phone: {profile.phone}</div>}
            <div>Location: {profile.location}</div>
          </div>
        );
        break;

      case 'resume':
      case 'cv':
        output = (
          <div className="text-xs">
            {profile.resume_url ? (
              <div>
                Fetch PDF: <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-cyber-neon underline">{profile.resume_url}</a>
              </div>
            ) : (
              <div className="text-slate-400">No external resume link registered.</div>
            )}
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="text-red-400 text-xs">
            Permission denied: Operative {profile.name} holds root clearance on this machine.
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        setInputVal('');
        return;

      default:
        output = (
          <div className="text-red-400 text-xs">
            Command not recognized: &ldquo;{cmd}&rdquo;. Type <span className="text-cyber-green font-bold">&apos;help&apos;</span> to inspect available instructions.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: rawCmd, output }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Terminal Window */}
      <div
        className={`relative bg-cyber-950 border border-cyber-neon/40 rounded-xl shadow-2xl shadow-cyber-neon/20 flex flex-col z-10 transition-all duration-300 ${
          isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[580px]'
        }`}
      >
        {/* Top Window Bar */}
        <div className="px-4 py-3 bg-cyber-900 border-b border-cyber-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-cyber-green inline-block" />
            <span className="ml-2 font-mono text-xs text-cyber-neon flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>yehia@matrix-terminal:~ (bash)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-white p-1 rounded"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-mono text-xs space-y-4">
          {history.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-cyber-neon">
                <span className="text-cyber-green">guest@yehia-os:~$</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
              <div className="pl-4 text-slate-300">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Line */}
        <div className="p-3 bg-cyber-900/90 border-t border-cyber-border flex items-center gap-2 font-mono text-xs shrink-0">
          <span className="text-cyber-green font-bold shrink-0">guest@yehia-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help' for instructions..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600 font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="text-cyber-neon hover:text-cyan-300 p-1"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
