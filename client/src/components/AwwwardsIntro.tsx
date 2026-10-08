import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';
import { Terminal, Volume2, VolumeX, FastForward, ShieldCheck } from 'lucide-react';

interface AwwwardsIntroProps {
  onComplete: () => void;
  profileName?: string;
  profileTitle?: string;
}

const CYBER_GLYPHS = '01X#<>_$!%*+=-~?[]{}';
const TARGET_NAME = 'YEHIA WAEL';

const TELEMETRY_LOGS = [
  'INITIALIZING_NEURAL_KERNEL...',
  'CONNECTING_TURSO_DISTRIBUTED_CLOUD...',
  'OPTIMIZING_REACT_RENDER_PIPELINE...',
  'DECRYPTING_LEVEL_99_ARCHITECT_DATA...',
  'COMPILING_INTERACTIVE_SHADERS...',
  'ACCESS_GRANTED // PORTFOLIO_ONLINE'
];

export const AwwwardsIntro: React.FC<AwwwardsIntroProps> = ({
  onComplete,
  profileName = TARGET_NAME,
  profileTitle = 'SENIOR FULL-STACK & INTERACTIVE ARCHITECT'
}) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [scrambledTitle, setScrambledTitle] = useState(TARGET_NAME);
  const [isExiting, setIsExiting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(sound.isEnabled());
  const [showShockwave, setShowShockwave] = useState(false);

  const isCompletedRef = useRef(false);

  // Keyboard shortcut [ESC] to Skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Kinetic Scramble Decoder Effect
  useEffect(() => {
    let iteration = 0;
    const target = (profileName || TARGET_NAME).toUpperCase();
    
    const interval = setInterval(() => {
      setScrambledTitle(
        target
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return target[index];
            return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= target.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 45);

    return () => clearInterval(interval);
  }, [profileName]);

  // High-precision Kinetic Progress Counter
  useEffect(() => {
    const startTime = performance.now();
    const duration = 2100; // 2.1 seconds for full Awwwards tension build

    const updateProgress = (currentTime: number) => {
      if (isCompletedRef.current) return;
      
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      
      // Custom exponential tension curve (fast start, deliberate architectural pause near 90-99%, then 100%)
      let ease = t < 0.6 
        ? Math.pow(t / 0.6, 2) * 0.7 
        : 0.7 + Math.pow((t - 0.6) / 0.4, 3) * 0.3;
      
      const currentVal = Math.min(100, Math.round(ease * 100));
      setProgress(currentVal);

      // Play subtle sound blips at milestones
      if (currentVal % 18 === 0 && currentVal < 90) {
        sound.playBootGlitch();
      }

      // Update telemetry log stage
      const nextLog = Math.min(
        TELEMETRY_LOGS.length - 1,
        Math.floor((currentVal / 100) * TELEMETRY_LOGS.length)
      );
      setLogIndex(nextLog);

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
    setShowShockwave(true);
    sound.playWhoosh();

    // Trigger curtain shutter slide exit
    setIsExiting(true);

    // Call onComplete right as shutters open and reveal the website underneath
    setTimeout(() => {
      onComplete();
    }, 950);
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
      className={`fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer bg-transparent transition-opacity duration-700 ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* 5 Awwwards Vertical Staggered Shutter Slices */}
      <div className="absolute inset-0 flex pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => {
          const isOdd = i % 2 === 1;
          const delayMs = i * 75; // Staggered ripple wave effect
          return (
            <div
              key={i}
              style={{
                animationDelay: isExiting ? `${delayMs}ms` : '0ms'
              }}
              className={`w-1/5 h-full bg-[#05070a] border-r border-cyber-border/30 relative transition-transform ${
                isExiting
                  ? isOdd
                    ? 'shutter-panel-down'
                    : 'shutter-panel-up'
                  : ''
              }`}
            >
              {/* Subtle architectural vertical grid rule */}
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyber-neon/15 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Cyberpunk Scanlines & Mesh Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(0,245,255,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(176,38,255,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-25 pointer-events-none" />

      {/* Shockwave Burst on 100% Completion */}
      {showShockwave && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-cyber-neon animate-shockwave pointer-events-none shadow-neon-cyan" />
      )}

      {/* Top HUD Status Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 sm:p-8 flex items-center justify-between z-20 transition-all duration-500 ease-awwwards ${
          isExiting ? '-translate-y-12 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green" />
          </span>
          <span className="font-mono text-xs text-slate-300 tracking-wider">
            KERNEL_BOOT // PROTOCOL v4.9
          </span>
        </div>

        <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyber-neon/30 bg-cyber-950/80 hover:bg-cyber-neon/10 hover:border-cyber-neon transition-all group shadow-neon-cyan/10">
            <FastForward className="w-3.5 h-3.5 text-cyber-neon group-hover:translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] text-slate-300 group-hover:text-white tracking-widest">
              [ ESC / SKIP ]
            </span>
          </div>
        </div>
      </div>

      {/* Central Content Stage */}
      <div
        className={`relative z-10 w-full h-full flex flex-col items-center justify-center px-4 transition-all duration-700 ease-awwwards ${
          isExiting
            ? 'scale-95 translate-y-6 opacity-0'
            : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Holographic Rotating Concentric SVG Ring */}
        <div className="relative mb-8 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="0.75"
              strokeDasharray="4 8"
              opacity="0.4"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#00ff88"
              strokeWidth="0.5"
              strokeDasharray="12 12"
              opacity="0.5"
            />
          </svg>

          <svg
            className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite_reverse]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#b026ff"
              strokeWidth="0.5"
              strokeDasharray="2 10"
              opacity="0.3"
            />
          </svg>

          {/* Central Monogram Badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cyber-900 border border-cyber-neon/60 flex flex-col items-center justify-center shadow-neon-cyan backdrop-blur-md group">
            <span className="font-tech text-xl sm:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyber-neon via-emerald-300 to-cyber-purple">
              YW
            </span>
            <span className="font-mono text-[8px] text-cyber-green tracking-widest">
              L-99
            </span>
          </div>
        </div>

        {/* Decrypted Architectural Name */}
        <div className="overflow-hidden mb-3 text-center">
          <h1 className="font-tech text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_25px_rgba(0,245,255,0.35)]">
            {scrambledTitle}
          </h1>
        </div>

        {/* Subtitle / Role */}
        <div className="font-mono text-xs sm:text-sm text-cyber-neon/90 tracking-[0.25em] uppercase mb-8 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-green animate-pulse" />
          <span>{profileTitle}</span>
        </div>

        {/* Telemetry Log Terminal Readout */}
        <div className="w-full max-w-md bg-cyber-900/60 border border-cyber-border rounded-lg p-3 sm:p-4 mb-8 backdrop-blur-md">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-2 pb-2 border-b border-cyber-border/60">
            <span className="flex items-center gap-1.5 text-cyber-green">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUS: NOMINAL
            </span>
            <span className="text-slate-500">
              SYS_ID: 0x7E1A
            </span>
          </div>

          <div className="font-mono text-xs text-cyber-neon truncate">
            <span className="text-slate-500 mr-2">&gt;</span>
            <span className="animate-pulse">{TELEMETRY_LOGS[logIndex]}</span>
          </div>
        </div>

        {/* Kinetic Numerals & Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs text-slate-400 tracking-wider">
              DATASTREAM SYNCHRONIZATION
            </span>
            <span className="font-tech text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-green drop-shadow-[0_0_12px_rgba(0,245,255,0.5)]">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>

          {/* High-tech Progress Bar */}
          <div className="relative w-full h-1.5 sm:h-2 bg-cyber-900/90 rounded-full overflow-hidden border border-cyber-border">
            <div
              className="h-full bg-gradient-to-r from-cyber-purple via-cyber-neon to-cyber-green rounded-full transition-all duration-75 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Laser Scanning Head */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[1px] shadow-[0_0_8px_#ffffff]" />
            </div>
            {/* Subtle laser sweep */}
            <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-laser pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Architectural Coordinates */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-center justify-between z-20 font-mono text-[10px] text-slate-500 transition-all duration-500 ease-awwwards ${
          isExiting ? 'translate-y-12 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="hidden sm:block">
          LOCATION: CAIRO // 30.0444° N, 31.2357° E
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          CLICK ANYWHERE OR PRESS [ESC] TO SKIP
        </div>
      </div>
    </div>
  );
};

export default AwwwardsIntro;
