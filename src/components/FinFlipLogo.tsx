import { motion } from 'framer-motion';

interface FinFlipLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animate?: boolean;
}

const sizeMap = {
  sm: { logo: 40, text: 'text-lg' },
  md: { logo: 56, text: 'text-xl' },
  lg: { logo: 72, text: 'text-2xl' },
  xl: { logo: 96, text: 'text-3xl' },
};

export function FinFlipLogo({ size = 'md', showTagline = false, animate = true }: FinFlipLogoProps) {
  const { logo: logoSize, text: textSize } = sizeMap[size];

  const LogoSvg = (
    <svg
      width={logoSize}
      height={logoSize}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(240, 55%, 50%)" />
          <stop offset="100%" stopColor="hsl(175, 55%, 45%)" />
        </linearGradient>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(175, 55%, 55%)" />
          <stop offset="100%" stopColor="hsl(175, 55%, 65%)" />
        </linearGradient>
        <linearGradient id="innerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shield Base */}
      <path
        d="M48 8L16 22V44C16 62.78 29.12 80.12 48 88C66.88 80.12 80 62.78 80 44V22L48 8Z"
        fill="url(#shieldGradient)"
        className="drop-shadow-md"
      />

      {/* Shield Inner Highlight */}
      <path
        d="M48 14L22 26V44C22 60.2 33.28 75.08 48 82C62.72 75.08 74 60.2 74 44V26L48 14Z"
        fill="url(#innerGlow)"
        opacity="0.5"
      />

      {/* Spark/Lightning Bolt - Intelligence Symbol */}
      <g filter="url(#glow)">
        <path
          d="M54 28L38 52H46L42 68L58 44H50L54 28Z"
          fill="white"
          className="drop-shadow-lg"
        />
      </g>

      {/* Decorative Spark Rays */}
      <g opacity="0.8">
        <circle cx="65" cy="32" r="2" fill="url(#sparkGradient)" />
        <circle cx="72" cy="42" r="1.5" fill="url(#sparkGradient)" />
        <circle cx="68" cy="52" r="1" fill="url(#sparkGradient)" />
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {animate ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.1 
          }}
          whileHover={{ scale: 1.05 }}
        >
          {LogoSvg}
        </motion.div>
      ) : (
        LogoSvg
      )}

      {/* Brand Name */}
      <motion.div
        initial={animate ? { opacity: 0, y: 10 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-baseline gap-1"
      >
        <span className={`font-display font-bold ${textSize} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          FinFlip
        </span>
      </motion.div>

      {/* Tagline */}
      {showTagline && (
        <motion.p
          initial={animate ? { opacity: 0, y: 8 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-sm text-muted-foreground font-medium tracking-wide text-center max-w-[240px]"
        >
          Your Money, Your Rules. Simplified.
        </motion.p>
      )}
    </div>
  );
}
