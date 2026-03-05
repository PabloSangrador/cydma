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
import { Building2, Cog, Users, ClipboardCheck, Hammer, CheckCircle } from "lucide-react";

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Asesoramiento inicial",
    description: "Análisis del proyecto desde su concepción.",
  },
  {
    icon: Cog,
    title: "Fabricación",
    description: "Procesos estandarizados con última tecnología.",
  },
  {
    icon: Hammer,
    title: "Instalación",
    description: "Seguimiento a pie de obra por profesionales.",
  },
  {
    icon: Users,
    title: "Postventa",
    description: "Atención continua tras la finalización.",
  },
];

const products = [
  "Puertas de madera y lacadas",
  "Puertas de vinilo",
  "Armarios empotrados y vestidores",
  "Suelos laminados",
  "Suelos vinílicos",
  "Suelos técnicos",
  "Puertas técnicas acústicas",
  "Puertas resistentes al fuego",
];

export default function Contract() {
  return (
    <Layout>
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
                <BreadcrumbPage>Contract</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80"
            alt="Proyectos contract CYDMA - Hoteles y espacios comerciales"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <p className="text-accent font-medium tracking-wider uppercase text-sm">
                Carpintería Industrial
              </p>
            </div>
            <h1 className="font-serif text-display-sm md:text-display text-foreground mb-6">
              Soluciones Contract
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Especialistas en obra nueva y rehabilitación. Combinamos procesos
              estandarizados con última tecnología y el conocimiento artesanal
              de la materia prima para ofrecer resultados excepcionales.
            </p>
            <Button asChild size="lg">
              <Link to="/contacto">Solicitar proyecto</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              Nuestro Proceso
            </h2>
            <p className="text-muted-foreground">
              Acompañamos cada proyecto desde su concepción hasta la entrega final.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-border" />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-display-sm mb-6">
                Productos para proyectos Contract
              </h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Ofrecemos una amplia gama de productos específicos para proyectos
                de construcción y rehabilitación, adaptados a las necesidades
                técnicas y estéticas de cada obra.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((product) => (
                  <div key={product} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{product}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Productos Contract"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-display-sm text-foreground text-center mb-12">
              Por qué elegirnos
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Experiencia probada",
                  description:
                    "Más de 35 años trabajando con constructoras, arquitectos y promotoras.",
                },
                {
                  title: "Tecnología avanzada",
                  description:
                    "Procesos de fabricación estandarizados con maquinaria de última generación.",
                },
                {
                  title: "Conocimiento artesanal",
                  description:
                    "Combinamos la tecnología con el saber hacer tradicional de la carpintería.",
                },
                {
                  title: "Seguimiento integral",
                  description:
                    "Acompañamos el proyecto desde el diseño hasta la instalación final.",
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-6 bg-secondary/30 rounded-lg"
                >
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container text-center">
          <h2 className="font-serif text-display-sm text-foreground mb-4">
            ¿Tiene un proyecto en mente?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Cuéntenos sobre su proyecto y le ofreceremos una solución a medida.
          </p>
          <Button asChild size="lg">
            <Link to="/contacto">Contactar ahora</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
