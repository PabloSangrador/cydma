/**
 * @module CTASection
 * @description Final call-to-action section for the CYDMA homepage. Features
 * a 3D-tilt card with a cursor-tracked radial light effect, a shimmer CTA
 * button, ambient glow, and contact details. The card animates in with a
 * scale + blur reveal when scrolled into view.
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/** Smooth spring-like cubic-bezier easing used across all entry animations. */
const smoothEase = [0.16, 1, 0.3, 1];

/**
 * Final CTA section for the CYDMA homepage.
 * Renders a centred 3D-tilt card over the dark primary background.
 * Mouse movement updates spring-animated `rotateX`/`rotateY` values to tilt
 * the card, and drives a radial gradient spotlight that follows the cursor.
 * On scroll-in, the card reveals with a scale + blur animation. Includes a
 * shimmer-animated "Solicitar Presupuesto" button and inline phone/email links.
 * @returns {JSX.Element} The full-screen CTA section with interactive card.
 */
export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mouse position for 3D tilt and light effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring values for tilt
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Transform mouse position to rotation (±5 degrees)
  const rotateX = useTransform(springY, [0, 1], [5, -5]);
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);

  // Light position (percentage for radial gradient)
  const lightX = useTransform(springX, [0, 1], [0, 100]);
  const lightY = useTransform(springY, [0, 1], [0, 100]);

  /**
   * Updates normalised mouse position (0–1) motion values when the cursor
   * moves over the card. The values feed into the spring-animated tilt and
   * the radial light gradient position.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse-move synthetic event.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  /**
   * Resets the mouse position motion values to centre (0.5, 0.5) when the
   * cursor leaves the card, smoothly returning the tilt and light to neutral.
   */
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-primary"
    >
      {/* CSS Keyframes for shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-100%) skewX(-15deg);
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background texture/pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Ambient glow behind card */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(184, 135, 78, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: smoothEase }}
      />

      {/* 3D Tilt Container */}
      <div
        className="relative z-10 w-full max-w-4xl mx-auto px-6"
        style={{ perspective: "1000px" }}
      >
        {/* Main CTA Card with 3D tilt effect */}
        <motion.div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 60,
            filter: "blur(10px)",
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                }
              : {}
          }
          transition={{
            duration: 1,
            ease: smoothEase,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/edf-solar-autoconsumo-cydma-cyl-2.jpeg"
              alt="Instalaciones CYDMA"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/70" />
          </div>

          {/* Dynamic light effect following cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                [lightX, lightY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x}% ${y}%, rgba(184, 135, 78, 0.25) 0%, transparent 50%)`
              ),
            }}
          />

          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-2xl border border-white/[0.08]" />

          {/* Content container with translateZ for depth */}
          <div
            className="relative z-10 py-16 md:py-20 lg:py-24 px-8 md:px-12 lg:px-16 text-center"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Decorative top line */}
            <motion.div
              className="w-12 h-px bg-accent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            />

            {/* Small label */}
            <motion.span
              className="inline-block text-accent text-xs font-sans font-medium tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: smoothEase }}
            >
              Hablemos de su proyecto
            </motion.span>

            {/* Main heading */}
            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
            >
              ¿Tienes un proyecto en mente?
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-white/60 font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6, ease: smoothEase }}
            >
              Cuéntanos tu idea y te asesoramos sin compromiso
            </motion.p>

            {/* CTA Button with shimmer effect */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.7, ease: smoothEase }}
            >
              <Link
                to="/contacto"
                className="btn-shimmer inline-flex items-center gap-3 bg-accent text-accent-foreground px-10 py-4 text-sm font-sans font-medium tracking-wide uppercase rounded-lg hover:scale-[1.05] hover:shadow-[0_10px_40px_rgba(184,135,78,0.3)] transition-all duration-300"
              >
                Solicitar Presupuesto
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Decorative bottom accent */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.8, ease: smoothEase }}
            >
              <div className="w-8 h-px bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              <div className="w-8 h-px bg-white/20" />
            </motion.div>

            {/* Contact info row */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.9, ease: smoothEase }}
            >
              <a
                href="tel:983625022"
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/30 transition-colors duration-300">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-sans">983 625 022</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-white/10" />
              <a
                href="mailto:cydma@cydma.es"
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/30 transition-colors duration-300">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-sans">cydma@cydma.es</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
