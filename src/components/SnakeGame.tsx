import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, Point } from '../types';
import { cn } from '../lib/utils';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Point = { x: 1, y: 0 };
const TICK_RATE = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus(GameStatus.PLAYING);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision Check
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Check
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(interval);
  }, [direction, food, status, generateFood, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffcc';
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = isHead ? '#ff00ff' : '#aa00aa';
      ctx.fillStyle = isHead ? '#ff00ff' : '#770077';
      
      const x = segment.x * size + 2;
      const y = segment.y * size + 2;
      const r = size - 4;
      
      // Rounded rectangles for segments
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + r - radius, y);
      ctx.quadraticCurveTo(x + r, y, x + r, y + radius);
      ctx.lineTo(x + r, y + r - radius);
      ctx.quadraticCurveTo(x + r, y + r, x + r - radius, y + r);
      ctx.lineTo(x + radius, y + r);
      ctx.quadraticCurveTo(x, y + r, x, y + r - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="flex justify-between w-full px-4 items-center">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Current Score</span>
          <span className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-500 to-cyan-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High Score
          </span>
          <span className="text-2xl font-mono font-bold text-white/60">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-magenta-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-[#050505] rounded-xl border border-white/5 cursor-crosshair"
        />

        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="text-center p-8 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <h2 className={cn(
                    "text-5xl font-display uppercase tracking-widest italic",
                    status === GameStatus.GAME_OVER ? "text-red-500" : "text-cyan-400"
                  )}>
                    {status === GameStatus.GAME_OVER ? "System Crush" : "Neural Link"}
                  </h2>
                  <p className="text-white/40 font-mono text-sm">
                    {status === GameStatus.GAME_OVER ? `Points Harvested: ${score}` : "Ready to synchronize?"}
                  </p>
                </motion.div>

                <button
                  onClick={resetGame}
                  className="group relative px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    {status === GameStatus.GAME_OVER ? (
                      <><RefreshCcw className="w-4 h-4" /> Reboot</>
                    ) : (
                      <><Play className="w-4 h-4" /> Initialize</>
                    )}
                  </span>
                </button>
                
                <p className="text-[10px] uppercase tracking-widest text-white/20 mt-4">Use Arrow Keys to Navigate</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
