/**
 * @module ScrollReveal
 * @description Scroll-triggered reveal animation components for the CYDMA website.
 * Provides `ScrollReveal` for individual element animations, `StaggerContainer`
 * for orchestrating staggered child animations, and `StaggerItem` as the child
 * unit within a stagger sequence. All components use Framer Motion and activate
 * when the element enters the viewport.
 */

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Union of supported animation variant names.
 * - `"fade-up"` — fades in while rising from below
 * - `"fade-left"` — fades in while sliding from the left
 * - `"fade-right"` — fades in while sliding from the right
 * - `"scale"` — fades in while scaling up from 85%
 * - `"blur"` — fades in while removing a blur filter
 * - `"clip-up"` — reveals via a clip-path wipe from bottom to top
 * - `"clip-left"` — reveals via a clip-path wipe from right to left
 */
type VariantType =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur"
  | "clip-up"
  | "clip-left";

/**
 * Props for the {@link ScrollReveal} component.
 * @interface ScrollRevealProps
 */
interface ScrollRevealProps {
  /** Content to animate when it enters the viewport. */
  children: ReactNode;
  /** Animation style to apply. Defaults to `"fade-up"`. */
  variant?: VariantType;
  /** Seconds to wait before the animation starts after the element enters view. Defaults to `0`. */
  delay?: number;
  /** Duration of the animation in seconds. Defaults to `0.8`. */
  duration?: number;
  /** Additional Tailwind/CSS class names applied to the wrapper div. */
  className?: string;
  /** Fraction of the element that must be visible before the animation triggers (0–1). Defaults to `0.2`. */
  threshold?: number;
  /** When `true` the animation only plays once; when `false` it replays on re-entry. Defaults to `true`. */
  once?: boolean;
}

/** Custom spring-like cubic-bezier easing curve used across all motion components. */
const customEase = [0.16, 1, 0.3, 1] as const;

/**
 * Returns the Framer Motion `hidden` and `visible` variant objects for a given animation style.
 * @param {VariantType} variant - The animation variant to look up.
 * @returns {{ hidden: object, visible: object }} Framer Motion variant definitions.
 */
const getVariantStyles = (variant: VariantType) => {
  const styles = {
    "fade-up": {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    "fade-left": {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 },
    },
    "fade-right": {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(20px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
    "clip-up": {
      hidden: { clipPath: "inset(100% 0% 0% 0%)" },
      visible: { clipPath: "inset(0% 0% 0% 0%)" },
    },
    "clip-left": {
      hidden: { clipPath: "inset(0% 100% 0% 0%)" },
      visible: { clipPath: "inset(0% 0% 0% 0%)" },
    },
  };
  return styles[variant];
};

/**
 * Wraps its children in a Framer Motion `div` that animates into view when the
 * element scrolls past the viewport threshold.
 *
 * @description Use this component to add entrance animations to any section or
 * element on the CYDMA pages (e.g. product cards, section headings).
 *
 * @param {ScrollRevealProps} props - Component configuration.
 * @returns {JSX.Element} An animated wrapper div.
 *
 * @example
 * <ScrollReveal variant="fade-up" delay={0.2}>
 *   <h2>Nuestros productos</h2>
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
  threshold = 0.2,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const styles = getVariantStyles(variant);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={styles.hidden}
      animate={isInView ? styles.visible : styles.hidden}
      transition={{
        duration,
        delay,
        ease: customEase,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Props for the {@link StaggerContainer} component.
 * @interface StaggerContainerProps
 */
interface StaggerContainerProps {
  /** Child elements, typically a list of {@link StaggerItem} components. */
  children: ReactNode;
  /** Seconds between each child's animation start. Defaults to `0.1`. */
  stagger?: number;
  /** Seconds to wait before the first child begins animating. Defaults to `0`. */
  delay?: number;
  /** Additional Tailwind/CSS class names applied to the wrapper div. */
  className?: string;
  /** Fraction of the container that must be visible to trigger the stagger sequence (0–1). Defaults to `0.2`. */
  threshold?: number;
  /** When `true` the sequence only plays once; when `false` it replays on re-entry. Defaults to `true`. */
  once?: boolean;
}

/**
 * A Framer Motion container that coordinates staggered entrance animations for
 * its `StaggerItem` children when it scrolls into view.
 *
 * @description Pair with {@link StaggerItem} to animate lists of product cards,
 * feature highlights, or any repeating UI pattern on CYDMA pages.
 *
 * @param {StaggerContainerProps} props - Component configuration.
 * @returns {JSX.Element} An animated container div.
 *
 * @example
 * <StaggerContainer stagger={0.1} delay={0.2}>
 *   {products.map(p => (
 *     <StaggerItem key={p.id}>
 *       <ProductCard product={p} />
 *     </StaggerItem>
 *   ))}
 * </StaggerContainer>
 */
export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className = "",
  threshold = 0.2,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        staggerChildren: stagger,
        delayChildren: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Props for the {@link StaggerItem} component.
 * @interface StaggerItemProps
 */
interface StaggerItemProps {
  /** Content to reveal as part of the parent stagger sequence. */
  children: ReactNode;
  /** Animation style to apply. Defaults to `"fade-up"`. */
  variant?: VariantType;
  /** Duration of this item's animation in seconds. Defaults to `0.8`. */
  duration?: number;
  /** Additional Tailwind/CSS class names applied to the item div. */
  className?: string;
}

/**
 * A single animated child unit intended to be used inside a {@link StaggerContainer}.
 * It inherits the `"hidden"` / `"visible"` variant orchestration from its parent
 * and animates according to the specified `variant`.
 *
 * @description Must be a direct child of `StaggerContainer` for the stagger
 * timing to work correctly.
 *
 * @param {StaggerItemProps} props - Component configuration.
 * @returns {JSX.Element} An animated item div driven by its parent's variant state.
 */
export function StaggerItem({
  children,
  variant = "fade-up",
  duration = 0.8,
  className = "",
}: StaggerItemProps) {
  const styles = getVariantStyles(variant);

  return (
    <motion.div
      className={className}
      variants={{
        hidden: styles.hidden,
        visible: {
          ...styles.visible,
          transition: {
            duration,
            ease: customEase,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
