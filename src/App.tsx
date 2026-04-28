import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music2, Gamepad2, Settings2 } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-magenta-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full animate-pulse decoration-delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
      </div>

      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 backdrop-blur-md z-50 bg-black/20">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-magenta-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.4)]">
          <Gamepad2 className="w-6 h-6 text-black" />
        </div>
        <div className="flex-1 flex flex-col gap-6 items-center justify-center">
            <NavItem icon={<Music2 className="w-5 h-5" />} label="Audio" active />
            <NavItem icon={<Gamepad2 className="w-5 h-5" />} label="Play" />
            <NavItem icon={<Settings2 className="w-5 h-5" />} label="System" />
        </div>
        <div className="flex flex-col gap-4 text-white/30">
          <Github className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 min-h-screen flex items-center justify-center p-8 gap-12 relative">
        <div className="flex flex-col gap-4 max-w-sm">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2"
            >
                <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 font-bold">Protocol v2.4.0</div>
                <h1 className="text-6xl font-display uppercase italic tracking-tighter leading-none">
                    Neon<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">Rhythm</span><br />
                    Snake
                </h1>
                <p className="text-white/40 text-sm mt-4 leading-relaxed font-mono">
                    Experience the digital interface. Navigate the grid. Sustain the signal.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <MusicPlayer />
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
        >
            <SnakeGame />
        </motion.div>

        {/* Right side status / decor */}
        <div className="fixed right-12 top-12 flex flex-col items-end gap-1 opacity-20 select-none pointer-events-none">
            <div className="text-[10px] font-mono uppercase tracking-widest">Network Status: OK</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Connection: SECURE</div>
        </div>
      </main>

      {/* Bottom ticker */}
      <div className="fixed bottom-0 left-20 right-0 h-12 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap px-8">
        <div className="flex gap-12 animate-scroll font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            <span>Critical System Update Required</span>
            <span>Neural Link Synchronized</span>
            <span>Audio Latency: 4ms</span>
            <span>Grid Refresh Rate: 60Hz</span>
            <span>Points Harvested Today: 452,102</span>
            <span>Critical System Update Required</span>
            <span>Neural Link Synchronized</span>
            <span>Audio Latency: 4ms</span>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={cn(
            "group flex flex-col items-center gap-1 cursor-pointer transition-all",
            active ? "text-cyan-400" : "text-white/20 hover:text-white/60"
        )}>
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                active ? "bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "group-hover:bg-white/5"
            )}>
                {icon}
            </div>
            <span className="text-[8px] uppercase tracking-widest font-bold font-mono">{label}</span>
        </div>
    )
}
