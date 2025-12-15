import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import type { MascotState } from '@/hooks/useMascotState';

type MascotProps = {
  state?: MascotState;
  size?: number;
};

// Framer Motion variants for each state
const mascotVariants = {
  idle: { 
    scale: 1, 
    y: [0, -4, 0], 
    rotate: 0, 
    transition: { 
      duration: 1.6,
      repeat: Infinity
    } 
  },
  thinking: { 
    scale: 0.98, 
    rotate: 2, 
    y: -4, 
    transition: { duration: 0.28 } 
  },
  happy: { 
    scale: 1.06, 
    y: -8, 
    rotate: 0, 
    transition: { type: 'spring' as const, stiffness: 300, damping: 18 } 
  },
  sad: { 
    scale: 0.98, 
    y: 2, 
    rotate: -6, 
    transition: { duration: 0.36 } 
  },
  neutral: { 
    scale: 1.0, 
    y: 0, 
    transition: { duration: 0.24 } 
  },
  celebrate: { 
    scale: 1.14, 
    y: -14, 
    rotate: 0, 
    transition: { type: 'spring' as const, stiffness: 320, damping: 20 } 
  },
  sleepy: { 
    scale: 0.9, 
    y: 6, 
    opacity: 0.9, 
    transition: { duration: 0.6 } 
  }
};

export default function Mascot({ state = 'idle', size = 200 }: MascotProps) {
  // Change the "seed" based on state to change facial expressions/poses
  const seed = useMemo(() => {
    switch(state) {
      case 'happy':
      case 'celebrate':
        return 'Leah-laughing'; // Happy face
      case 'thinking':
        return 'Leah-curious';
      case 'sad':
        return 'Leah-puzzled';
      case 'sleepy':
        return 'Leah-tired';
      case 'neutral':
      case 'idle':
      default: 
        return 'Leah'; 
    }
  }, [state]);

  const avatar = useMemo(() => {
    return createAvatar(micah, {
      seed: seed,
      radius: 50, // Rounded corners
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'], // Calm, wise colors
      size,
    }).toString();
  }, [seed, size]);

  return (
    <motion.div 
      variants={mascotVariants}
      animate={state}
      initial="idle"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatar }} 
    />
  );
}
