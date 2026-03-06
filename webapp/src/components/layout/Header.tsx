/**
 * @module Header
 * @description Site-wide header for the CYDMA website. Includes a collapsible
 * topbar with contact details, a sticky main navigation bar with desktop
 * mega-menu and dropdown support, a scroll-progress indicator, a global
 * search bar, and a full-screen mobile menu.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, ArrowRight, ShoppingCart } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { categories } from "@/data/catalog";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";
import SearchBar from "./SearchBar";
import { useCart } from "@/contexts/CartContext";

interface NavItem {
  href?: string;
  label: string;
  hasMegaMenu?: boolean;
  hasDropdown?: boolean;
  items?: { href: string; label: string }[];
}

const navigation: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo", hasMegaMenu: true },
  {
    label: "Servicios",
    hasDropdown: true,
    items: [
      { href: "/almacen", label: "Almacén" },
      { href: "/contract", label: "Contract" },
      { href: "/export", label: "Export" },
      { href: "/calculadora", label: "Calculadora" },
      { href: "/garantia", label: "Garantía" },
    ],
  },
  {
    label: "A medida",
    hasDropdown: true,
    items: [
      { href: "/puertas-medida", label: "Puertas a Medida" },
      { href: "/armarios-medida", label: "Armarios a Medida" },
    ],
  },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const megaMenuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cartCount, setIsCartOpen } = useCart();

  const openMegaMenu = () => {
    if (megaMenuCloseTimeoutRef.current) clearTimeout(megaMenuCloseTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const closeMegaMenuDelayed = () => {
    megaMenuCloseTimeoutRef.current = setTimeout(() => setMegaMenuOpen(false), 300);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="relative">
      {/* Topbar */}
      <div
        className={cn(
          "bg-[hsl(20_25%_8%)] text-white/70 transition-all duration-500 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-9"
        )}
      >
        <div className="container h-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <a
              href="tel:983625022"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>983 625 022</span>
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a
              href="mailto:cydma@cydma.es"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>cydma@cydma.es</span>
            </a>
            <span className="w-px h-3 bg-white/20 hidden sm:block" />
            <a
              href="https://wa.me/34983625022"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="hidden md:block text-white/50">Más de 35 años de experiencia</p>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-soft-md"
            : "bg-background"
        )}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left z-50"
          style={{ scaleX }}
        />
        <div className="container flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo-cydma-0006-corporativo.png"
              alt="CYDMA"
              className={cn(
                "w-auto object-contain transition-all duration-500",
                scrolled ? "h-8" : "h-10 lg:h-12"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              if (item.href) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => (item.hasMegaMenu ? openMegaMenu() : undefined)}
                    onMouseLeave={() => (item.hasMegaMenu ? closeMegaMenuDelayed() : undefined)}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-1",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                      {item.hasMegaMenu ? (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            megaMenuOpen && "rotate-180"
                          )}
                        />
                      ) : null}
                    </Link>
                    {item.hasMegaMenu && megaMenuOpen ? (
                      <>
                        <div
                          className="absolute left-0 right-0 h-4 bottom-0 translate-y-full"
                          style={{ pointerEvents: "auto" }}
                          onMouseEnter={openMegaMenu}
                        />
                        <MegaMenu
                          categories={categories}
                          onClose={closeMegaMenuDelayed}
                          onMouseEnter={openMegaMenu}
                          scrolled={scrolled}
                        />
                      </>
                    ) : null}
                  </div>
                );
              }

              if (item.hasDropdown) {
                const isOpen = activeDropdown === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-1",
                        isOpen
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen ? (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="bg-card border border-border/50 rounded-lg shadow-elevated py-2 min-w-[180px] animate-slide-down">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Right: Search + Cart + CTA + Mobile Toggle */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Global search — all screen sizes */}
            <SearchBar />

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* CTA Button - desktop only */}
            <Link
              to="/contacto"
              className="hidden lg:inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium rounded-lg hover:scale-[1.02] transition-transform duration-300 ml-2"
            >
              Solicitar Presupuesto
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{ top: scrolled ? "64px" : "100px" }}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border/30">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo-cydma-0006-corporativo.png" alt="CYDMA" className="h-10" />
            </Link>
          </div>

          <nav className="flex-1 overflow-auto p-6">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.href) {
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block py-3 text-lg font-medium transition-colors",
                          isActive(item.href)
                            ? "text-primary"
                            : "text-foreground/70 hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                if (item.hasDropdown) {
                  return (
                    <li key={item.label} className="py-3">
                      <span className="text-lg font-medium text-foreground">{item.label}</span>
                      <ul className="mt-2 ml-4 space-y-1">
                        {item.items?.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              to={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-2 text-base text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </nav>

          <div className="p-6 border-t border-border/30 bg-secondary/30">
            <div className="space-y-3 mb-6">
              <a
                href="tel:983625022"
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Phone className="h-4 w-4 text-accent" />
                983 625 022
              </a>
              <a
                href="mailto:cydma@cydma.es"
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Mail className="h-4 w-4 text-accent" />
                cydma@cydma.es
              </a>
            </div>
            <Link
              to="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium"
            >
              Solicitar Presupuesto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
