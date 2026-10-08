import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sound } from '../utils/sound';
import { Terminal, Shield, Zap } from 'lucide-react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'covering' | 'unveiling'>('idle');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Step 1: Start covering with curtain wipe
      setTransitionStage('covering');
      sound.playTransmit();

      const timer1 = setTimeout(() => {
        // Step 2: Swap the route content and reset scroll position
        setDisplayLocation(location);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTransitionStage('unveiling');

        const timer2 = setTimeout(() => {
          // Step 3: Complete transition
          setTransitionStage('idle');
        }, 380);

        return () => clearTimeout(timer2);
      }, 340);

      return () => clearTimeout(timer1);
    }
  }, [location, displayLocation]);

  const routeName = location.pathname === '/' ? 'HOME // OVERVIEW' : location.pathname.replace('/', '').toUpperCase();

  return (
    <div className="relative min-h-screen">
      {/* Active Page Content with smooth enter cascade on route change */}
      <div key={displayLocation.pathname} className="page-enter-cascade">
        {children}
      </div>

      {/* Awwwards Curtain Shutter Portal Transition Overlay */}
      {transitionStage !== 'idle' && (
        <div className="fixed inset-0 z-[9990] pointer-events-none flex flex-col justify-between overflow-hidden">
          {/* Main Shutter Curtain Panel */}
          <div
            className={`absolute inset-0 bg-[#06080e] border-y border-cyber-neon/40 flex flex-col items-center justify-center ${
              transitionStage === 'covering' ? 'curtain-wipe-in' : 'curtain-wipe-out'
            }`}
          >
            {/* Background Cyber Mesh Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,245,255,0.12),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

            {/* Glowing Laser Scan Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyber-neon to-transparent shadow-[0_0_15px_#00f5ff]" />

            {/* Center Stage HUD Badge */}
            <div className="relative z-10 flex flex-col items-center px-6 py-4 rounded-xl bg-cyber-950/90 border border-cyber-neon/50 shadow-neon-cyan backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
                <span className="font-mono text-[10px] tracking-widest text-slate-400">
                  ROUTING PROTOCOL // YEHIA-OS
                </span>
              </div>

              <div className="font-tech text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-emerald-300 to-cyber-purple tracking-wider">
                &gt; {routeName}
              </div>

              <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-cyber-neon/80">
                <Zap className="w-3 h-3 text-cyber-green animate-pulse" />
                <span>DECRYPTING TELEMETRY NODE...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;
