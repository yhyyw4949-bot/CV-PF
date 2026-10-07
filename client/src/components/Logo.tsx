import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 38, showText = true }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Clean Geometric YW Web Engineering Monogram */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(0,245,255,0.4)]"
      >
        <defs>
          {/* Subtle Modern Tech Gradient (Cyan to Emerald) */}
          <linearGradient id="web-yw-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>

          {/* Dark Glass Card Frame Gradient */}
          <linearGradient id="web-yw-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#101524" />
            <stop offset="100%" stopColor="#080b12" />
          </linearGradient>
        </defs>

        {/* Minimalist Tech Background Rounded Squircle */}
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="24"
          fill="url(#web-yw-bg)"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Inner subtle glow border on hover */}
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="24"
          fill="none"
          stroke="url(#web-yw-gradient)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          className="transition-opacity duration-300 group-hover:stroke-opacity-100"
        />

        {/* Modern Geometric 'Y' Letterform */}
        {/* Left Arm of Y */}
        <path
          d="M 28 32 L 50 64"
          stroke="url(#web-yw-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Arm of Y and Stem to Bottom-Left */}
        <path
          d="M 68 32 L 50 64 L 34 88"
          stroke="url(#web-yw-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Modern Geometric 'W' Letterform Interlocking */}
        <path
          d="M 52 56 L 64 88 L 78 58 L 92 88 L 100 56"
          stroke="url(#web-yw-gradient)"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Corner Code Syntax Dot */}
        <circle cx="100" cy="22" r="3" fill="#00f5ff" />
      </svg>

      {/* Modern Software Engineer Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-tech text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-cyber-neon transition-colors">
              YEHIA WAEL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 tracking-widest mt-1">
            SOFTWARE &amp; WEB DEV
          </span>
        </div>
      )}
    </div>
  );
};
