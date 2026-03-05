/**
 * @module SplitText
 * @description Animated text reveal component for the CYDMA website.
 * Splits a string into individual words or characters and animates each unit
 * into view with a staggered 3D flip effect when the element enters the viewport.
 * Renders the result inside a configurable HTML heading or inline element.
 */

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode, createElement } from "react";

/**
 * HTML tag names that `SplitText` can render as its root element.
 */
type ElementTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

/**
 * Controls how the text string is divided before animating.
 * - `"words"` — splits on spaces; each word animates as one unit.
 * - `"chars"` — splits on every character; each character animates individually.
 */
type SplitBy = "words" | "chars";

/**
 * Props for the {@link SplitText} component.
 * @interface SplitTextProps
 */
interface SplitTextProps {
  /** The plain text string to split and animate. Must be a string, not JSX. */
  children: string;
  /** HTML tag used to wrap the entire animated text block. Defaults to `"p"`. */
  as?: ElementTag;
  /** Whether to split by words or individual characters. Defaults to `"words"`. */
  splitBy?: SplitBy;
  /** Seconds between each word/character animation start. Auto-defaults: `0.04` for words, `0.02` for chars. */
  stagger?: number;
  /** Seconds to wait before the first unit starts animating. Defaults to `0`. */
  delay?: number;
  /** Duration of each unit's animation in seconds. Defaults to `0.6`. */
  duration?: number;
  /** Additional Tailwind/CSS class names applied to the root element. */
  className?: string;
  /** Fraction of the element visible before animations begin (0–1). Defaults to `0.2`. */
  threshold?: number;
  /** When `true` the animation only plays once; when `false` it replays on re-entry. Defaults to `true`. */
  once?: boolean;
}

/** Custom spring-like cubic-bezier easing curve shared with other motion components. */
const customEase = [0.16, 1, 0.3, 1] as const;

/**
 * Framer Motion variant definitions for each animated text unit.
 * The hidden state collapses opacity, shifts the unit down, and rotates it on the X axis.
 */
const charVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -40 },
  visible: { opacity: 1, y: 0, rotateX: 0 },
};

/**
 * Renders a text string split into animated word or character units that flip
 * into view with a staggered 3D reveal when the element enters the viewport.
 *
 * @description Ideal for high-impact headings on CYDMA pages — e.g. hero titles
 * or section headings — where a sequential character or word reveal adds energy.
 *
 * @param {SplitTextProps} props - Component configuration.
 * @returns {JSX.Element} A native HTML element (determined by `as`) containing
 *   a `<motion.span>` wrapper with individual animated `<motion.span>` units inside.
 *
 * @example
 * <SplitText as="h1" splitBy="words" delay={0.1}>
 *   Carpintería industrial de calidad
 * </SplitText>
 */
export function SplitText({
  children,
  as = "p",
  splitBy = "words",
  stagger,
  delay = 0,
  duration = 0.6,
  className = "",
  threshold = 0.2,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const defaultStagger = splitBy === "words" ? 0.04 : 0.02;
  const actualStagger = stagger ?? defaultStagger;

  const items = splitBy === "words"
    ? children.split(" ")
    : children.split("");

  const content = (
    <motion.span
      ref={ref}
      className="inline-block"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        staggerChildren: actualStagger,
        delayChildren: delay,
      }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
          variants={{
            hidden: charVariants.hidden,
            visible: {
              ...charVariants.visible,
              transition: {
                duration,
                ease: customEase,
              },
            },
          }}
        >
          {item}
          {splitBy === "words" && i < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );

  return createElement(as, { className }, content);
}
