/**
 * @module BusinessLinesSection
 * @description Business lines section for the CYDMA homepage. Presents the
 * three specialised divisions — Almacén, Contract, and Export — as large
 * alternating image/text cards. Each card uses a unique entry animation and
 * a scroll-parallax decorative number. A scroll-progress line on the left
 * fills as the user reads through the section.
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/** Smooth spring-like cubic-bezier easing used across all entry animations. */
const smoothEase = [0.16, 1, 0.3, 1];

const businessLines = [
  {
    number: "01",
    title: "Almacén",
    description:
      "Más de 5.000 referencias en stock permanente. Servicio integral para el profesional de la madera.",
    href: "/almacen",
    image:
      "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=1200&q=80",
    alt: "Almacén de madera y materiales de carpintería - CYDMA stock permanente",
    // Card 1: image from left, text from right
    imageAnimation: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    textAnimation: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  },
  {
    number: "02",
    title: "Contract",
    description:
      "Proyectos llave en mano para hoteles, oficinas y espacios comerciales. Diseño, fabricación e instalación.",
    href: "/contract",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    alt: "Interior de hotel con puertas de madera - Proyectos contract CYDMA",
    // Card 2: image from right, text from left
    imageAnimation: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    textAnimation: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  },
  {
    number: "03",
    title: "Export",
    description:
      "Llevamos la calidad española a todo el mundo. Embalaje profesional y logística internacional.",
    href: "/export",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1200&q=80",
    alt: "Contenedores de carga y logística de exportación - CYDMA Export",
    // Card 3: scale + blur approach effect
    imageAnimation: { initial: { scale: 1.3, opacity: 0, filter: "blur(20px)" }, animate: { scale: 1, opacity: 1, filter: "blur(0px)" } },
    textAnimation: { initial: { y: 60, opacity: 0, filter: "blur(10px)" }, animate: { y: 0, opacity: 1, filter: "blur(0px)" } },
  },
];

/**
 * Props for the BusinessCard component.
 */
// (inline type via typeof businessLines)

/**
 * A single business line card for the CYDMA homepage.
 * Renders an alternating image/text layout (image left on even indices,
 * image right on odd). The image enters with the line's custom animation
 * while a clip-path sweeps the photo in from the side. A large decorative
 * ordinal number floats over the image with a scroll-driven parallax offset.
 * @param {{ line: (typeof businessLines)[0]; index: number; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }} props
 * @param {(typeof businessLines)[0]} props.line - Business line data (title, description, image, animations, href).
 * @param {number} props.index - Zero-based position; controls layout direction and parallax direction.
 * @param {ReturnType<typeof useScroll>["scrollYProgress"]} props.scrollYProgress - Section-level scroll progress used to animate the decorative number.
 * @returns {JSX.Element} An animated full-height card for one CYDMA business line.
 */
function BusinessCard({
  line,
  index,
  scrollYProgress,
}: {
  line: (typeof businessLines)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  // Parallax for decorative number - moves opposite to scroll
  const numberY = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * (index + 1), -50 * (index + 1)]
  );

  return (
    <motion.div
      ref={cardRef}
      className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center"
    >
      <div className="container relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
            index % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Side */}
          <motion.div
            className={`relative aspect-[4/3] lg:aspect-[16/10] rounded-xl overflow-hidden ${
              index % 2 === 1 ? "lg:order-2" : ""
            }`}
            initial={line.imageAnimation.initial}
            animate={isInView ? line.imageAnimation.animate : {}}
            transition={{ duration: 1, ease: smoothEase }}
          >
            {/* Background image with clip-path reveal */}
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
            >
              <img
                src={line.image}
                alt={line.alt}
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>

            {/* Decorative number with parallax */}
            <motion.span
              className="absolute -top-4 -right-4 lg:top-4 lg:right-8 text-[8rem] lg:text-[12rem] font-serif font-bold leading-none select-none pointer-events-none"
              style={{
                y: numberY,
                WebkitTextStroke: "1px rgba(255,255,255,0.1)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {line.number}
            </motion.span>
          </motion.div>

          {/* Text Side */}
          <motion.div
            className={`relative ${index % 2 === 1 ? "lg:order-1 lg:text-right" : ""}`}
            initial={line.textAnimation.initial}
            animate={isInView ? line.textAnimation.animate : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
          >
            {/* Small accent line */}
            <motion.div
              className={`h-px bg-accent mb-6 ${index % 2 === 1 ? "lg:ml-auto" : ""}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: smoothEase }}
            />

            {/* Number badge */}
            <span className="text-accent font-sans font-medium tracking-widest uppercase text-xs mb-4 block">
              {line.number} — Línea de negocio
            </span>

            {/* Title */}
            <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-6">
              {line.title}
            </h3>

            {/* Description */}
            <p className="text-white/60 font-sans text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              {line.description}
            </p>

            {/* CTA Link */}
            <Link
              to={line.href}
              className={`group inline-flex items-center gap-3 text-accent text-sm font-sans font-medium tracking-wide uppercase hover:text-white transition-colors duration-300 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <span>Descubrir más</span>
              <ArrowRight
                className={`h-4 w-4 transition-transform duration-300 ${
                  index % 2 === 1
                    ? "group-hover:-translate-x-1.5 rotate-180"
                    : "group-hover:translate-x-1.5"
                }`}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Business lines section for the CYDMA homepage.
 * Displays an animated section header followed by three full-height
 * BusinessCard components. A fixed scroll-progress line on the left edge
 * fills with accent colour as the user scrolls through the section.
 * @returns {JSX.Element} The full business lines section with header and cards.
 */
export default function BusinessLinesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });

  // Track scroll progress through the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Progress line fill
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary text-primary-foreground overflow-hidden"
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Progress line on the left */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-20 h-48">
        {/* Background line */}
        <div className="w-px h-full bg-white/10" />
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 w-px bg-accent"
          style={{ height: progressHeight }}
        />
        {/* Top dot */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/20 bg-primary" />
        {/* Bottom dot */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/20 bg-primary" />
      </div>

      {/* Header */}
      <div ref={headerRef} className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
          >
            <motion.div
              className="h-px bg-accent mx-auto mb-8"
              initial={{ width: 0 }}
              animate={headerInView ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            />
            <p className="text-accent font-sans font-medium tracking-widest uppercase text-xs mb-5">
              Líneas de Negocio
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-balance mb-6">
              Soluciones para cada necesidad
            </h2>
            <p className="text-white/50 font-sans text-base lg:text-lg max-w-xl mx-auto">
              Tres divisiones especializadas para cubrir todas las necesidades
              del sector de la carpintería y la madera.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Business Lines Cards */}
      <div className="space-y-8 lg:space-y-0">
        {businessLines.map((line, index) => (
          <BusinessCard
            key={line.title}
            line={line}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="h-20 lg:h-32" />

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
