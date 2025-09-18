"use client";

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  character: string;
}

interface AnimatedSnowProps {
  count?: number;
  className?: string;
}

export default function AnimatedSnow({ count = 50, className = "" }: AnimatedSnowProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const snowChars = ['❄', '❅', '❆', '✦', '✧', '✩'];

    const generateSnowflakes = (): Snowflake[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 0.8 + 0.3, // 0.3 to 1.1
        duration: Math.random() * 20 + 10, // 10 to 30 seconds
        delay: Math.random() * 10, // 0 to 10 seconds delay
        character: snowChars[Math.floor(Math.random() * snowChars.length)]
      }));
    };

    setSnowflakes(generateSnowflakes());
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute text-white/40"
          style={{
            left: `${flake.x}%`,
            fontSize: `${flake.size}rem`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            filter: `blur(${Math.random() * 0.5}px)`,
          }}
        >
          {flake.character}
        </div>
      ))}
    </div>
  );
}

// Subtle Snow Component for sections
export function SubtleSnow({ density = 'light' }: { density?: 'light' | 'medium' | 'heavy' }) {
  const counts = {
    light: 15,
    medium: 30,
    heavy: 50
  };

  return (
    <AnimatedSnow
      count={counts[density]}
      className="opacity-30"
    />
  );
}

// Christmas Confetti Component
export function ChristmasConfetti({ active = false }: { active: boolean }) {
  const [confetti, setConfetti] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!active) {
      setConfetti([]);
      return;
    }

    const confettiChars = ['🎁', '🎄', '⭐', '🔔', '🎅', '🤶', '🦌'];

    const generateConfetti = (): Snowflake[] => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
        duration: Math.random() * 3 + 2, // 2 to 5 seconds
        delay: Math.random() * 1, // 0 to 1 second delay
        character: confettiChars[Math.floor(Math.random() * confettiChars.length)]
      }));
    };

    setConfetti(generateConfetti());

    // Clear confetti after animation
    const timeout = setTimeout(() => {
      setConfetti([]);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [active]);

  if (!active || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            fontSize: `${piece.size}rem`,
            animation: `snowfall ${piece.duration}s linear forwards`,
            animationDelay: `${piece.delay}s`,
            transform: 'translateY(-100vh)',
          }}
        >
          {piece.character}
        </div>
      ))}
    </div>
  );
}