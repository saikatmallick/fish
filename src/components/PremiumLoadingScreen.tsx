import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface PremiumLoadingScreenProps {
  onComplete: () => void;
}

export default function PremiumLoadingScreen({ onComplete }: PremiumLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalTime = 16;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Wait briefly at 100% for a smooth, premium exit feel
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }
        // Organic premium deceleration steps
        const remaining = 100 - prev;
        const incrementalStep = Math.max(0.6, remaining * 0.05);
        return Math.min(100, prev + incrementalStep);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // SVG parameters for a fine, luxury high-performance outline circle
  const radius = 54;
  const strokeWidth = 1.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#010e24] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background High Quality Video aligned exactly like Hero Section */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none scale-110"
        >
          <source
            src="https://res.cloudinary.com/dws1zhit2/video/upload/v1779692746/Underwater_environment_luxury_oc__202605251150_gruafj.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft elegant overlay to bring premium depth and high-contrast focus */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
      </div>

      {/* Pristine Minimal Center Area */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Glowing luxury micro-progress ring */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Fine track background circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-white/10 fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Glowing active animated progression stroke */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-brand-primary fill-none transition-all duration-75"
              strokeWidth={strokeWidth + 1}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 6px rgba(0, 209, 255, 0.75))",
              }}
            />
          </svg>

          {/* Centered minimalist numerical display */}
          <div className="flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] font-medium mb-0.5">LAUNCHING</span>
            <div className="flex items-baseline justify-center">
              <span className="font-display text-2xl font-bold text-white tracking-tighter tabular-nums">
                {Math.round(progress)}
              </span>
              <span className="font-mono text-[10px] text-brand-primary font-bold ml-0.5">%</span>
            </div>
          </div>
        </div>

        {/* Elegant, single, low-key pulsating state message to confirm active load */}
        <div className="mt-4">
          <motion.p 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="font-mono text-[9px] text-white/70 tracking-[0.3em] font-medium uppercase"
          >
            Entering Sanctuary
          </motion.p>
        </div>
      </div>
    </div>
  );
}
