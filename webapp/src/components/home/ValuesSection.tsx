/**
 * @module ValuesSection
 * @description "Por qué elegirnos" section for the CYDMA homepage. Displays
 * four company values in an animated card grid alongside a scroll-linked
 * color-reveal title and a large animated counter showing years of experience.
 * A parallax "desde 1989" watermark decorates the dark background.
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";
import { Counter } from "@/components/motion";

/** Smooth spring-like cubic-bezier easing used across entry animations. */
const smoothEase = [0.16, 1, 0.3, 1];

const values = [
  {
    number: "01",
    title: "Calidad Premium",
    description:
      "Seleccionamos solo los mejores materiales y fabricantes para garantizar resultados excepcionales.",
  },
  {
    number: "02",
    title: "Servicio Integral",
    description:
      "Desde el asesoramiento hasta la entrega, te acompañamos en cada paso del proyecto.",
  },
  {
    number: "03",
    title: "Stock Permanente",
    description:
      "Más de 5.000 referencias disponibles en almacén para entregas en 24-72h.",
  },
  {
    number: "04",
    title: "Experiencia",
    description:
      "Décadas trabajando con profesionales de la madera nos avalan como referentes del sector.",
  },
];

/**
 * Directional clip-path entry animations applied to each value card.
 * Each card enters from a different edge to create visual variety.
 */
const clipAnimations = [
  { initial: { clipPath: "inset(100% 0 0 0)" }, animate: { clipPath: "inset(0% 0 0 0)" } }, // from bottom
  { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" } }, // from right
  { initial: { clipPath: "inset(0 0 0 100%)" }, animate: { clipPath: "inset(0 0 0 0%)" } }, // from left
  { initial: { clipPath: "inset(0 0 100% 0)" }, animate: { clipPath: "inset(0 0 0% 0)" } }, // from top
];

/**
 * A single word in the scroll-linked "Por qué elegirnos" title.
 * Its opacity and color transition from muted grey to CYDMA's accent gold
 * as the section scrolls into the viewport.
 * @param {{ word: string; scrollYProgress: MotionValue<number>; index: number }} props
 * @param {string} props.word - The word string to render.
 * @param {MotionValue<number>} props.scrollYProgress - Normalised scroll progress
 *   (0–1) through the parent section, used to drive the color reveal.
 * @param {number} props.index - Position of this word in the title array,
 *   used to stagger the reveal timing.
 * @returns {JSX.Element} An inline motion span whose color animates with scroll.
 */
function AnimatedWord({
  word,
  scrollYProgress,
  index,
}: {
  word: string;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const wordProgress = useTransform(
    scrollYProgress,
    [0.1 + index * 0.15, 0.3 + index * 0.15],
    [0.3, 1]
  );

  const wordColor = useTransform(
    wordProgress,
    [0.3, 1],
    ["rgb(107, 114, 128)", "rgb(184, 135, 78)"]
  );

  return (
    <motion.span
      className="inline-block mr-[0.3em]"
      style={{
        opacity: wordProgress,
        color: wordColor,
      }}
    >
      {word}
    </motion.span>
  );
}

/**
 * Words used in the animated section heading, split so each word can be
 * revealed individually as the user scrolls into the section.
 */
const titleWords = ["Por", "qué", "elegirnos"];

/**
 * "Por qué elegirnos" section of the CYDMA homepage.
 * Left column contains a scroll-driven colour-reveal heading, a supporting
 * paragraph, and a large animated "+35" years counter. The right column
 * holds four value cards that enter with directional clip-path animations
 * when scrolled into view.
 * @returns {JSX.Element} The full values section with parallax background text
 * and animated content grid.
 */
export default function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

  // Scroll progress for text reveal effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Parallax for the large background text
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.08, 0.04]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary text-primary-foreground overflow-hidden"
    >
      {/* Large parallax background text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ y: parallaxY, opacity: parallaxOpacity }}
      >
        <span
          className="font-serif text-[20vw] lg:text-[25vw] text-white whitespace-nowrap"
          style={{ fontWeight: 400 }}
        >
          desde 1989
        </span>
      </motion.div>

      {/* Diagonal separator at top */}
      <div
        className="absolute top-0 left-0 right-0 h-24 bg-background"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)",
        }}
      />

      {/* Content */}
      <div ref={contentRef} className="container relative z-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Side - Title and Main Stat */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            {/* Animated Title with scroll-linked color reveal */}
            <div className="mb-8">
              <motion.div
                className="h-px bg-accent mb-8"
                initial={{ width: 0 }}
                animate={isInView ? { width: 60 } : {}}
                transition={{ duration: 0.8, ease: smoothEase }}
              />

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                {titleWords.map((word, index) => (
                  <AnimatedWord
                    key={word}
                    word={word}
                    scrollYProgress={scrollYProgress}
                    index={index}
                  />
                ))}
              </h2>

              <motion.p
                className="text-white/60 font-sans text-base lg:text-lg leading-relaxed max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: smoothEase }}
              >
                Más de tres décadas de compromiso con la excelencia nos
                posicionan como el socio de confianza para profesionales de la
                madera en toda España.
              </motion.p>
            </div>

            {/* Main Stat - Large Animated Counter */}
            <motion.div
              className="mt-12 lg:mt-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-7xl md:text-8xl lg:text-9xl text-accent font-normal tabular-nums">
                  <Counter
                    from={0}
                    to={35}
                    duration={2.5}
                    prefix="+"
                    suffix=""
                    threshold={0.3}
                  />
                </span>
              </div>
              <p className="text-white/40 text-sm font-sans tracking-widest uppercase mt-2">
                Años de experiencia
              </p>
            </motion.div>

            {/* Decorative element */}
            <motion.div
              className="hidden lg:flex items-center gap-3 mt-16"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.8, ease: smoothEase }}
            >
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="w-12 h-px bg-white/20" />
              <span className="text-white/30 text-xs font-sans tracking-widest uppercase">
                Nuestros valores
              </span>
            </motion.div>
          </div>

          {/* Right Side - Values Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {values.map((value, index) => {
                const clipAnim = clipAnimations[index];

                return (
                  <motion.div
                    key={value.number}
                    className="group relative bg-white/[0.03] backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/[0.06] hover:border-accent/30 transition-colors duration-500"
                    initial={clipAnim.initial}
                    animate={isInView ? clipAnim.animate : {}}
                    transition={{
                      duration: 1,
                      delay: 0.2 + index * 0.15,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                  >
                    {/* Decorative number */}
                    <span
                      className="absolute top-4 right-4 text-5xl lg:text-6xl font-serif font-bold leading-none select-none transition-colors duration-500"
                      style={{
                        WebkitTextStroke: "1px rgba(184, 135, 78, 0.2)",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {value.number}
                    </span>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="font-serif text-xl lg:text-2xl text-white font-normal mb-3 group-hover:text-accent transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-white/50 font-sans text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                        {value.description}
                      </p>
                    </div>

                    {/* Hover accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom quote */}
            <motion.div
              className="mt-12 lg:mt-16 text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1, ease: smoothEase }}
            >
              <blockquote className="font-serif text-lg lg:text-xl text-white/60 italic leading-relaxed">
                &ldquo;La confianza de más de 500 profesionales avala nuestro
                compromiso con la calidad.&rdquo;
              </blockquote>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
