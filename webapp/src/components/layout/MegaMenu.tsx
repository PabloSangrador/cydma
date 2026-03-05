/**
 * @module MegaMenu
 * @description Full-width catalog mega-menu panel for the CYDMA desktop
 * navigation. Displays all product categories in a responsive grid with
 * category images, subcategory counts, and quick-links to services.
 * Opens when the user hovers over the "Catálogo" nav item in the Header.
 */

import { Link } from "react-router-dom";
import { Category } from "@/data/catalog";
import { ArrowRight, DoorOpen, RectangleVertical, Shield, Frame, Layers, Wrench } from "lucide-react";

/**
 * Props for the MegaMenu component.
 */
interface MegaMenuProps {
  /** List of product categories to display in the grid. */
  categories: Category[];
  /** Callback invoked (with delay) when the cursor leaves the panel to close it. */
  onClose: () => void;
  /** Callback invoked when the cursor enters the panel to keep it open. */
  onMouseEnter?: () => void;
  /**
   * Whether the page header is in its scrolled (compact) state.
   * Used to calculate the correct `top` offset so the panel aligns
   * directly below the navigation bar.
   */
  scrolled?: boolean;
}

/**
 * Maps a category slug to a corresponding Lucide icon component used as
 * a fallback when the category has no image.
 */
const categoryIcons: Record<string, React.ElementType> = {
  "puertas": DoorOpen,
  "armarios": RectangleVertical,
  "acorazadas": Shield,
  "marcos-y-molduras": Frame,
  "soluciones-fenolicas": Layers,
  "herrajes": Wrench,
};

/**
 * Full-width catalog mega-menu panel for the CYDMA header.
 * Rendered as a fixed overlay positioned directly below the navigation bar.
 * Displays the product category grid, a link to the full catalog, and quick
 * links to CYDMA's service pages (Almacén, Contract, Export).
 * @param {MegaMenuProps} props
 * @param {Category[]} props.categories - Product categories to show in the grid.
 * @param {() => void} props.onClose - Handler to schedule closing the panel.
 * @param {() => void} [props.onMouseEnter] - Handler to keep the panel open on re-entry.
 * @param {boolean} [props.scrolled=false] - Compact nav state for top-offset calculation.
 * @returns {JSX.Element} The full-width mega-menu overlay panel.
 */
export default function MegaMenu({ categories, onClose, onMouseEnter, scrolled = false }: MegaMenuProps) {
  // When scrolled, topbar is hidden so nav starts at top. When not scrolled, topbar (h-9 = 36px) + nav (h-[4.5rem] = 72px) = 108px
  const topPosition = scrolled ? "64px" : "108px";

  return (
    <div
      className="fixed left-0 right-0 w-full bg-card border-t border-border/50 shadow-elevated animate-slide-down z-50"
      style={{ top: topPosition }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="container py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-serif text-2xl text-foreground mb-1">Nuestro Catalogo</h3>
            <p className="text-sm text-muted-foreground">Mas de 5.000 referencias en stock permanente</p>
          </div>
          <Link
            to="/catalogo"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Ver todo el catalogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid - 6 columns on large screens, 3 on medium */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || DoorOpen;

            return (
              <Link
                key={category.id}
                to={`/catalogo/${category.slug}`}
                onClick={onClose}
                className="group"
              >
                {/* Card with image or icon background */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary/50 mb-3">
                  {/* If category has image, show it */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>

                {/* Category name */}
                <h4 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h4>

                {/* Subcategory count */}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {category.subcategories?.length ?? 0} colecciones
                </p>
              </Link>
            );
          })}
        </div>

        {/* Bottom row with services links */}
        <div className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Servicios:</span>
            <Link to="/almacen" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Almacen</Link>
            <Link to="/contract" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contract</Link>
            <Link to="/export" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Export</Link>
          </div>
          <Link
            to="/contacto"
            onClick={onClose}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            No encuentra lo que busca? Contactenos
          </Link>
        </div>
      </div>
    </div>
  );
}
