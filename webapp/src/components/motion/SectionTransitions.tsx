import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionTransitionProps {
  variant: "dark-to-light" | "light-to-dark" | "golden-line" | "diagonal";
  className?: string;
}

export function SectionTransition({
  variant,
  className = "",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shimmerX = useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]);

  if (variant === "dark-to-light") {
    return (
      <div
        ref={ref}
        className={`relative h-32 -mt-16 pointer-events-none ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      </div>
    );
  }

  if (variant === "light-to-dark") {
    return (
      <div
        ref={ref}
        className={`relative h-32 -mb-16 pointer-events-none ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary" />
      </div>
    );
  }

  if (variant === "golden-line") {
    return (
      <div
        ref={ref}
        className={`relative h-px overflow-hidden ${className}`}
      >
        {/* Base line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 w-1/3"
          style={{
            x: shimmerX,
            background:
              "linear-gradient(90deg, transparent, rgba(184, 135, 78, 0.6), transparent)",
          }}
        />
      </div>
    );
  }

  if (variant === "diagonal") {
    return (
      <div
        ref={ref}
        className={`relative h-24 overflow-hidden pointer-events-none ${className}`}
      >
        <svg
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          className="absolute w-full h-full"
        >
          <path
            d="M0,0 L1440,96 L1440,96 L0,96 Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    );
  }

  return null;
}

// Hero to Values transition - fade from image to dark
export function HeroToValuesTransition() {
  return (
    <div className="relative h-24 -mt-24 pointer-events-none z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary" />
    </div>
  );
}

// Values to Categories transition - golden separator
export function ValuesToCategoriesTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shimmerX = useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div ref={ref} className="relative py-12 bg-primary">
      <div className="container">
        <div className="relative h-px overflow-hidden">
          {/* Base line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-y-0 w-1/4"
            style={{
              x: shimmerX,
              opacity,
              background:
                "linear-gradient(90deg, transparent, rgba(184, 135, 78, 0.8), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Categories to Business Lines - elegant fade
export function CategoriesToBusinessTransition() {
  return (
    <div className="relative h-32 -mt-16 -mb-16 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-primary/90 to-primary" />
    </div>
  );
}

// Business Lines to CTA - subtle dark gradient
export function BusinessToCTATransition() {
  return (
    <div className="relative h-24 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
    </div>
  );
}
