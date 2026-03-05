/**
 * @module Footer
 * @description Site-wide footer for the CYDMA website. Renders a four-column
 * layout with company branding and social links, catalog category links,
 * service links, and a contact column that includes an embedded Google Maps
 * iframe. A bottom bar displays copyright information and legal policy links.
 */

import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import { categories } from "@/data/catalog";

/**
 * Site footer component for CYDMA.
 * Outputs four responsive columns: company info with social icons, catalog
 * links, service links, and contact details with an embedded map. Dynamically
 * renders the current year in the copyright notice.
 * @returns {JSX.Element} The full site footer element.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(20_25%_6%)] text-white/80">
      {/* Top bronze line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Main Content Area */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* Column 1: Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src="/logo-cydma-0002-blanco.png"
                alt="CYDMA"
                className="h-10 w-auto opacity-90"
              />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-xs">
              Referentes en el servicio integral de carpintería desde 1989.
              Calidad, cercanía y excelencia en cada proyecto.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/cydma_iscar/", label: "Instagram" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/cydma/", label: "LinkedIn" },
                { Icon: Facebook, href: "https://www.facebook.com/cydma.iscar", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-accent/40 hover:text-accent transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Catálogo */}
          <div>
            <h4 className="font-serif text-lg text-white font-normal mb-5">
              Catálogo
            </h4>
            <div className="w-6 h-px bg-accent/40 mb-5" />
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalogo/${cat.slug}`}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Servicios */}
          <div>
            <h4 className="font-serif text-lg text-white font-normal mb-5">
              Servicios
            </h4>
            <div className="w-6 h-px bg-accent/40 mb-5" />
            <ul className="space-y-3">
              {[
                { name: "Almacén", href: "/almacen" },
                { name: "Contract", href: "/contract" },
                { name: "Export", href: "/export" },
                { name: "Configurador", href: "/configurador" },
              ].map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contacto */}
          <div>
            <h4 className="font-serif text-lg text-white font-normal mb-5">
              Contacto
            </h4>
            <div className="w-6 h-px bg-accent/40 mb-5" />
            <div className="space-y-4 mb-6">
              <a
                href="tel:983625022"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                <Phone className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                983 625 022
              </a>
              <a
                href="mailto:cydma@cydma.es"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                <Mail className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                cydma@cydma.es
              </a>
              <div className="flex items-start gap-3 text-sm text-white/40">
                <MapPin className="h-3.5 w-3.5 text-accent/60 shrink-0 mt-0.5" />
                <span>
                  Pol. Industrial, Íscar
                  <br />
                  Valladolid, España
                </span>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="rounded-lg overflow-hidden border border-white/10 aspect-[16/10]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.5!2d-4.5283!3d41.3614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4715e6e5d8c5f5%3A0x0!2zw41zY2FyLCBWYWxsYWRvbGlk!5e0!3m2!1ses!2ses!4v1"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(1) brightness(0.4) contrast(1.2)",
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación CYDMA - Íscar, Valladolid"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {currentYear} CYDMA. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacidad"
              className="text-xs text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/legal"
              className="text-xs text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              Aviso Legal
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
