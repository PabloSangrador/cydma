/**
 * @module Counter
 * @description Animated number counter component for the CYDMA website.
 * Displays a numeric value that counts up from a starting number to a target
 * value when the element enters the viewport. Supports locale-aware formatting,
 * optional prefix/suffix strings, and configurable decimal precision.
 */

import { useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Props for the {@link Counter} component.
 * @interface CounterProps
 */
interface CounterProps {
  /** The number the counter starts from. Defaults to `0`. */
  from?: number;
  /** The target number the counter animates to. Required. */
  to: number;
  /** Duration of the count animation in seconds. Defaults to `2`. */
  duration?: number;
  /** Text prepended to the formatted number (e.g. `"+"` or `"€"`). Defaults to `""`. */
  prefix?: string;
  /** Text appended to the formatted number (e.g. `"%"` or `" años"`). Defaults to `""`. */
  suffix?: string;
  /** Additional Tailwind/CSS class names applied to the `<span>` element. */
  className?: string;
  /** Fraction of the element that must be visible to start the animation (0–1). Defaults to `0.2`. */
  threshold?: number;
  /** When `true` the animation only plays once; when `false` it replays on re-entry. Defaults to `true`. */
  once?: boolean;
  /** Number of decimal places to display. Defaults to `0` (integer). */
  decimals?: number;
  /** BCP 47 locale string used for `toLocaleString` number formatting. Defaults to `"es-ES"`. */
  locale?: string;
}

/**
 * Renders an animated counter that counts from `from` to `to` when it enters
 * the viewport. The number is formatted according to the specified `locale` and
 * `decimals`, and can be wrapped with an optional `prefix` and `suffix`.
 *
 * @description Useful for showcasing key business figures on the CYDMA homepage
 * or landing sections (e.g. "+500 clientes", "30 años de experiencia").
 *
 * @param {CounterProps} props - Component configuration.
 * @returns {JSX.Element} A `<motion.span>` displaying the animated numeric value.
 *
 * @example
 * <Counter from={0} to={500} duration={2} prefix="+" suffix=" clientes" />
 */
export function Counter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  threshold = 0.2,
  once = true,
  decimals = 0,
  locale = "es-ES",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const motionValue = useMotionValue(from);

  const rounded = useTransform(motionValue, (latest) => {
    const formatted = decimals > 0
      ? latest.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(latest).toLocaleString(locale);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [isInView, motionValue, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
