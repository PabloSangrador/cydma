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
import {
  Shield,
  Clock,
  Wrench,
  Phone,
  Mail,
  CheckCircle2,
  FileText,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  Award,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const warranties = [
  {
    title: "Puertas de Interior",
    duration: "5 años",
    icon: Shield,
    coverage: [
      "Defectos de fabricación",
      "Deformaciones estructurales",
      "Acabados y lacados",
      "Mecanismos de cierre",
    ],
  },
  {
    title: "Puertas Acorazadas",
    duration: "10 años",
    icon: Shield,
    coverage: [
      "Sistema de seguridad completo",
      "Cerraduras y cilindros",
      "Estructura y blindaje",
      "Acabados exteriores",
    ],
  },
  {
    title: "Armarios y Frentes",
    duration: "5 años",
    icon: Shield,
    coverage: [
      "Estructura y paneles",
      "Sistemas de corredera",
      "Herrajes y accesorios",
      "Acabados interiores",
    ],
  },
  {
    title: "Herrajes Premium",
    duration: "3 años",
    icon: Shield,
    coverage: [
      "Manillas y pomos",
      "Bisagras y cierres",
      "Acabados superficiales",
      "Funcionamiento mecánico",
    ],
  },
];

const services = [
  {
    icon: HeadphonesIcon,
    title: "Atención Telefónica",
    description: "Línea directa con nuestro equipo técnico para resolver cualquier duda o incidencia.",
    availability: "L-V 9:00-18:00",
  },
  {
    icon: Wrench,
    title: "Servicio Técnico",
    description: "Técnicos cualificados para reparaciones y ajustes en toda la península.",
    availability: "48-72h respuesta",
  },
  {
    icon: Truck,
    title: "Recambios Express",
    description: "Enviamos piezas de repuesto con la máxima rapidez para minimizar tiempos.",
    availability: "24-48h envío",
  },
  {
    icon: FileText,
    title: "Gestión de Incidencias",
    description: "Sistema de tickets para seguimiento completo de cada caso hasta su resolución.",
    availability: "Online 24/7",
  },
];

const process = [
  {
    step: 1,
    title: "Contacto",
    description: "Póngase en contacto con nuestro servicio postventa por teléfono, email o formulario web.",
  },
  {
    step: 2,
    title: "Diagnóstico",
    description: "Nuestro equipo técnico evaluará la incidencia y determinará la mejor solución.",
  },
  {
    step: 3,
    title: "Solución",
    description: "Procedemos con la reparación, reemplazo o envío de recambios según corresponda.",
  },
  {
    step: 4,
    title: "Seguimiento",
    description: "Realizamos seguimiento para asegurar su completa satisfacción con la resolución.",
  },
];

const faqs = [
  {
    question: "¿Cómo activo la garantía de mi producto?",
    answer: "La garantía se activa automáticamente con la factura de compra. Conserve siempre su factura como documento acreditativo. No es necesario ningún registro adicional.",
  },
  {
    question: "¿Qué NO cubre la garantía?",
    answer: "La garantía no cubre daños por mal uso, instalación incorrecta no realizada por CYDMA, modificaciones del producto, desgaste normal por uso, o daños causados por agentes externos (humedad extrema, golpes, etc.).",
  },
  {
    question: "¿Puedo ampliar el período de garantía?",
    answer: "Sí, ofrecemos programas de garantía extendida para proyectos Contract y clientes profesionales. Consulte con nuestro departamento comercial para más información.",
  },
  {
    question: "¿Realizan mantenimiento preventivo?",
    answer: "Sí, ofrecemos contratos de mantenimiento preventivo para grandes instalaciones (hoteles, oficinas, residenciales). Incluye revisiones periódicas y ajustes preventivos.",
  },
];

export default function Garantia() {
  return (
    <Layout>
      <SEOHead
        title="Garantía | Política de Garantía de Productos CYDMA"
        description="Consulta nuestra política de garantía. En CYDMA respaldamos todos nuestros productos con las máximas garantías de calidad y servicio postventa."
        canonical="https://cydma.es/garantia"
        noIndex={false}
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
                <BreadcrumbPage>Garantía y Servicio Postventa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Award className="h-4 w-4" />
              Compromiso de calidad
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Garantía y Servicio Postventa
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Su tranquilidad es nuestra prioridad. Respaldamos todos nuestros productos
              con garantías extendidas y un servicio postventa de primera clase.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <ScrollReveal variant="fade-up">
        <section className="py-10 bg-primary text-primary-foreground">
          <div className="container">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" stagger={0.1}>
              <StaggerItem variant="fade-up">
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-bold">Hasta 10 años</p>
                  <p className="text-sm opacity-80">de garantía</p>
                </div>
              </StaggerItem>
              <StaggerItem variant="fade-up">
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-bold">48-72h</p>
                  <p className="text-sm opacity-80">tiempo de respuesta</p>
                </div>
              </StaggerItem>
              <StaggerItem variant="fade-up">
                <div className="flex flex-col items-center">
                  <Wrench className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-bold">+50</p>
                  <p className="text-sm opacity-80">técnicos en península</p>
                </div>
              </StaggerItem>
              <StaggerItem variant="fade-up">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-bold">99%</p>
                  <p className="text-sm opacity-80">incidencias resueltas</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </ScrollReveal>

      {/* Warranty Cards */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                Nuestras Garantías
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cada producto CYDMA está respaldado por una garantía específica que cubre
                defectos de fabricación y funcionamiento.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {warranties.map((warranty) => (
              <StaggerItem key={warranty.title} variant="fade-up">
                <div className="bg-card rounded-xl border p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <warranty.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{warranty.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{warranty.duration}</p>
                  <ul className="space-y-2">
                    {warranty.coverage.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                Servicio Postventa
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un equipo dedicado a resolver cualquier incidencia con la máxima rapidez y profesionalidad.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.1}>
            {services.map((service) => (
              <StaggerItem key={service.title} variant="fade-up">
                <div className="bg-card rounded-xl border p-6 shadow-soft flex gap-5">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                        {service.availability}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Proceso sencillo y transparente para gestionar cualquier incidencia.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6" stagger={0.1}>
            {process.map((step, index) => (
              <StaggerItem key={step.step} variant="fade-up">
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal variant="fade-up">
              <div className="text-center mb-10">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Preguntas Frecuentes
                </h2>
              </div>
            </ScrollReveal>

            <StaggerContainer className="space-y-4" stagger={0.1}>
              {faqs.map((faq, index) => (
                <StaggerItem key={index} variant="fade-up">
                  <div className="bg-card rounded-lg border p-6 shadow-soft">
                    <h3 className="font-semibold mb-2 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground pl-8">{faq.answer}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                    ¿Necesita asistencia?
                  </h2>
                  <p className="opacity-90 mb-6">
                    Nuestro equipo de servicio postventa está a su disposición para ayudarle
                    con cualquier consulta o incidencia.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" variant="secondary" className="group">
                      <Link to="/contacto">
                        Contactar Soporte
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <StaggerContainer className="space-y-4" stagger={0.1}>
                  <StaggerItem variant="fade-up">
                    <a
                      href="tel:983625022"
                      className="flex items-center gap-4 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <Phone className="h-6 w-6" />
                      <div>
                        <p className="text-sm opacity-80">Teléfono de atención</p>
                        <p className="text-lg font-semibold">983 625 022</p>
                      </div>
                    </a>
                  </StaggerItem>
                  <StaggerItem variant="fade-up">
                    <a
                      href="mailto:postventa@cydma.es"
                      className="flex items-center gap-4 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <Mail className="h-6 w-6" />
                      <div>
                        <p className="text-sm opacity-80">Email de soporte</p>
                        <p className="text-lg font-semibold">postventa@cydma.es</p>
                      </div>
                    </a>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
