/**
 * @module CategoriesSection
 * @description Product categories grid section for the CYDMA homepage.
 * Renders the first six catalog categories in an asymmetric masonry layout
 * with per-card magnetic hover effects, cursor-parallax image movement, and
 * staggered entry animations. Each card links to the corresponding catalog
 * category page.
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { categories } from "@/data/catalog";

/** Smooth spring-like cubic-bezier easing used across all entry animations. */
const smoothEase = [0.16, 1, 0.3, 1];

/**
 * Grid span and className configuration for each card position in the
 * asymmetric masonry layout (large, normal, tall, etc.).
 */
const gridConfig = [
  { colSpan: 2, rowSpan: 2, className: "lg:col-span-2 lg:row-span-2" }, // Card 1: large
  { colSpan: 1, rowSpan: 1, className: "" }, // Card 2
  { colSpan: 1, rowSpan: 1, className: "" }, // Card 3
  { colSpan: 1, rowSpan: 2, className: "lg:row-span-2" }, // Card 4: tall
  { colSpan: 1, rowSpan: 1, className: "" }, // Card 5
  { colSpan: 1, rowSpan: 1, className: "" }, // Card 6
];

/**
 * Returns the Framer Motion initial/animate variants for a category card
 * based on its index in the grid. Provides visual variety: the first card
 * uses a scale fade, even-indexed cards use a clip-up reveal, and odd-indexed
 * cards use a blur + scale approach.
 * @param {number} index - Zero-based position of the card in the display array.
 * @returns {{ initial: object; animate: object }} Framer Motion animation config.
 */
const getEntryAnimation = (index: number) => {
  if (index === 0) {
    // Card 1 (large): fade from center with scale
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    };
  }
  if (index % 2 === 0) {
    // Even cards: clip-up
    return {
      initial: { clipPath: "inset(100% 0 0 0)" },
      animate: { clipPath: "inset(0% 0 0 0)" },
    };
  }
  // Odd cards: blur + scale
  return {
    initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  };
};

/**
 * Props for the CategoryCard component.
 */
interface CategoryCardProps {
  /** The catalog category data to display (image, name, subcategories, slug). */
  category: (typeof categories)[0];
  /** Zero-based position in the grid; determines size, entry animation, and layout. */
  index: number;
  /** Whether the parent grid container has scrolled into the viewport. */
  isInView: boolean;
}

/**
 * Individual category card used in the CYDMA homepage categories grid.
 * Features a magnetic hover effect that nudges the card toward the cursor,
 * a cursor-parallax image that moves in the opposite direction for depth,
 * a dynamic gradient overlay that rotates to face the cursor, and a hover
 * state revealing the "Ver productos" call-to-action.
 * @param {CategoryCardProps} props
 * @param {CategoryCardProps["category"]} props.category - Category data to render.
 * @param {number} props.index - Grid position index.
 * @param {boolean} props.isInView - Triggers the entry animation when true.
 * @returns {JSX.Element} An animated, interactive category card with a link.
 */
function CategoryCard({ category, index, isInView }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic effect motion values
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 300, damping: 20 });
  const springY = useSpring(magnetY, { stiffness: 300, damping: 20 });

  // Image parallax motion values (moves opposite to cursor)
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const springImageX = useSpring(imageX, { stiffness: 200, damping: 25 });
  const springImageY = useSpring(imageY, { stiffness: 200, damping: 25 });

  // Gradient angle based on cursor position
  const gradientAngle = useMotionValue(180);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Magnetic effect: card moves toward cursor (max 8px)
    magnetX.set(x * 0.04);
    magnetY.set(y * 0.04);

    // Image parallax: image moves opposite to cursor (creates depth)
    imageX.set(-x * 0.02);
    imageY.set(-y * 0.02);

    // Gradient angle follows cursor
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    gradientAngle.set(angle);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    magnetX.set(0);
    magnetY.set(0);
    imageX.set(0);
    imageY.set(0);
  };

  const config = gridConfig[index] || { className: "" };
  const entryAnim = getEntryAnimation(index);
  const isLarge = index === 0;
  const isTall = index === 3;

  // Dynamic gradient style
  const gradientStyle = useTransform(
    gradientAngle,
    (angle) =>
      `linear-gradient(${angle}deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)`
  );

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${config.className}`}
      initial={entryAnim.initial}
      animate={isInView ? entryAnim.animate : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: smoothEase,
      }}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/catalogo/${category.slug}`}
        className={`group relative block overflow-hidden rounded-xl ${
          isLarge
            ? "aspect-square lg:aspect-auto lg:h-full"
            : isTall
              ? "aspect-[3/4] lg:aspect-auto lg:h-full"
              : "aspect-[4/3]"
        }`}
      >
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
          style={{ x: springImageX, y: springImageY }}
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
        </motion.div>

        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isHovered ? gradientStyle : undefined,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Static gradient overlay (visible when not hovered) */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Top-left accent line */}
        <div className="absolute top-5 left-5 lg:top-7 lg:left-7 w-6 h-px bg-white/30 group-hover:w-12 group-hover:bg-accent transition-all duration-500" />

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
          {/* Subcategory count */}
          <span className="text-white/50 text-xs font-sans tracking-wider uppercase mb-2 block">
            {category.subcategories?.length ?? 0} colecciones
          </span>

          {/* Category name with animated underline */}
          <h3
            className={`font-serif text-white font-normal mb-0 relative inline-block ${
              isLarge ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"
            }`}
          >
            {category.name}
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 h-px bg-accent transition-all duration-400 ease-out w-0 group-hover:w-full" />
          </h3>

          {/* "Ver productos" - appears on hover */}
          <div className="flex items-center gap-2 text-accent text-sm font-sans font-medium tracking-wide mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
            Ver productos
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Product categories section for the CYDMA homepage.
 * Displays the first six catalog categories in a four-column asymmetric
 * masonry grid. The section header animates in on scroll, each card enters
 * with its own staggered animation, and a "Ver catálogo completo" link fades
 * in below the grid after the cards have appeared.
 * @returns {JSX.Element} The full categories grid section.
 */
export default function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  // Take only first 6 categories for the grid
  const displayCategories = categories.slice(0, 6);

  return (
    <section ref={sectionRef} className="section-padding overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-14 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <span className="text-accent font-sans font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            Nuestro Catálogo
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
            Productos de Calidad
          </h2>
          <motion.div
            className="mx-auto w-12 h-px bg-accent"
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
          />
        </motion.div>

        {/* Asymmetric Masonry Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(280px,1fr))] gap-3 lg:gap-4"
        >
          {displayCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              isInView={gridInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14 lg:mt-20"
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease: smoothEase }}
        >
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-3 text-primary font-sans font-medium text-sm tracking-wide uppercase hover:text-accent transition-colors duration-300"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
