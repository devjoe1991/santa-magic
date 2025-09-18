'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisLoadingProps {
  className?: string;
}

const loadingMessages = [
  "🎅 Santa's elves are analysing your scene...",
  "✨ Checking for perfect Santa landing spots...",
  "🎄 Evaluating Christmas magic potential...",
  "🔍 Examining doorway dimensions...",
  "💫 Calculating optimal present placement...",
  "🎁 Assessing scene for maximum holiday joy...",
  "🦌 Rudolph is studying the flight path...",
  "⭐ Sprinkling magical Christmas stardust...",
  "🎬 Preparing your personalized Santa video..."
];

export default function AnalysisLoading({ className }: AnalysisLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Cycle through loading messages
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cream via-white to-frostBlue/10 border-[6px] border-christmasRed rounded-3xl shadow-[12px_12px_0_rgba(255,0,64,0.2)] relative overflow-hidden',
      className
    )}>
      {/* Christmas Corner Decorations */}
      <div className="absolute -top-4 -left-4 text-4xl animate-float z-10">🎅</div>
      <div className="absolute -top-4 -right-4 text-4xl animate-float delay-500 z-10">🎄</div>
      <div className="absolute -bottom-4 -left-4 text-4xl animate-float delay-700 z-10">🎁</div>
      <div className="absolute -bottom-4 -right-4 text-4xl animate-float delay-300 z-10">⭐</div>

      {/* Santa Sleigh Animation */}
      <div className="relative w-full h-32 mb-6">
        {/* Sky Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-600 rounded-3xl overflow-hidden">
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>

        {/* Santa Sleigh - Moves across screen */}
        <div className="absolute top-1/2 -translate-y-1/2 animate-santa-slide">
          <span className="text-6xl">🎅🦌🦌🦌</span>
        </div>

        {/* Message */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white font-heading text-xl font-bold animate-pulse">
            ELVES ARE WORKING THEIR MAGIC...
          </p>
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center mb-6">
        <h3 className="text-3xl font-heading font-bold text-christmasRed mb-4">
          🔍 Analysing Your Scene
        </h3>
        <p className="text-xl font-body text-charcoal font-medium">
          {loadingMessages[messageIndex]}{dots}
        </p>
      </div>

      {/* Spinning Gift Boxes */}
      <div className="flex justify-center items-center gap-4 mb-6">
        {['🎁', '🎄', '🎅'].map((emoji, i) => (
          <div
            key={i}
            className="text-6xl animate-spin"
            style={{
              animationDuration: `${2 + i}s`,
              animationDirection: i % 2 ? 'reverse' : 'normal'
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Progress Bar - Candy Cane Style */}
      <div className="w-full max-w-md">
        <div className="relative w-full h-8 bg-white rounded-full border-4 border-christmasRed overflow-hidden">
          <div className="absolute inset-0 flex">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full"
                style={{
                  background: i % 2 ? '#FF0040' : '#FFFFFF',
                  transform: `skewX(-20deg)`,
                }}
              />
            ))}
          </div>

          {/* Animated Fill */}
          <div className="absolute inset-0 bg-gradient-to-r from-electricGreen to-warmGold animate-pulse"
               style={{ width: '60%' }} />
        </div>

        {/* Status Text */}
        <p className="text-center text-lg text-charcoal/70 font-body font-medium mt-4">
          🎬 Creating perfect Santa scenarios for your scene
        </p>
      </div>

      {/* Festive Elements - Bouncing */}
      <div className="flex items-center justify-center space-x-6 mt-8 text-4xl">
        <span className="animate-bounce delay-100">🎄</span>
        <span className="animate-bounce delay-300">⭐</span>
        <span className="animate-bounce delay-500">🎁</span>
        <span className="animate-bounce delay-700">❄️</span>
        <span className="animate-bounce delay-900">🔔</span>
      </div>
    </div>
  );
}