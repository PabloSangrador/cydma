/**
 * @module HeroSection
 * @description Full-screen hero section for the CYDMA homepage. Features a
 * parallax background image, a cinematic clip-path + rotateX word-reveal on
 * the main heading, scroll-linked overlay darkening, and a fading scroll
 * indicator. All entry animations are triggered 300 ms after mount.
 */

import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/** Cubic-bezier easing used for the cinematic background reveal. */
const cinematicEase = [0.65, 0, 0.35, 1];
/** Smooth spring-like cubic-bezier easing used for text and button entries. */
const smoothEase = [0.16, 1, 0.3, 1];

/**
 * Main hero section component for the CYDMA homepage.
 * Uses Framer Motion's `useScroll` / `useTransform` to drive parallax and
 * overlay effects without triggering React re-renders on scroll. A delayed
 * `isLoaded` flag sequences the cinematic entry animations on mount.
 * @returns {JSX.Element} Full-screen hero section with parallax background,
 * animated heading, CTA buttons, and scroll indicator.
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll-based parallax - using useTransform only (no re-renders)
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 1000], [0, 300]);
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.05]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.65, 0.85]);
  const contentY = useTransform(scrollY, [0, 500], [0, 100]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Trigger animation sequence after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Title words for SplitText effect
  const titleWords = ["Referentes", "en", "carpintería", "industrial"];
  const subtitleWords = ["desde", "1989"];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* CSS for shimmer and scroll animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(12px); opacity: 0.3; }
        }

        .btn-shimmer {
          position: relative;
          overflow: hidden;
        }

        .btn-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }

        .btn-shimmer:hover::after {
          animation: shimmer 0.8s ease-in-out;
        }

        .scroll-dot {
          animation: scrollDot 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Image Container */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={isLoaded ? { clipPath: "inset(0% 0 0 0)" } : {}}
        transition={{ duration: 1.2, delay: 0, ease: cinematicEase }}
      >
        {/* Parallax Image */}
        <motion.img
          src="/edf-solar-autoconsumo-cydma-cyl-2.jpeg"
          alt="Almacén de carpintería industrial CYDMA - Íscar, Valladolid"
          className="absolute inset-0 w-full h-[130%] object-cover will-change-transform"
          style={{ y: imageY, scale: imageScale }}
          initial={{ scale: 1.15 }}
          animate={isLoaded ? { scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: smoothEase }}
        />

        {/* Dynamic Overlay - darkens on scroll */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.25) 65%, transparent 100%)",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="container relative z-10 py-20 md:py-0"
        style={{ y: contentY }}
      >
        <div className="max-w-3xl lg:max-w-4xl ml-0 md:ml-8 lg:ml-16">
          {/* Decorative gold line */}
          <motion.div
            className="h-px bg-accent mb-8"
            initial={{ width: 0 }}
            animate={isLoaded ? { width: 60 } : {}}
            transition={{ duration: 0.8, delay: 1.0, ease: smoothEase }}
          />

          {/* Badge - Desde 1989 with blur-in */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={isLoaded ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay: 1.2, ease: smoothEase }}
          >
            <span className="inline-block px-4 py-1.5 border border-white/20 text-white/60 text-[0.65rem] font-sans font-medium tracking-[0.3em] uppercase">
              Desde 1989
            </span>
          </motion.div>

          {/* Main Title - SplitText word by word with clip-up + rotateX */}
          <h1 className="mb-2">
            <span className="block" style={{ perspective: "1000px" }}>
              {titleWords.map((word, index) => (
                <motion.span
                  key={word}
                  className="inline-block font-serif text-[3rem] md:text-[4rem] lg:text-[5rem] text-white leading-[1.05] font-normal mr-[0.25em] overflow-hidden"
                  style={{ display: "inline-block" }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{
                      clipPath: "inset(100% 0 0 0)",
                      rotateX: -40,
                      y: 40,
                    }}
                    animate={
                      isLoaded
                        ? { clipPath: "inset(0% 0 0 0)", rotateX: 0, y: 0 }
                        : {}
                    }
                    transition={{
                      duration: 0.8,
                      delay: 1.5 + index * 0.05,
                      ease: smoothEase,
                    }}
                    style={{
                      transformOrigin: "bottom center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              ))}
            </span>
            {/* Subtitle line - italic "desde 1989" */}
            <span className="block" style={{ perspective: "1000px" }}>
              {subtitleWords.map((word, index) => (
                <motion.span
                  key={word}
                  className="inline-block font-serif text-[3rem] md:text-[4rem] lg:text-[5rem] text-white leading-[1.05] font-normal italic mr-[0.25em] overflow-hidden"
                  style={{ display: "inline-block" }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{
                      clipPath: "inset(100% 0 0 0)",
                      rotateX: -40,
                      y: 40,
                    }}
                    animate={
                      isLoaded
                        ? { clipPath: "inset(0% 0 0 0)", rotateX: 0, y: 0 }
                        : {}
                    }
                    transition={{
                      duration: 0.8,
                      delay: 1.5 + titleWords.length * 0.05 + index * 0.05,
                      ease: smoothEase,
                    }}
                    style={{
                      transformOrigin: "bottom center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Decorative line + dot */}
          <motion.div
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.0, ease: smoothEase }}
          >
            <div className="w-8 h-px bg-accent/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </motion.div>

          {/* Description paragraph - fade up */}
          <motion.p
            className="text-white/70 font-sans text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.2, ease: smoothEase }}
          >
            Más de 35 años de experiencia al servicio del profesional de la
            madera. Calidad, servicio y confianza en cada proyecto.
          </motion.p>

          {/* CTA Buttons - scale + blur from below */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            animate={
              isLoaded
                ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 0.8, delay: 2.5, ease: smoothEase }}
          >
            <Button
              asChild
              size="lg"
              className="btn-shimmer bg-accent text-accent-foreground px-8 py-6 text-sm font-sans font-medium tracking-wide uppercase hover:scale-[1.03] transition-transform duration-300 ease-out"
            >
              <Link to="/catalogo">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border border-white/30 text-white bg-transparent px-8 py-6 text-sm font-sans font-medium tracking-wide uppercase hover:bg-white/5 hover:border-white/50 transition-all duration-300"
            >
              <Link to="/contacto">Contactar</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - vertical line with animated dot */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 3.0, ease: smoothEase }}
        style={{ opacity: scrollIndicatorOpacity }}
      >
        {/* Vertical text */}
        <span
          className="text-white/40 text-[0.55rem] font-sans tracking-[0.4em] uppercase mb-4"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Scroll
        </span>

        {/* Line with animated dot */}
        <div className="relative w-px h-12 bg-white/20">
          <div className="scroll-dot absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </motion.div>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
