import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashAnimationProps {
  onComplete: () => void;
}

// Particle component for the flowing effect
function Particle({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 120 + Math.random() * 60;
  const startX = Math.cos(angle) * radius;
  const startY = Math.sin(angle) * radius;
  const size = 4 + Math.random() * 6;
  const delay = Math.random() * 0.3;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: index % 3 === 0 
          ? 'hsl(var(--primary))' 
          : index % 3 === 1 
            ? 'hsl(var(--secondary))' 
            : 'hsl(175, 55%, 55%)',
        boxShadow: '0 0 8px currentColor',
      }}
      initial={{ 
        x: startX, 
        y: startY, 
        opacity: 0,
        scale: 0.5,
      }}
      animate={{ 
        x: 0, 
        y: 0, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 0.8, 0],
      }}
      transition={{ 
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    />
  );
}

// Abstract shape that morphs into finance symbol
function MorphingShape() {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center">
      {/* Outer ring that contracts */}
      <motion.div
        className="absolute rounded-full border-2 border-primary/30"
        initial={{ width: 200, height: 200, opacity: 0 }}
        animate={{ 
          width: [200, 100, 80],
          height: [200, 100, 80],
          opacity: [0, 0.5, 0],
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {/* Inner pulsing glow */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
        initial={{ width: 120, height: 120, opacity: 0 }}
        animate={{ 
          width: [120, 60, 70],
          height: [120, 60, 70],
          opacity: [0, 0.6, 0],
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// Main Logo that appears
function LogoReveal({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Glow effect behind logo */}
          <motion.div
            className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.8, 0.4],
              scale: [0.8, 1.2, 1],
            }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          {/* Logo SVG */}
          <motion.svg
            width={88}
            height={88}
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <defs>
              <linearGradient id="splashShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(240, 55%, 50%)" />
                <stop offset="100%" stopColor="hsl(175, 55%, 45%)" />
              </linearGradient>
              <linearGradient id="splashSparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(175, 55%, 55%)" />
                <stop offset="100%" stopColor="hsl(175, 55%, 65%)" />
              </linearGradient>
              <linearGradient id="splashInnerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <filter id="splashGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Shield Base */}
            <motion.path
              d="M48 8L16 22V44C16 62.78 29.12 80.12 48 88C66.88 80.12 80 62.78 80 44V22L48 8Z"
              fill="url(#splashShieldGradient)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Shield Inner Highlight */}
            <motion.path
              d="M48 14L22 26V44C22 60.2 33.28 75.08 48 82C62.72 75.08 74 60.2 74 44V26L48 14Z"
              fill="url(#splashInnerGlow)"
              opacity="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />

            {/* Spark/Lightning Bolt */}
            <motion.g filter="url(#splashGlow)">
              <motion.path
                d="M54 28L38 52H46L42 68L58 44H50L54 28Z"
                fill="white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
              />
            </motion.g>

            {/* Decorative Spark Rays */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <circle cx="65" cy="32" r="2" fill="url(#splashSparkGradient)" />
              <circle cx="72" cy="42" r="1.5" fill="url(#splashSparkGradient)" />
              <circle cx="68" cy="52" r="1" fill="url(#splashSparkGradient)" />
            </motion.g>
          </motion.svg>

          {/* Brand Name */}
          <motion.div
            className="mt-4 flex items-baseline gap-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
          >
            <span className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FinFlip
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Tagline that fades in at the end
function Tagline({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          className="absolute bottom-[30%] text-center text-base font-medium text-muted-foreground tracking-wide px-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Money, made simple.
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [phase, setPhase] = useState<'particles' | 'logo' | 'tagline' | 'done'>('particles');
  const particleCount = 24;

  useEffect(() => {
    // Phase timings: particles (0-0.8s), logo (0.8-1.4s), tagline (1.4-2.0s)
    const logoTimer = setTimeout(() => setPhase('logo'), 800);
    const taglineTimer = setTimeout(() => setPhase('tagline'), 1400);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Center animation container */}
      <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
        {/* Particles phase */}
        {phase === 'particles' && (
          <>
            <MorphingShape />
            {Array.from({ length: particleCount }).map((_, i) => (
              <Particle key={i} index={i} total={particleCount} />
            ))}
          </>
        )}
        
        {/* Logo reveal phase */}
        <LogoReveal show={phase === 'logo' || phase === 'tagline'} />
      </div>
      
      {/* Tagline phase */}
      <Tagline show={phase === 'tagline'} />
      
      {/* Subtle pulse ring effect during logo phase */}
      {(phase === 'logo' || phase === 'tagline') && (
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-primary/20"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
}
