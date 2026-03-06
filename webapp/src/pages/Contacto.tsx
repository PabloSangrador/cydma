import { Link, useSearchParams } from "react-router-dom";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { getLocalBusinessSchema } from "@/components/seo/schemas";
import { api } from "@/lib/api";

const ASUNTO_OPTIONS = [
  { value: "presupuesto", label: "Solicitud de presupuesto" },
  { value: "catalogo", label: "Información del catálogo" },
  { value: "contract", label: "Proyecto Contract" },
  { value: "export", label: "Exportación internacional" },
  { value: "otro", label: "Otro" },
] as const;

type AsuntoValue = (typeof ASUNTO_OPTIONS)[number]["value"];

const VALID_ASUNTOS = ASUNTO_OPTIONS.map((o) => o.value);

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  email: z.string().email("Introduce un email válido"),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  asunto: z.enum(["presupuesto", "catalogo", "contract", "export", "otro"], {
    required_error: "Selecciona un asunto",
  }),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contacto() {
  const [searchParams] = useSearchParams();

  // Read URL params set by product pages (?asunto=presupuesto&producto=Nombre)
  const paramAsunto = searchParams.get("asunto");
  const paramProducto = searchParams.get("producto");

  const prefillAsunto: AsuntoValue | undefined =
    paramAsunto && VALID_ASUNTOS.includes(paramAsunto as AsuntoValue)
      ? (paramAsunto as AsuntoValue)
      : undefined;

  const prefillMensaje = paramProducto
    ? `Hola, me interesa obtener información y presupuesto sobre el siguiente producto:\n${paramProducto}\n\n`
    : undefined;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      asunto: prefillAsunto,
      mensaje: prefillMensaje,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post("/api/contact", data);
      toast.success("Mensaje enviado correctamente", {
        description: "Nos pondremos en contacto con usted lo antes posible.",
      });
      reset();
    } catch {
      toast.error("Error al enviar el mensaje", {
        description: "Por favor, inténtelo de nuevo o contáctenos por teléfono.",
      });
    }
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
                  <a href="tel:983625022" className="flex items-start gap-4 group">
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
                  <a href="mailto:cydma@cydma.es" className="flex items-start gap-4 group">
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
                  <a href="mailto:export@cydma.es" className="flex items-start gap-4 group">
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
                  {paramProducto ? (
                    <p className="text-sm text-accent font-medium mb-1">
                      Producto: {paramProducto}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mb-6">
                    Complete el formulario y nos pondremos en contacto con usted.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    {/* Nombre + Apellidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          placeholder="Su nombre"
                          {...register("nombre")}
                          aria-invalid={!!errors.nombre}
                        />
                        {errors.nombre ? (
                          <p className="text-sm text-destructive">{errors.nombre.message}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input
                          id="apellidos"
                          placeholder="Sus apellidos"
                          {...register("apellidos")}
                          aria-invalid={!!errors.apellidos}
                        />
                        {errors.apellidos ? (
                          <p className="text-sm text-destructive">{errors.apellidos.message}</p>
                        ) : null}
                      </div>
                    </div>

                    {/* Email + Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="su@email.com"
                          {...register("email")}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email ? (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="Su teléfono"
                          {...register("telefono")}
                        />
                      </div>
                    </div>

                    {/* Empresa */}
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        placeholder="Nombre de su empresa"
                        {...register("empresa")}
                      />
                    </div>

                    {/* Asunto — Controller para que shadcn Select funcione con react-hook-form */}
                    <div className="space-y-2">
                      <Label htmlFor="asunto">Asunto *</Label>
                      <Controller
                        name="asunto"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                            defaultValue={prefillAsunto}
                          >
                            <SelectTrigger id="asunto" aria-invalid={!!errors.asunto}>
                              <SelectValue placeholder="Seleccione un asunto" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASUNTO_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.asunto ? (
                        <p className="text-sm text-destructive">{errors.asunto.message}</p>
                      ) : null}
                    </div>

                    {/* Mensaje */}
                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        placeholder="Describa su consulta o los productos en los que está interesado..."
                        rows={5}
                        {...register("mensaje")}
                        aria-invalid={!!errors.mensaje}
                      />
                      {errors.mensaje ? (
                        <p className="text-sm text-destructive">{errors.mensaje.message}</p>
                      ) : null}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                    </Button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps — CYDMA, Íscar (Valladolid) */}
      <section className="h-[420px] w-full overflow-hidden">
        <iframe
          title="Ubicación CYDMA — Íscar, Valladolid"
          src="https://maps.google.com/maps?q=CYDMA+Is%CC%81car+Valladolid&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </Layout>
  );
}
