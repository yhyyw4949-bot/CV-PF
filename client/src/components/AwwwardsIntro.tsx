import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';
import { Terminal, Volume2, VolumeX, FastForward, ShieldCheck, Sparkles } from 'lucide-react';

interface AwwwardsIntroProps {
  onComplete: () => void;
  profileName?: string;
  profileTitle?: string;
}

const CYBER_GLYPHS = '01X#<>_$!%*+=-~?[]{}';
const DEFAULT_NAME = 'YEHIA WAEL';

const TELEMETRY_STAGES = [
  { threshold: 0, text: 'BOOTING_CORE_NEURAL_KERNEL [x86_64]' },
  { threshold: 18, text: 'INITIALIZING_TURSO_DISTRIBUTED_EDGE_DB' },
  { threshold: 38, text: 'ESTABLISHING_HIGH_THROUGHPUT_WEB_SOCKETS' },
  { threshold: 58, text: 'COMPILING_REACT_19_INTERACTIVE_SHADERS' },
  { threshold: 78, text: 'VERIFYING_LEVEL_99_ARCHITECT_IDENTITY' },
  { threshold: 92, text: 'SYNCHRONIZING_PORTFOLIO_TELEMETRY...' },
  { threshold: 99, text: 'ALL_SYSTEMS_OPTIMAL // ACCESS_GRANTED' }
];

export const AwwwardsIntro: React.FC<AwwwardsIntroProps> = ({
  onComplete,
  profileName = DEFAULT_NAME,
  profileTitle = 'SENIOR FULL-STACK & INTERACTIVE ARCHITECT'
}) => {
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());
  const [currentLog, setCurrentLog] = useState(TELEMETRY_STAGES[0].text);
  const [isExiting, setIsExiting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(sound.isEnabled());
  const [showShockwave, setShowShockwave] = useState(false);

  const isCompletedRef = useRef(false);
  const targetChars = (profileName || DEFAULT_NAME).toUpperCase().split('');

  // Keyboard shortcut [ESC] or Spacebar to Skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cinematic Letter-by-Letter Decryption Engine (Smoother, staggered locking)
  useEffect(() => {
    const totalChars = targetChars.length;
    let frameId: number;
    let startTime = performance.now();
    // Decrypt smoothly across 3.2 seconds
    const decryptDuration = 3200;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / decryptDuration);
      
      // Calculate how many characters should be locked based on time
      const lockThreshold = Math.floor(progressRatio * totalChars);
      const newLocked = new Set<number>();
      for (let i = 0; i <= lockThreshold; i++) {
        newLocked.add(i);
      }
      setLockedIndices(newLocked);

      const nextArr = targetChars.map((char, idx) => {
        if (char === ' ') return ' ';
        if (idx <= lockThreshold) return char;
        // Jumble unlocked letters with smooth random glyphs
        return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
      });
      setDisplayedText(nextArr);

      if (progressRatio < 1 && !isCompletedRef.current) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [profileName]);

  // Longer, Ultra-Smooth Piecewise Cinematic Progress Counter (3.8 seconds)
  useEffect(() => {
    const startTime = performance.now();
    const duration = 3800; // 3.8s total duration for luxurious Awwwards pacing

    const updateProgress = (currentTime: number) => {
      if (isCompletedRef.current) return;

      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // S-curve with dramatic tension pause at 99%
      let val: number;
      if (t < 0.25) {
        // Act I: Gentle deliberate start (0 -> 25%)
        val = Math.pow(t / 0.25, 1.6) * 25;
      } else if (t < 0.8) {
        // Act II: Silky steady acceleration (25 -> 88%)
        const subT = (t - 0.25) / 0.55;
        val = 25 + subT * 63;
      } else if (t < 0.94) {
        // Act III: Dramatic deceleration & tension suspense (88 -> 99%)
        const subT = (t - 0.8) / 0.14;
        val = 88 + Math.pow(subT, 0.7) * 11;
      } else {
        // Act IV: 100% completion release
        val = 100;
      }

      const currentInt = Math.min(100, Math.round(val));
      setProgress(currentInt);

      // Subtle sound blips at rhythmic milestones
      if (currentInt % 22 === 0 && currentInt < 95) {
        sound.playBootGlitch();
      }

      // Update telemetry log smoothly
      for (let i = TELEMETRY_STAGES.length - 1; i >= 0; i--) {
        if (currentInt >= TELEMETRY_STAGES[i].threshold) {
          setCurrentLog(TELEMETRY_STAGES[i].text);
          break;
        }
      }

      if (t < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        triggerExit();
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const triggerExit = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setProgress(100);
    setCurrentLog('ACCESS_GRANTED // UNVEILING PORTFOLIO');
    setShowShockwave(true);
    sound.playChime();
    sound.playWhoosh();

    // Trigger liquid shutter curtain slide exit
    setIsExiting(true);

    // Give 1.35 seconds for the liquid shutter wave to fully unveil the site
    setTimeout(() => {
      onComplete();
    }, 1350);
  };

  const handleSkip = () => {
    if (!isCompletedRef.current) {
      triggerExit();
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sound.toggle();
    setAudioEnabled(updated);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer bg-transparent transition-opacity duration-1000 ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* 5 Awwwards Vertical Staggered Shutter Panels (Longer & Smoother Wave) */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => {
          const isOdd = i % 2 === 1;
          const delayMs = i * 110; // Silky staggered ripple delay
          return (
            <div
              key={i}
              style={{
                animationDelay: isExiting ? `${delayMs}ms` : '0ms'
              }}
              className={`w-1/5 h-full bg-[#05070a] border-r border-cyber-border/40 relative ${
                isExiting
                  ? isOdd
                    ? 'shutter-panel-down'
                    : 'shutter-panel-up'
                  : ''
              }`}
            >
              {/* Subtle architectural vertical grid rule */}
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyber-neon/20 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Cyberpunk Atmospheric Mesh Glow with Smooth Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,rgba(0,245,255,0.14),transparent_75%)] pointer-events-none transition-all duration-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(176,38,255,0.09),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_20%,rgba(0,255,136,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />

      {/* Expanding Shockwave Burst on Completion */}
      {showShockwave && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-cyber-neon animate-shockwave pointer-events-none shadow-neon-cyan" />
      )}

      {/* Top HUD Status Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 sm:p-10 flex items-center justify-between z-20 transition-all duration-700 ease-awwwards ${
          isExiting ? '-translate-y-16 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green" />
          </span>
          <span className="font-mono text-xs text-slate-300 tracking-wider">
            YEHIA_OS // SYSTEM_BOOT_SEQUENCE v5.0
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyber-900/80 border border-cyber-border hover:border-cyber-neon font-mono text-[11px] text-slate-300 hover:text-cyber-neon transition-colors"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyber-green" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Interactive Skip Pill */}
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-cyber-neon/30 bg-cyber-950/80 hover:bg-cyber-neon/15 hover:border-cyber-neon transition-all group shadow-neon-cyan/15">
            <FastForward className="w-3.5 h-3.5 text-cyber-neon group-hover:translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] text-slate-300 group-hover:text-white tracking-widest">
              [ ESC / SKIP ]
            </span>
          </div>
        </div>
      </div>

      {/* Central Content Stage (Smooth scale & fade out) */}
      <div
        className={`relative z-10 w-full h-full flex flex-col items-center justify-center px-4 transition-all duration-1000 ease-awwwards ${
          isExiting
            ? 'scale-95 -translate-y-8 opacity-0 blur-sm'
            : 'scale-100 translate-y-0 opacity-100 blur-none'
        }`}
      >
        {/* Holographic Rotating Concentric SVG Ring */}
        <div className="relative mb-8 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="0.8"
              strokeDasharray="4 8"
              opacity="0.45"
            />
            <circle
              cx="50"
              cy="50"
              r="39"
              fill="none"
              stroke="#00ff88"
              strokeWidth="0.6"
              strokeDasharray="14 14"
              opacity="0.55"
            />
          </svg>

          <svg
            className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite_reverse]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#b026ff"
              strokeWidth="0.5"
              strokeDasharray="2 12"
              opacity="0.35"
            />
          </svg>

          {/* Central Monogram Emblem */}
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-cyber-900/90 border border-cyber-neon/60 flex flex-col items-center justify-center shadow-neon-cyan backdrop-blur-md group">
            <span className="font-tech text-2xl sm:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyber-neon via-emerald-300 to-cyber-purple">
              YW
            </span>
            <span className="font-mono text-[9px] text-cyber-green tracking-widest">
              L-99
            </span>
          </div>
        </div>

        {/* Decrypted Architectural Name (Staggered character illuminate) */}
        <div className="overflow-hidden mb-3 text-center flex items-center justify-center tracking-tight">
          <h1 className="font-tech text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,245,255,0.4)] flex justify-center flex-wrap">
            {(displayedText.length > 0 ? displayedText : targetChars).map((char, index) => {
              const isLocked = lockedIndices.has(index);
              return (
                <span
                  key={index}
                  className={`inline-block transition-all duration-300 ${
                    char === ' ' ? 'w-3 sm:w-5' : ''
                  } ${
                    isLocked
                      ? 'text-white drop-shadow-[0_0_15px_rgba(0,245,255,0.6)] translate-y-0 scale-100'
                      : 'text-cyber-neon/60 drop-shadow-none translate-y-0.5 scale-95 font-mono'
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>

        {/* Subtitle / Role */}
        <div className="font-mono text-xs sm:text-sm text-cyber-neon/90 tracking-[0.25em] uppercase mb-8 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-green animate-pulse" />
          <span>{profileTitle}</span>
        </div>

        {/* Telemetry Log Terminal Readout */}
        <div className="w-full max-w-md bg-cyber-900/70 border border-cyber-border rounded-xl p-3.5 sm:p-4 mb-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-2 pb-2 border-b border-cyber-border/60">
            <span className="flex items-center gap-1.5 text-cyber-green">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUS: NOMINAL
            </span>
            <span className="text-slate-500 font-mono">
              ADDR: 0x7E1A // CLOUD_SYNCED
            </span>
          </div>

          <div className="font-mono text-xs text-cyber-neon truncate flex items-center">
            <span className="text-slate-500 mr-2 font-bold">&gt;</span>
            <span className="truncate">{currentLog}</span>
          </div>
        </div>

        {/* Kinetic Numerals & High-Precision Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-baseline justify-between mb-2.5">
            <span className="font-mono text-xs text-slate-400 tracking-wider">
              DATASTREAM SYNCHRONIZATION
            </span>
            <span className="font-tech text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-emerald-300 to-cyber-green drop-shadow-[0_0_16px_rgba(0,245,255,0.6)]">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>

          {/* High-tech Progress Bar with Glowing Laser Track */}
          <div className="relative w-full h-2 sm:h-2.5 bg-cyber-900/90 rounded-full overflow-hidden border border-cyber-border/80 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyber-purple via-cyber-neon to-cyber-green rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Laser Scanning Head */}
              <div className="absolute right-0 top-0 bottom-0 w-3.5 bg-white blur-[1px] shadow-[0_0_12px_#ffffff]" />
            </div>
            {/* Subtle laser sweep */}
            <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-laser pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Architectural Coordinates */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex items-center justify-between z-20 font-mono text-[10px] text-slate-500 transition-all duration-700 ease-awwwards ${
          isExiting ? 'translate-y-16 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="hidden sm:flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-cyber-neon/60" />
          <span>COORDINATES: CAIRO // 30.0444° N, 31.2357° E</span>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto text-slate-400 hover:text-slate-200 transition-colors">
          CLICK ANYWHERE OR PRESS [ESC] TO SKIP
        </div>
      </div>
    </div>
  );
};

export default AwwwardsIntro;
