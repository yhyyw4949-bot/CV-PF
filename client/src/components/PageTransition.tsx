import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { sound } from '../utils/sound';
import { Zap, Activity, CheckCircle2 } from 'lucide-react';

interface PageTransitionProps {
  children: React.ReactNode;
}

interface RouteInfo {
  title: string;
  sub: string;
  code: string;
}

const getRouteInfo = (pathname: string): RouteInfo => {
  switch (pathname) {
    case '/':
      return {
        title: 'CENTRAL CORE',
        sub: 'OVERVIEW & FLAGSHIP ARCHITECTURES',
        code: 'SYS.00 // CORE',
      };
    case '/about':
      return {
        title: 'OPERATIVE DOSSIER',
        sub: 'ENGINEER PROFILE & PHILOSOPHY',
        code: 'SYS.01 // BIO',
      };
    case '/skills':
      return {
        title: 'TELEMETRY RADAR',
        sub: 'TECHNICAL STACK & CAPABILITIES',
        code: 'SYS.02 // STACK',
      };
    case '/projects':
      return {
        title: 'PRODUCTION ARCHIVES',
        sub: 'DEPLOYED APPLICATIONS & SYSTEMS',
        code: 'SYS.03 // APPS',
      };
    case '/timeline':
      return {
        title: 'CAREER CHRONOLOGY',
        sub: 'EXPERIENCE & EDUCATION PATH',
        code: 'SYS.04 // PATH',
      };
    case '/articles':
      return {
        title: 'TECHNICAL JOURNAL',
        sub: 'ENGINEERING PAPERS & GUIDES',
        code: 'SYS.05 // DOCS',
      };
    case '/testimonials':
      return {
        title: 'CLIENT ENDORSEMENTS',
        sub: 'REVIEWS & VERIFIED FEEDBACK',
        code: 'SYS.06 // VOUCH',
      };
    case '/contact':
      return {
        title: 'SECURE DISPATCH',
        sub: 'DIRECT TRANSMISSION CHANNELS',
        code: 'SYS.07 // COMMS',
      };
    case '/admin':
      return {
        title: 'COMMAND SUITE',
        sub: 'SYSTEM CONTROL & DATABASE OPS',
        code: 'SYS.ADM // ROOT',
      };
    default: {
      const clean = pathname.replace('/', '').toUpperCase() || 'NODE';
      return {
        title: clean,
        sub: 'ROUTING DATA PACKETS',
        code: `SYS.NAV // ${clean}`,
      };
    }
  }
};

const SLICES = [
  { id: 0, tag: 'SECTOR-01' },
  { id: 1, tag: 'LAT.30.04°N' },
  { id: 2, tag: 'YEHIA.SYS' },
  { id: 3, tag: 'LNG.31.23°E' },
  { id: 4, tag: 'SECTOR-05' },
];

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<'covering' | 'unveiling'>('covering');
  const [progress, setProgress] = useState(0);

  // Keep track of the last processed path to prevent duplicate / stuck triggers
  const lastPathRef = useRef(location.pathname);
  const targetRouteRef = useRef(location.pathname);

  // Global escape key listener to guarantee dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTransitioning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // If the path didn't change, do not trigger a transition
    if (location.pathname === lastPathRef.current) {
      return;
    }

    // New navigation initiated
    lastPathRef.current = location.pathname;
    targetRouteRef.current = location.pathname;

    // 1. Activate covering stage
    setIsTransitioning(true);
    setStage('covering');
    setProgress(0);
    sound.playWhoosh();

    // 2. High-precision 60fps progress counter reaching 100% in 420ms
    const startTime = performance.now();
    const progressDuration = 420;
    let animId: number;

    const animateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / progressDuration) * 100));
      setProgress(pct);
      if (pct < 100) {
        animId = requestAnimationFrame(animateProgress);
      }
    };
    animId = requestAnimationFrame(animateProgress);

    // 3. Swap route content & scroll to top when blades are 100% closed (430ms)
    const swapTimer = window.setTimeout(() => {
      setDisplayLocation(location);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 430);

    // 4. Begin unveiling blades (560ms - after a crisp 130ms hold)
    const unveilTimer = window.setTimeout(() => {
      setStage('unveiling');
      sound.playTransmit();
    }, 560);

    // 5. Complete transition and unmount overlay (1040ms)
    const completeTimer = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 1040);

    // 6. Triple-redundant failsafe: Force unmount after 1350ms under all conditions
    const failsafeTimer = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 1350);

    return () => {
      cancelAnimationFrame(animId);
      window.clearTimeout(swapTimer);
      window.clearTimeout(unveilTimer);
      window.clearTimeout(completeTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, [location.pathname]); // STRICTLY depends only on location.pathname to prevent premature effect cleanup

  const routeInfo = getRouteInfo(targetRouteRef.current);

  // Render children with displayLocation so previous route persists while blades close
  const renderedContent = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, { location: displayLocation })
    : children;

  return (
    <div className="relative min-h-screen">
      {/* Active Page Content with smooth enter cascade on route change */}
      <div key={displayLocation.pathname} className="page-enter-cascade">
        {renderedContent}
      </div>

      {/* Awwwards Multi-Blade Shutter Portal Transition Overlay */}
      {isTransitioning && (
        <div
          onClick={() => setIsTransitioning(false)}
          className="fixed inset-0 z-[9990] flex pointer-events-auto select-none overflow-hidden cursor-default"
          style={{ willChange: 'transform, opacity' }}
          title="Click to dismiss transition"
        >
          {/* 5 Staggered Shutter Vertical Blades */}
          {SLICES.map((slice, index) => {
            const delayMs = index * 25; // 25ms stagger: 0ms, 25ms, 50ms, 75ms, 100ms
            return (
              <div
                key={slice.id}
                className={`relative w-1/5 h-full bg-[#060810] border-r border-cyber-neon/15 last:border-r-0 flex flex-col justify-between py-8 px-4 ${
                  stage === 'covering' ? 'portal-slice-in' : 'portal-slice-out'
                }`}
                style={{
                  animationDelay: `${delayMs}ms`,
                  boxShadow:
                    stage === 'covering'
                      ? '0 -8px 30px rgba(0, 245, 255, 0.2)'
                      : '0 8px 30px rgba(168, 85, 247, 0.2)',
                }}
              >
                {/* Background Blade Subtle Gradient & Scanlines */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/25 via-transparent to-purple-950/25 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(0,245,255,0.05),transparent_80%)] pointer-events-none" />

                {/* Top Telemetry Column Watermark */}
                <div className="relative z-10 hidden sm:flex items-center justify-between font-mono text-[9px] text-slate-500/50 tracking-widest uppercase">
                  <span>{slice.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-cyber-neon/40" />
                </div>

                <div className="hidden sm:block" />

                {/* Bottom Telemetry Column Watermark */}
                <div className="relative z-10 hidden sm:flex items-center justify-between font-mono text-[9px] text-slate-500/50 tracking-widest uppercase">
                  <span className="w-1 h-1 rounded-full bg-cyber-purple/40" />
                  <span>0{index + 1} // PROTOCOL</span>
                </div>
              </div>
            );
          })}

          {/* Glowing Laser Beam Sweeping Horizontally */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyber-neon to-transparent shadow-[0_0_20px_#00f5ff] pointer-events-none z-20 laser-sweep-anim" />

          {/* Central Holographic HUD Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div
              className={`relative mx-4 max-w-lg w-full px-8 py-7 rounded-2xl bg-[#090d16]/95 border border-cyber-neon/40 shadow-neon-cyan backdrop-blur-xl flex flex-col items-center text-center overflow-hidden ${
                stage === 'covering' ? 'hud-scale-in' : 'hud-fade-out'
              }`}
            >
              {/* Corner Sci-Fi Bracket Highlights */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-neon" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-neon" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-purple" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-purple" />

              {/* Status Header Badge */}
              <div className="flex items-center gap-2.5 mb-3 px-3 py-1 rounded-full bg-cyber-950/80 border border-cyber-neon/30">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
                <span className="font-mono text-[11px] tracking-wider text-slate-300 font-medium">
                  {routeInfo.code}
                </span>
                <span className="text-slate-600 font-mono text-[10px]">|</span>
                <span className="font-mono text-[10px] text-cyber-neon flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyber-green animate-pulse" />
                  STREAM ACTIVE
                </span>
              </div>

              {/* Grand Route Title */}
              <div className="font-tech text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-white to-cyber-purple tracking-widest my-1">
                &gt; {routeInfo.title}
              </div>

              {/* Sub-telemetry Description */}
              <p className="font-mono text-[11px] sm:text-xs text-slate-400 tracking-wider mb-5">
                {routeInfo.sub}
              </p>

              {/* Progress Counter & Fluid Meter */}
              <div className="w-full max-w-xs flex flex-col items-center gap-2">
                <div className="w-full flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    {progress >= 100 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
                    )}
                    <span>{progress >= 100 ? 'NODE SYNCHRONIZED' : 'BUFFERING NODE'}</span>
                  </span>
                  <span className="font-bold text-cyber-neon tracking-wider font-mono">
                    {progress.toString().padStart(2, '0')}%
                  </span>
                </div>

                {/* Meter Track */}
                <div className="w-full h-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyber-neon via-cyan-400 to-cyber-purple shadow-[0_0_12px_#00f5ff] transition-[width] duration-75 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Bottom Micro Telemetry */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between font-mono text-[9px] text-slate-500">
                <span>YEHIA WAEL // PORTFOLIO OS</span>
                <span className="text-cyber-green/90 font-mono">
                  {progress >= 100 ? 'READY // DISPATCHING' : 'LATENCY 0.08ms // BUSY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;
