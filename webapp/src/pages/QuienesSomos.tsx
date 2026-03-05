import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Users, Target, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { Counter } from "@/components/motion/Counter";
import { SplitText } from "@/components/motion/SplitText";
import SEOHead from "@/components/seo/SEOHead";

const milestones = [
  { year: "1989", title: "Fundación", description: "Inicio de actividad en Íscar, Valladolid" },
  { year: "2000", title: "Expansión", description: "Ampliación de instalaciones y catálogo" },
  { year: "2010", title: "Exportación", description: "Apertura al mercado internacional" },
  { year: "2024", title: "Hoy", description: "+35 años de experiencia y crecimiento continuo" },
];

const stats = [
  { value: "+35", label: "Años de experiencia" },
  { value: "+1000", label: "Clientes satisfechos" },
  { value: "+50", label: "Países exportación" },
  { value: "100%", label: "Compromiso" },
];

export default function QuienesSomos() {
  return (
    <Layout>
      <SEOHead
        title="Quiénes Somos | Historia y Valores de CYDMA"
        description="Más de 35 años fabricando y distribuyendo soluciones de carpintería industrial. Conoce nuestra historia, equipo y compromiso con el profesional de la madera."
        canonical="https://cydma.es/quienes-somos"
      />
      {/* Hero */}
      <section className="relative py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <motion.p
              className="text-accent font-medium tracking-wider uppercase text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Nuestra Historia
            </motion.p>
            <SplitText
              as="h1"
              className="font-serif text-display-sm md:text-display text-foreground mb-6"
              delay={0.1}
            >
              Quiénes Somos
            </SplitText>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Desde 1989, CYDMA ha sido sinónimo de excelencia en carpintería industrial.
              Nuestra misión es ofrecer un servicio integral de carpintería con atención
              personalizada al profesional de la madera.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ScrollReveal variant="fade-left" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h2 className="font-serif text-2xl font-semibold">Nuestra Misión</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ofrecer un servicio integral de carpintería de la más alta calidad,
                proporcionando atención personalizada a cada profesional de la madera.
                Nos comprometemos a ser el socio de confianza que nuestros clientes
                necesitan para llevar a cabo sus proyectos con excelencia.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-right" delay={0.2}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h2 className="font-serif text-2xl font-semibold">Nuestra Visión</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Consolidar nuestras líneas tradicionales manteniendo los más altos
                estándares de calidad, mientras nos abrimos a nuevos mercados y
                oportunidades. Aspiramos a ser referentes internacionales en el
                sector de la carpintería industrial.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" stagger={0.15}>
            {stats.map((stat) => {
              const numericMatch = stat.value.match(/\d+/);
              const numericValue = numericMatch ? parseInt(numericMatch[0], 10) : 0;
              const prefix = stat.value.startsWith("+") ? "+" : "";
              const suffix = stat.value.endsWith("%") ? "%" : "";

              return (
                <div key={stat.label} className="text-center">
                  <Counter
                    to={numericValue}
                    prefix={prefix}
                    suffix={suffix}
                    className="font-serif text-4xl md:text-5xl font-bold mb-2 block"
                    duration={2}
                  />
                  <StaggerItem variant="fade-up">
                    <p className="text-sm opacity-80">{stat.label}</p>
                  </StaggerItem>
                </div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-medium tracking-wider uppercase text-sm mb-2">
              Nuestra Trayectoria
            </p>
            <ScrollReveal variant="blur">
              <h2 className="font-serif text-display-sm md:text-display text-foreground">
                Hitos Importantes
              </h2>
            </ScrollReveal>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />

            {milestones.map((milestone, index) => (
              <ScrollReveal
                key={milestone.year}
                variant={index % 2 === 0 ? "fade-left" : "fade-right"}
                delay={0.1 + index * 0.15}
              >
                <div
                  className={`relative flex items-center gap-8 mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Circle */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background" />

                  {/* Content */}
                  <div
                    className={`ml-20 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                    }`}
                  >
                    <span className="text-accent font-semibold text-lg">{milestone.year}</span>
                    <h3 className="font-serif text-xl font-semibold mt-1">{milestone.title}</h3>
                    <p className="text-muted-foreground mt-1">{milestone.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-medium tracking-wider uppercase text-sm mb-2">
              Lo que nos define
            </p>
            <h2 className="font-serif text-display-sm md:text-display text-foreground">
              Nuestros Valores
            </h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto" stagger={0.15}>
            {[
              {
                icon: CheckCircle,
                title: "Calidad",
                description: "Mantenemos los más altos estándares en cada producto y servicio.",
              },
              {
                icon: Users,
                title: "Cercanía",
                description: "Tratamos cada proyecto como único, con implicación personal.",
              },
              {
                icon: Clock,
                title: "Compromiso",
                description: "Cumplimos con los plazos y expectativas de nuestros clientes.",
              },
            ].map((value) => (
              <StaggerItem key={value.title} variant="scale">
                <div className="bg-background rounded-lg p-8 shadow-soft text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              ¿Quiere conocernos mejor?
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Contacte con nosotros y descubra cómo podemos ayudarle en su próximo proyecto.
            </p>
          </ScrollReveal>
          <Button asChild size="lg">
            <Link to="/contacto">Contactar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
