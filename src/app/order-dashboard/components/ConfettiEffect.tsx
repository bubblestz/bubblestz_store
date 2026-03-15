'use client';

import { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    const fireConfetti = async () => {
      try {
        // Dynamically import canvas-confetti
        const confetti = (await import('canvas-confetti')).default;

        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6ee7b7', '#818cf8', '#fbbf24', '#fb923c', '#4ade80'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#6ee7b7', '#818cf8', '#fbbf24', '#fb923c', '#4ade80'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          } else {
            onComplete?.();
            firedRef.current = false;
          }
        };

        frame();
      } catch (err) {
        console.error('Confetti failed to load:', err);
        onComplete?.();
        firedRef.current = false;
      }
    };

    fireConfetti();
  }, [trigger]);

  return null;
}
