import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeScreenProps {
  onPersonaSelect: (personaId: string) => void;
}

export function WelcomeScreen({ onPersonaSelect }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        key="welcome"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center max-w-md mx-auto"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-3xl">💰</span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-3"
        >
          Welcome to FinFlip
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-xl text-primary font-medium mb-2"
        >
          Money Management Made Effortless.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground mb-12"
        >
          Financial literacy is a habit, not a hurdle.
        </motion.p>

        {/* Persona Selection Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground mb-4">I am a...</p>
          
          <button
            onClick={() => onPersonaSelect('priya')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all duration-200 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👩🏽‍🎓</span>
            <span>I am a Student</span>
          </button>

          <button
            onClick={() => onPersonaSelect('arjun')}
            className="w-full py-4 px-6 rounded-2xl border-2 border-primary bg-background text-foreground font-semibold text-lg transition-all duration-200 hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👨🏽‍💼</span>
            <span>I am a Professional</span>
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          Secure • Private • Made for India 🇮🇳
        </motion.p>
      </motion.div>
    </div>
  );
}
