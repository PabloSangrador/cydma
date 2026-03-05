import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { getLocalBusinessSchema } from "@/components/seo/schemas";

export default function Contacto() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Mensaje enviado correctamente", {
      description: "Nos pondremos en contacto con usted lo antes posible.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <SEOHead
        title="Contacto | Habla con Nuestro Equipo Comercial"
        description="Contacta con CYDMA en Íscar, Valladolid. Atención comercial para profesionales, presupuestos y consultas sobre nuestro catálogo de carpintería industrial."
        canonical="https://cydma.es/contacto"
        schema={getLocalBusinessSchema()}
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
                <BreadcrumbPage>Contacto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl">
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Contacto
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Estamos aquí para ayudarle. Contacte con nosotros y nuestro equipo
              le atenderá a la mayor brevedad.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <ScrollReveal variant="fade-up">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Información de Contacto
                </h2>
              </ScrollReveal>
              <StaggerContainer className="space-y-6" stagger={0.1}>
                <StaggerItem variant="fade-up">
                  <a
                    href="tel:983625022"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-muted-foreground group-hover:text-primary transition-colors">
                        983 625 022
                      </p>
                    </div>
                  </a>
                </StaggerItem>

                <StaggerItem variant="fade-up">
                  <a
                    href="mailto:cydma@cydma.es"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Email General</p>
                      <p className="text-muted-foreground group-hover:text-primary transition-colors">
                        cydma@cydma.es
                      </p>
                    </div>
                  </a>
                </StaggerItem>

                <StaggerItem variant="fade-up">
                  <a
                    href="mailto:export@cydma.es"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Email Exportación</p>
                      <p className="text-muted-foreground group-hover:text-primary transition-colors">
                        export@cydma.es
                      </p>
                    </div>
                  </a>
                </StaggerItem>

                <StaggerItem variant="fade-up">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">
                        Íscar, Valladolid
                        <br />
                        España
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem variant="fade-up">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Horario</p>
                      <p className="text-muted-foreground">
                        Lunes a Viernes
                        <br />
                        9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="fade-up" delay={0.1}>
                <div className="bg-card rounded-lg border p-8 shadow-soft">
                  <h2 className="font-serif text-2xl font-semibold mb-2">
                    Solicitar Presupuesto
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Complete el formulario y nos pondremos en contacto con usted.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          placeholder="Su nombre"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input
                          id="apellidos"
                          name="apellidos"
                          placeholder="Sus apellidos"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="su@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="Su teléfono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Nombre de su empresa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="asunto">Asunto *</Label>
                      <Select name="asunto" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un asunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presupuesto">
                            Solicitud de presupuesto
                          </SelectItem>
                          <SelectItem value="catalogo">
                            Información del catálogo
                          </SelectItem>
                          <SelectItem value="contract">
                            Proyecto Contract
                          </SelectItem>
                          <SelectItem value="export">
                            Exportación internacional
                          </SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Describa su consulta o los productos en los que está interesado..."
                        rows={5}
                        required
                      />
                    </div>

                    <ScrollReveal variant="fade-up">
                      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                      </Button>
                    </ScrollReveal>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <ScrollReveal variant="scale" threshold={0.15}>
        <section className="h-[400px] bg-secondary/30 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
            <p className="text-lg font-semibold">Íscar, Valladolid</p>
            <p className="text-muted-foreground">España</p>
          </div>
        </section>
      </ScrollReveal>
    </Layout>
  );
}
