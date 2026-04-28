import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';
import { cn } from '../lib/utils';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'Cyber Synth',
    coverUrl: 'https://picsum.photos/seed/neon1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Digital Rain',
    artist: 'Binary Beats',
    coverUrl: 'https://picsum.photos/seed/neon2/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Electric Dreams',
    artist: 'Volt Wave',
    coverUrl: 'https://picsum.photos/seed/neon3/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-80 flex flex-col gap-6 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-magenta-500/20 blur-[80px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full" />

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Vinyl record effect when playing */}
        {isPlaying && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-24 h-24 rounded-full border-[10px] border-black/40 backdrop-blur-sm shadow-inner flex items-center justify-center opacity-40">
              <Disc className="w-10 h-10 text-white/20" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-1 z-10">
        <h3 className="text-xl font-bold text-white truncate drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          {currentTrack.title}
        </h3>
        <p className="text-sm font-mono uppercase tracking-widest text-white/50">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden z-10">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-magenta-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center items-center gap-6 z-10">
        <button 
          onClick={handlePrev}
          className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 tracking-widest uppercase z-10">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3 h-3" />
          <span>Surround Sound Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Music className="w-3 h-3" />
          <span>Track {currentTrackIndex + 1}/3</span>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        loop={false}
      />
    </div>
  );
}
