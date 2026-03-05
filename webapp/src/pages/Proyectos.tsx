import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MapPin, Building2, Hotel, GraduationCap, Home, Building, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const projectCategories = [
  { id: "todos", name: "Todos", icon: Building2 },
  { id: "hoteles", name: "Hoteles", icon: Hotel },
  { id: "residencial", name: "Residencial", icon: Home },
  { id: "educacion", name: "Educación", icon: GraduationCap },
  { id: "corporativo", name: "Corporativo", icon: Building },
];

const projects = [
  {
    id: 1,
    title: "Hotel Meliá Valencia",
    category: "hoteles",
    location: "Valencia, España",
    year: "2024",
    description: "Suministro completo de 350 puertas lacadas serie LAC-544 con herrajes premium para renovación integral.",
    stats: { doors: "350", duration: "4 meses", area: "12.000m²" },
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Residencial Las Artes",
    category: "residencial",
    location: "Madrid, España",
    year: "2024",
    description: "Promoción de 120 viviendas con puertas de interior, armarios empotrados y frentes de armario.",
    stats: { doors: "840", duration: "8 meses", area: "18.500m²" },
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    featured: true,
  },
  {
    id: 3,
    title: "Universidad de Salamanca",
    category: "educacion",
    location: "Salamanca, España",
    year: "2023",
    description: "Renovación de facultad con puertas acústicas y soluciones fenólicas para laboratorios.",
    stats: { doors: "180", duration: "3 meses", area: "5.200m²" },
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    featured: false,
  },
  {
    id: 4,
    title: "Oficinas Telefónica",
    category: "corporativo",
    location: "Barcelona, España",
    year: "2023",
    description: "Diseño y fabricación de mamparas divisorias y puertas de diseño para sede corporativa.",
    stats: { doors: "95", duration: "2 meses", area: "3.800m²" },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    featured: false,
  },
  {
    id: 5,
    title: "Hotel Barceló Sevilla",
    category: "hoteles",
    location: "Sevilla, España",
    year: "2023",
    description: "Puertas acorazadas para habitaciones y armarios a medida con acabados premium.",
    stats: { doors: "220", duration: "5 meses", area: "8.900m²" },
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    featured: true,
  },
  {
    id: 6,
    title: "Complejo Residencial Porto",
    category: "residencial",
    location: "Oporto, Portugal",
    year: "2023",
    description: "Exportación de puertas y marcos para promoción de lujo. Embalaje especializado para transporte internacional.",
    stats: { doors: "480", duration: "6 meses", area: "14.200m²" },
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    featured: false,
  },
  {
    id: 7,
    title: "Colegio Internacional SEK",
    category: "educacion",
    location: "Madrid, España",
    year: "2022",
    description: "Puertas de alta resistencia y cabinas fenólicas para vestuarios y aseos.",
    stats: { doors: "320", duration: "4 meses", area: "7.600m²" },
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    featured: false,
  },
  {
    id: 8,
    title: "Torre Empresarial Chamartín",
    category: "corporativo",
    location: "Madrid, España",
    year: "2022",
    description: "Suministro integral para torre de oficinas: puertas cortafuegos, divisiones y acabados.",
    stats: { doors: "650", duration: "10 meses", area: "28.000m²" },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    featured: true,
  },
];

export default function Proyectos() {
  const [activeCategory, setActiveCategory] = useState("todos");

  const filteredProjects = activeCategory === "todos"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <Layout>
      <SEOHead
        title="Proyectos Realizados | Instalaciones de Carpintería Industrial"
        description="Conoce los proyectos en los que CYDMA ha participado. Instalaciones residenciales, hoteleras e industriales con nuestras soluciones de carpintería."
        canonical="https://cydma.es/proyectos"
      />
      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b">
        <div className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Proyectos Realizados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <motion.p
              className="text-accent font-medium tracking-wider uppercase text-sm mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Más de 35 años de experiencia
            </motion.p>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Proyectos Realizados
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Descubre algunos de los proyectos más destacados que hemos ejecutado.
              Cada uno representa nuestro compromiso con la calidad y la excelencia
              en carpintería industrial.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <ScrollReveal variant="clip-up">
        <section className="py-10 bg-primary text-primary-foreground">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-1">+500</p>
                <p className="text-sm opacity-80">Proyectos completados</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-1">+50</p>
                <p className="text-sm opacity-80">Países de exportación</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-1">+1M</p>
                <p className="text-sm opacity-80">Puertas instaladas</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-1">98%</p>
                <p className="text-sm opacity-80">Clientes satisfechos</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal variant="fade-up" threshold={0.2}>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8">
              Proyectos Destacados
            </h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8" stagger={0.07} threshold={0.1}>
            {featuredProjects.slice(0, 2).map((project) => (
              <StaggerItem key={project.id} variant="scale">
                <div className="group relative overflow-hidden rounded-xl bg-card border shadow-soft hover:shadow-elevated transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
                      <MapPin className="h-4 w-4" />
                      {project.location} · {project.year}
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm opacity-90 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="font-bold">{project.stats.doors}</span>
                        <span className="opacity-80 ml-1">puertas</span>
                      </div>
                      <div>
                        <span className="font-bold">{project.stats.area}</span>
                        <span className="opacity-80 ml-1">superficie</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* All Projects with Filter */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <ScrollReveal variant="fade-up" threshold={0.2}>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                Todos los Proyectos
              </h2>
            </ScrollReveal>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {projectCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Grid */}
          <StaggerContainer key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07} threshold={0.1}>
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id} variant="scale">
                <div className="group bg-card rounded-lg overflow-hidden border shadow-soft hover:shadow-soft-lg transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {project.location} · {project.year}
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span><strong className="text-foreground">{project.stats.doors}</strong> puertas</span>
                        <span><strong className="text-foreground">{project.stats.duration}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
              ¿Tiene un proyecto en mente?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos está preparado para asesorarle en su próximo
              proyecto. Desde la concepción hasta la instalación final.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="group">
                <Link to="/contacto">
                  Solicitar Presupuesto
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 hover:bg-white/10">
                <Link to="/contract">Conocer Servicio Contract</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
