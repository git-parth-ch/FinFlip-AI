import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

const colors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  '#FFD700',
  '#FF6B6B',
  '#4ECDC4',
];

export function Confetti({ isActive, onComplete }: { isActive: boolean; onComplete?: () => void }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                x: `${piece.x}vw`, 
                y: -20, 
                rotate: 0,
                scale: piece.scale,
                opacity: 1 
              }}
              animate={{ 
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.8, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'easeIn'
              }}
              className="absolute w-3 h-3"
              style={{ 
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export function CelebrationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  xpEarned,
  badge 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  message: string;
  xpEarned?: number;
  badge?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Confetti isActive={isOpen} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-6"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
              >
                <span className="text-4xl">{badge || '🎉'}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold font-display text-foreground mb-2"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-4"
              >
                {message}
              </motion.p>

              {xpEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent font-bold mb-6"
                >
                  <span>+{xpEarned} XP</span>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    ⭐
                  </motion.span>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-gradient-primary text-white font-semibold"
              >
                Awesome! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Micro-interaction button wrapper
export function InteractiveButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'default'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'success' | 'accent';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Pulse animation for important elements
export function PulseWrapper({ 
  children, 
  isActive = true 
}: { 
  children: React.ReactNode; 
  isActive?: boolean;
}) {
  return (
    <motion.div
      animate={isActive ? { 
        scale: [1, 1.02, 1],
        boxShadow: [
          '0 0 0 0 rgba(var(--primary), 0)',
          '0 0 0 8px rgba(var(--primary), 0.1)',
          '0 0 0 0 rgba(var(--primary), 0)'
        ]
      } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {children}
    </motion.div>
  );
}
