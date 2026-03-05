import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Phone, Truck, Shield, ArrowRight, ArrowLeft, Info, DoorOpen, Ruler, Clock, Award, Package, ChevronDown, ChevronUp, Paintbrush, Layers, Sparkles } from "lucide-react";
import { categories, products, getProductsBySubcategory, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { getBreadcrumbSchema } from "@/components/seo/schemas";

// Obtener la categoría de puertas y sus subcategorías
const puertasCategory = categories.find(c => c.id === "puertas");
const subcategoriasPuertas = puertasCategory?.subcategories || [];

// Configuración de opciones adicionales
const medidasHueco = [
  { id: "2030x625", label: "2030 x 625 mm", precio: 0 },
  { id: "2030x725", label: "2030 x 725 mm", precio: 0 },
  { id: "2030x825", label: "2030 x 825 mm", precio: 0 },
  { id: "2030x925", label: "2030 x 925 mm", precio: 15 },
  { id: "2100x825", label: "2100 x 825 mm", precio: 25 },
  { id: "2100x925", label: "2100 x 925 mm", precio: 35 },
  { id: "medida-especial", label: "Medida especial", precio: 80 },
];

const espesoresTabique = [
  { id: "7-9", label: "7-9 cm", precio: 0 },
  { id: "9-11", label: "9-11 cm", precio: 5 },
  { id: "11-13", label: "11-13 cm", precio: 10 },
  { id: "13-15", label: "13-15 cm", precio: 15 },
  { id: "15-18", label: "15-18 cm", precio: 25 },
];

const direccionesApertura = [
  { id: "derecha-empujando", label: "Derecha empujando" },
  { id: "izquierda-empujando", label: "Izquierda empujando" },
];

const coloresHerraje = [
  { id: "inox", label: "Inox / Cromado", precio: 0 },
  { id: "negro-mate", label: "Negro Mate", precio: 15 },
  { id: "dorado", label: "Dorado", precio: 18 },
  { id: "bronce", label: "Bronce", precio: 18 },
];

const tiposCerradura = [
  { id: "picaporte", label: "Picaporte estándar", precio: 0 },
  { id: "magnetica", label: "Cierre magnético", precio: 25 },
  { id: "condena-wc", label: "Condena WC (baño)", precio: 12 },
  { id: "llave", label: "Con llave", precio: 35 },
];

const complementos = [
  { id: "molduras-70", label: "Molduras 70x10 mm", precio: 18 },
  { id: "molduras-90", label: "Molduras 90x10 mm", precio: 24 },
  { id: "burlete", label: "Burlete de goma", precio: 8 },
  { id: "bisagras-ocultas", label: "Bisagras ocultas", precio: 85 },
  { id: "espuma", label: "Espuma poliuretano", precio: 6 },
  { id: "silicona", label: "Silicona blanca", precio: 5 },
];

// Precios base por tipo de puerta
const preciosBase: Record<string, number> = {
  "lisas": 159,
  "fresadas": 189,
  "lacadas": 219,
  "clasicas": 199,
  "vinilo-2d": 149,
  "vinilo-3d": 169,
};

// Componente Step Header
function StepHeader({
  number,
  title,
  isCompleted,
  isExpanded,
  summary,
  onClick
}: {
  number: number;
  title: string;
  isCompleted: boolean;
  isExpanded: boolean;
  summary?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 px-5 hover:bg-secondary/30 transition-colors text-left"
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
        isCompleted
          ? "bg-green-500 text-white"
          : isExpanded
            ? "bg-accent text-accent-foreground"
            : "bg-secondary text-muted-foreground"
      )}>
        {isCompleted ? <Check className="h-5 w-5" /> : number}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium transition-colors",
          isExpanded ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </p>
        {!isExpanded && summary && (
          <p className="text-sm text-accent truncate">{summary}</p>
        )}
      </div>
      {isExpanded ? (
        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      ) : (
        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
}

export default function PuertasMedida() {
  // Ref para el configurador (scroll)
  const configuradorRef = useRef<HTMLDivElement>(null);

  // Estado del configurador - Categoría y Modelo
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(subcategoriasPuertas[0]?.id || "");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");

  // Resto de opciones
  const [medidaHueco, setMedidaHueco] = useState("2030x825");
  const [espesorTabique, setEspesorTabique] = useState("7-9");
  const [direccionApertura, setDireccionApertura] = useState("derecha-empujando");
  const [colorHerraje, setColorHerraje] = useState("inox");
  const [tipoCerradura, setTipoCerradura] = useState("picaporte");
  const [complementosSeleccionados, setComplementosSeleccionados] = useState<string[]>([]);

  // Estado de pasos expandidos
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1, 2]));

  const toggleStep = (step: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(step)) {
        newSet.delete(step);
      } else {
        newSet.add(step);
      }
      return newSet;
    });
  };

  // Obtener modelos de la categoría seleccionada
  const modelosDisponibles = useMemo(() => {
    if (!categoriaSeleccionada) return [];
    return getProductsBySubcategory("puertas", categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  // Auto-seleccionar primer modelo cuando cambia la categoría
  useMemo(() => {
    if (modelosDisponibles.length > 0 && !modelosDisponibles.find(m => m.id === modeloSeleccionado)) {
      setModeloSeleccionado(modelosDisponibles[0].id);
    }
  }, [modelosDisponibles, modeloSeleccionado]);

  // Obtener el producto seleccionado
  const productoSeleccionado = useMemo(() => {
    return products.find(p => p.id === modeloSeleccionado);
  }, [modeloSeleccionado]);

  // Toggle complementos
  const toggleComplemento = (id: string) => {
    setComplementosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Cálculo del precio estimado y desglose
  const precioBase = preciosBase[categoriaSeleccionada] || 189;
  const medidaSeleccionadaObj = medidasHueco.find(m => m.id === medidaHueco);
  const precioMedida = medidaSeleccionadaObj?.precio || 0;
  const espesorSeleccionadoObj = espesoresTabique.find(e => e.id === espesorTabique);
  const precioEspesor = espesorSeleccionadoObj?.precio || 0;
  const herrajeSeleccionadoObj = coloresHerraje.find(h => h.id === colorHerraje);
  const precioHerraje = herrajeSeleccionadoObj?.precio || 0;
  const cerraduraSeleccionadaObj = tiposCerradura.find(c => c.id === tipoCerradura);
  const precioCerradura = cerraduraSeleccionadaObj?.precio || 0;
  const precioComplementos = complementosSeleccionados.reduce((acc, compId) => {
    const comp = complementos.find(c => c.id === compId);
    return acc + (comp?.precio || 0);
  }, 0);

  const precioEstimado = precioBase + precioMedida + precioEspesor + precioHerraje + precioCerradura + precioComplementos;

  // Obtener nombre de categoría
  const categoriaNombre = subcategoriasPuertas.find(s => s.id === categoriaSeleccionada)?.name || "";

  // Ventajas con iconos
  const ventajas = [
    { icon: Ruler, titulo: "100% A Medida", descripcion: "Fabricación personalizada" },
    { icon: Clock, titulo: "10-15 Días", descripcion: "Plazo de entrega" },
    { icon: Award, titulo: "3 Años Garantía", descripcion: "Calidad certificada" },
    { icon: Package, titulo: "Todo Incluido", descripcion: "Block completo con herrajes" },
  ];

  // Tipos de puertas para sección comparativa SEO
  const tiposPuerta = [
    {
      id: "lacadas",
      titulo: "Puertas Lacadas",
      icon: Paintbrush,
      imagen: "/lac-214.jpeg",
      descripcion: "Acabado liso y uniforme en cualquier color. Las más demandadas para interiores modernos.",
      ventajas: ["Fácil mantenimiento", "Amplia gama de colores", "Acabado premium"],
      desde: 219,
    },
    {
      id: "fresadas",
      titulo: "Puertas Fresadas",
      icon: Layers,
      imagen: "/lac-505.jpeg",
      descripcion: "Diseños con relieve que aportan personalidad. Clásicas revisadas con un toque contemporáneo.",
      ventajas: ["Diseño diferenciador", "Múltiples patrones", "Estilo versátil"],
      desde: 189,
    },
    {
      id: "vinilo-2d",
      titulo: "Puertas en Vinilo",
      icon: Sparkles,
      imagen: "/lac-100.jpeg",
      descripcion: "Alta resistencia con acabados que imitan la madera natural. Relación calidad-precio excelente.",
      ventajas: ["Máxima resistencia", "Económicas", "Fácil limpieza"],
      desde: 149,
    },
  ];

  // Función para seleccionar tipo y scroll al configurador
  const seleccionarTipoYScroll = (tipoId: string) => {
    setCategoriaSeleccionada(tipoId);
    setModeloSeleccionado("");
    setExpandedSteps(new Set([1, 2]));

    // Scroll suave al configurador
    setTimeout(() => {
      configuradorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Verificar si cada paso está completado
  const stepsCompleted = {
    1: !!categoriaSeleccionada,
    2: !!modeloSeleccionado,
    3: !!medidaHueco && !!espesorTabique,
    4: !!direccionApertura,
    5: !!colorHerraje && !!tipoCerradura,
    6: true, // Complementos es opcional
  };

  // FAQs para SEO
  const faqs = [
    {
      pregunta: "¿Qué incluye una puerta block completa?",
      respuesta: "Nuestras puertas block incluyen la hoja de puerta acabada, cerco completo, juego de tapetas, pernios y manilla a elegir. Todo del mismo acabado y listo para instalar."
    },
    {
      pregunta: "¿Cuánto tarda el pedido?",
      respuesta: "El plazo de fabricación estándar es de 10 a 15 días laborables. Para medidas especiales o acabados personalizados puede ser de hasta 20 días."
    },
    {
      pregunta: "¿Puedo pedir puertas de medidas especiales?",
      respuesta: "Sí, fabricamos puertas con medidas totalmente personalizadas. Consulta con nuestro equipo para medidas fuera de los estándares."
    },
    {
      pregunta: "¿Hacéis envíos a toda España?",
      respuesta: "Sí, realizamos envíos a toda la península en 24-72 horas desde la fabricación, con embalaje profesional."
    },
    {
      pregunta: "¿Cuál es la diferencia entre puerta lacada y fresada?",
      respuesta: "Las puertas lacadas tienen un acabado liso y uniforme, mientras que las fresadas incorporan relieves y molduras en la superficie que aportan un diseño más elaborado."
    },
  ];

  // Schema.org FAQPage JSON-LD para SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.pregunta,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.respuesta
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    script.id = "faq-schema-puertas";

    // Eliminar si ya existe
    const existing = document.getElementById("faq-schema-puertas");
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("faq-schema-puertas");
      if (el) el.remove();
    };
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Puertas a Medida | Puertas Lacadas y Acorazadas Personalizadas"
        description="Puertas a medida para proyectos residenciales y comerciales. Lacadas, acorazadas y técnicas con acabados y dimensiones personalizados. CYDMA, Valladolid."
        canonical="https://cydma.es/puertas-medida"
        schema={getBreadcrumbSchema([{ name: "Puertas a Medida", url: "https://cydma.es/puertas-medida" }])}
      />
      {/* Hero compacto */}
      <section className="relative min-h-[40vh] max-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="/lac-214.jpeg"
            alt="Puerta lacada premium"
            className="w-full h-full object-cover"
          />
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 container text-center text-white py-12">
          {/* Breadcrumb integrado */}
          <nav className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white font-medium">Puertas a Medida</li>
            </ol>
          </nav>

          {/* Badge */}
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-accent/90 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
              Desde 159€
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Puertas a Medida
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Configura tu puerta ideal paso a paso. Elige modelo, acabado, medidas y herrajes.
          </motion.p>
        </div>
      </section>

      {/* Sección de Valor */}
      <section className="py-12 bg-card border-b">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" stagger={0.07} threshold={0.1}>
            {ventajas.map((ventaja) => (
              <StaggerItem key={ventaja.titulo} variant="scale">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                    <ventaja.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{ventaja.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{ventaja.descripcion}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Texto SEO */}
      <section className="py-10 bg-secondary/30">
        <div className="container max-w-4xl">
          <ScrollReveal variant="fade-up" threshold={0.2}>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Puertas de Interior Fabricadas a Tu Medida
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              En CYDMA fabricamos puertas de interior a medida para profesionales y particulares.
              Puertas lacadas, fresadas, clásicas y en vinilo con los mejores acabados del mercado.
              Configura tu puerta block completa con cerco, tapetas y herrajes incluidos.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sección comparativa SEO */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container">
          <ScrollReveal variant="fade-up" threshold={0.2}>
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
                ¿Qué tipo de puerta necesitas?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Descubre las características de cada tipo y elige la que mejor se adapte a tu proyecto.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" stagger={0.07} threshold={0.1}>
            {tiposPuerta.map((tipo) => (
              <StaggerItem key={tipo.id} variant="scale">
                <div className="bg-background rounded-2xl border shadow-soft overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  {/* Imagen */}
                  <div className="aspect-[4/3] bg-secondary/30 overflow-hidden relative">
                    <img
                      src={tipo.imagen}
                      alt={tipo.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge precio */}
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Desde {tipo.desde}€
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Icono y título */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <tipo.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {tipo.titulo}
                      </h3>
                    </div>

                    {/* Descripción */}
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {tipo.descripcion}
                    </p>

                    {/* Ventajas */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {tipo.ventajas.map((ventaja) => (
                        <li key={ventaja} className="flex items-center gap-2 text-sm text-foreground">
                          <Check className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{ventaja}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Botón */}
                    <Button
                      onClick={() => seleccionarTipoYScroll(tipo.id)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Configurar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contenido principal - Layout 2 columnas */}
      <section ref={configuradorRef} className="py-8 md:py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

            {/* Columna izquierda - Stepper (60%) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Título del configurador */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
                  <DoorOpen className="h-4 w-4" />
                  <span>Configurador de puertas</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Configura tu puerta
                </h2>
              </div>

              {/* Stepper Steps */}
              <div className="bg-card rounded-2xl border shadow-soft overflow-hidden divide-y">

                {/* Step 1: Tipo de puerta */}
                <div>
                  <StepHeader
                    number={1}
                    title="Tipo de puerta"
                    isCompleted={stepsCompleted[1]}
                    isExpanded={expandedSteps.has(1)}
                    summary={categoriaNombre}
                    onClick={() => toggleStep(1)}
                  />
                  {expandedSteps.has(1) && (
                    <div className="px-5 pb-5">
                      <RadioGroup
                        value={categoriaSeleccionada}
                        onValueChange={(value) => {
                          setCategoriaSeleccionada(value);
                          setModeloSeleccionado("");
                        }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                      >
                        {subcategoriasPuertas.map((subcategoria) => (
                          <label
                            key={subcategoria.id}
                            className={cn(
                              "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                              categoriaSeleccionada === subcategoria.id
                                ? "border-accent bg-accent/5 shadow-md"
                                : "border-border hover:border-accent/40 hover:bg-secondary/30"
                            )}
                          >
                            <RadioGroupItem value={subcategoria.id} className="sr-only" />
                            <span className="font-medium text-sm">{subcategoria.name}</span>
                            {subcategoria.description && (
                              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {subcategoria.description}
                              </span>
                            )}
                            <span className="text-xs text-accent font-medium mt-2">
                              Desde {preciosBase[subcategoria.id] || 189}€
                            </span>
                            {categoriaSeleccionada === subcategoria.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-accent-foreground" />
                              </div>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {/* Step 2: Modelo */}
                <div>
                  <StepHeader
                    number={2}
                    title={`Modelo ${categoriaNombre ? `(${categoriaNombre})` : ""}`}
                    isCompleted={stepsCompleted[2]}
                    isExpanded={expandedSteps.has(2)}
                    summary={productoSeleccionado?.name}
                    onClick={() => toggleStep(2)}
                  />
                  {expandedSteps.has(2) && (
                    <div className="px-5 pb-5">
                      {modelosDisponibles.length > 0 ? (
                        <RadioGroup
                          value={modeloSeleccionado}
                          onValueChange={setModeloSeleccionado}
                          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                        >
                          {modelosDisponibles.map((modelo) => (
                            <label
                              key={modelo.id}
                              className={cn(
                                "relative flex flex-col rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden group",
                                modeloSeleccionado === modelo.id
                                  ? "border-accent ring-2 ring-accent/20 shadow-lg scale-[1.02]"
                                  : "border-border hover:border-accent/40 hover:shadow-md"
                              )}
                            >
                              <RadioGroupItem value={modelo.id} className="sr-only" />
                              {/* Imagen más grande */}
                              <div className="aspect-[3/4] bg-secondary/30 overflow-hidden">
                                <img
                                  src={modelo.images[0]}
                                  alt={modelo.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              {/* Info */}
                              <div className="p-3 bg-card">
                                <span className="font-semibold text-sm block truncate">{modelo.name}</span>
                                <span className="text-xs text-muted-foreground">{modelo.code}</span>
                              </div>
                              {modeloSeleccionado === modelo.id && (
                                <div className="absolute top-3 right-3 w-7 h-7 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                      ) : (
                        <p className="text-sm text-muted-foreground py-4">
                          Selecciona primero un tipo de puerta
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 3: Medidas */}
                <div>
                  <StepHeader
                    number={3}
                    title="Medidas"
                    isCompleted={stepsCompleted[3]}
                    isExpanded={expandedSteps.has(3)}
                    summary={medidaSeleccionadaObj?.label}
                    onClick={() => toggleStep(3)}
                  />
                  {expandedSteps.has(3) && (
                    <div className="px-5 pb-5 space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Medida del hueco</Label>
                        <RadioGroup
                          value={medidaHueco}
                          onValueChange={setMedidaHueco}
                          className="grid grid-cols-2 gap-2"
                        >
                          {medidasHueco.map((medida) => (
                            <label
                              key={medida.id}
                              className={cn(
                                "relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                                medidaHueco === medida.id
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/40 hover:bg-secondary/20"
                              )}
                            >
                              <RadioGroupItem value={medida.id} className="sr-only" />
                              <span className="text-sm">{medida.label}</span>
                              {medida.precio > 0 && (
                                <span className="text-xs font-medium text-accent">+{medida.precio}€</span>
                              )}
                              {medidaHueco === medida.id && (
                                <Check className="h-4 w-4 text-accent ml-2 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                          Mide el hueco de la pared (alto x ancho)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Espesor del tabique</Label>
                        <RadioGroup
                          value={espesorTabique}
                          onValueChange={setEspesorTabique}
                          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                        >
                          {espesoresTabique.map((espesor) => (
                            <label
                              key={espesor.id}
                              className={cn(
                                "relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                                espesorTabique === espesor.id
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/40 hover:bg-secondary/20"
                              )}
                            >
                              <RadioGroupItem value={espesor.id} className="sr-only" />
                              <span className="text-sm">{espesor.label}</span>
                              {espesor.precio > 0 && (
                                <span className="text-xs font-medium text-accent">+{espesor.precio}€</span>
                              )}
                              {espesorTabique === espesor.id && (
                                <Check className="h-4 w-4 text-accent ml-2 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Dirección de apertura */}
                <div>
                  <StepHeader
                    number={4}
                    title="Dirección de apertura"
                    isCompleted={stepsCompleted[4]}
                    isExpanded={expandedSteps.has(4)}
                    summary={direccionesApertura.find(d => d.id === direccionApertura)?.label}
                    onClick={() => toggleStep(4)}
                  />
                  {expandedSteps.has(4) && (
                    <div className="px-5 pb-5">
                      <RadioGroup value={direccionApertura} onValueChange={setDireccionApertura} className="grid grid-cols-2 gap-4">
                        {direccionesApertura.map((dir) => (
                          <label
                            key={dir.id}
                            className={cn(
                              "relative flex flex-col items-center p-5 rounded-xl border-2 cursor-pointer transition-all",
                              direccionApertura === dir.id
                                ? "border-accent bg-accent/5 shadow-md"
                                : "border-border hover:border-accent/40 hover:bg-secondary/20"
                            )}
                          >
                            <RadioGroupItem value={dir.id} className="sr-only" />
                            <div className="w-16 h-24 border-2 border-current rounded relative mb-3">
                              {dir.id === "derecha-empujando" ? (
                                <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6" />
                              ) : (
                                <ArrowLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6" />
                              )}
                              <div className={`absolute top-2 ${dir.id === "derecha-empujando" ? "right-1" : "left-1"} w-1.5 h-1.5 rounded-full bg-current`} />
                            </div>
                            <span className="font-medium text-sm text-center">{dir.label}</span>
                            {direccionApertura === dir.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-accent-foreground" />
                              </div>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {/* Step 5: Herrajes y cerradura */}
                <div>
                  <StepHeader
                    number={5}
                    title="Herrajes y cerradura"
                    isCompleted={stepsCompleted[5]}
                    isExpanded={expandedSteps.has(5)}
                    summary={`${herrajeSeleccionadoObj?.label} · ${cerraduraSeleccionadaObj?.label}`}
                    onClick={() => toggleStep(5)}
                  />
                  {expandedSteps.has(5) && (
                    <div className="px-5 pb-5 space-y-5">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Color de herrajes</Label>
                        <RadioGroup value={colorHerraje} onValueChange={setColorHerraje} className="grid grid-cols-2 gap-2">
                          {coloresHerraje.map((herraje) => (
                            <label
                              key={herraje.id}
                              className={cn(
                                "relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                                colorHerraje === herraje.id
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/40 hover:bg-secondary/20"
                              )}
                            >
                              <RadioGroupItem value={herraje.id} className="sr-only" />
                              <span className="text-sm">{herraje.label}</span>
                              {herraje.precio > 0 && (
                                <span className="text-xs font-medium text-accent">+{herraje.precio}€</span>
                              )}
                              {colorHerraje === herraje.id && (
                                <Check className="h-4 w-4 text-accent ml-2 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Tipo de cerradura</Label>
                        <RadioGroup value={tipoCerradura} onValueChange={setTipoCerradura} className="grid grid-cols-2 gap-2">
                          {tiposCerradura.map((cerradura) => (
                            <label
                              key={cerradura.id}
                              className={cn(
                                "relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                                tipoCerradura === cerradura.id
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/40 hover:bg-secondary/20"
                              )}
                            >
                              <RadioGroupItem value={cerradura.id} className="sr-only" />
                              <span className="text-sm">{cerradura.label}</span>
                              {cerradura.precio > 0 && (
                                <span className="text-xs font-medium text-accent">+{cerradura.precio}€</span>
                              )}
                              {tipoCerradura === cerradura.id && (
                                <Check className="h-4 w-4 text-accent ml-2 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 6: Complementos */}
                <div>
                  <StepHeader
                    number={6}
                    title="Complementos (opcional)"
                    isCompleted={stepsCompleted[6]}
                    isExpanded={expandedSteps.has(6)}
                    summary={complementosSeleccionados.length > 0 ? `${complementosSeleccionados.length} seleccionados` : "Ninguno"}
                    onClick={() => toggleStep(6)}
                  />
                  {expandedSteps.has(6) && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {complementos.map((comp) => (
                          <label
                            key={comp.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                              complementosSeleccionados.includes(comp.id)
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/40 hover:bg-secondary/20"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={complementosSeleccionados.includes(comp.id)}
                                onCheckedChange={() => toggleComplemento(comp.id)}
                                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                              />
                              <span className="text-sm">{comp.label}</span>
                            </div>
                            <span className="text-xs font-medium text-accent">+{comp.precio}€</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Panel sticky (40%) */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                {/* Imagen del producto */}
                <div className="bg-card rounded-2xl border shadow-soft overflow-hidden">
                  <div className="aspect-[4/5] bg-secondary/30 relative">
                    {productoSeleccionado ? (
                      <img
                        src={productoSeleccionado.images[0]}
                        alt={productoSeleccionado.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <DoorOpen className="h-20 w-20 opacity-20" />
                      </div>
                    )}
                    {/* Badge modelo */}
                    {productoSeleccionado && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
                        {productoSeleccionado.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel de precio */}
                <div className="bg-card rounded-2xl border shadow-soft p-6 space-y-5">
                  {/* Precio grande */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Precio estimado</p>
                    <div className="text-4xl font-serif font-bold text-accent">
                      {precioEstimado.toLocaleString("es-ES")} €
                    </div>
                  </div>

                  {/* Desglose */}
                  <div className="space-y-2 text-sm border-t border-b py-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Puerta {categoriaNombre}:</span>
                      <span className="font-medium">{precioBase}€</span>
                    </div>
                    {precioMedida > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medida especial:</span>
                        <span className="font-medium text-accent">+{precioMedida}€</span>
                      </div>
                    )}
                    {precioEspesor > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Espesor tabique:</span>
                        <span className="font-medium text-accent">+{precioEspesor}€</span>
                      </div>
                    )}
                    {precioHerraje > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Herraje {herrajeSeleccionadoObj?.label}:</span>
                        <span className="font-medium text-accent">+{precioHerraje}€</span>
                      </div>
                    )}
                    {precioCerradura > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cerradura:</span>
                        <span className="font-medium text-accent">+{precioCerradura}€</span>
                      </div>
                    )}
                    {precioComplementos > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complementos:</span>
                        <span className="font-medium text-accent">+{precioComplementos}€</span>
                      </div>
                    )}
                  </div>

                  {/* Iconos de envío y garantía */}
                  <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-accent" />
                      <span>10-15 días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span>3 años</span>
                    </div>
                  </div>

                  {/* Botón CTA */}
                  <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    <Link to="/contacto">Solicitar Presupuesto</Link>
                  </Button>

                  {/* Nota */}
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Info className="h-3 w-3" />
                    Precio orientativo. IVA incluido.
                  </p>
                </div>

                {/* Características */}
                <div className="bg-secondary/50 rounded-2xl p-5 hidden lg:block">
                  <h3 className="font-semibold mb-3 text-sm">Incluido en tu puerta block</h3>
                  <ul className="space-y-2">
                    {["Hoja de puerta a medida", "Cerco completo", "Tapetas", "Herrajes (pernios y manilla)"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA móvil fijo con glass morphism */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 p-4 shadow-2xl">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Precio estimado</p>
              <div className="text-2xl font-serif font-bold text-accent">
                {precioEstimado.toLocaleString("es-ES")} €
              </div>
            </div>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link to="/contacto">Presupuesto</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Espacio para el CTA fijo en móvil */}
      <div className="lg:hidden h-24" />

      {/* Características incluidas */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-center mb-8">
            Incluido en tu puerta block
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Hoja de puerta", desc: "A medida y acabada" },
              { label: "Cerco completo", desc: "Del mismo acabado" },
              { label: "Tapetas", desc: "Juego completo" },
              { label: "Herrajes", desc: "Pernios y manilla" },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-xl p-5 text-center shadow-soft">
                <Check className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección FAQ */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground">
              Resolvemos tus dudas sobre nuestras puertas a medida
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-background rounded-xl border shadow-soft px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-serif text-base md:text-lg font-medium py-5 hover:no-underline [&[data-state=open]]:text-accent">
                  {faq.pregunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container text-center">
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">
              ¿Necesitas ayuda con tu configuración?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Nuestro equipo te asesorará para elegir la puerta perfecta para tu espacio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contacto">Contactar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="tel:983625022">
                  <Phone className="h-4 w-4 mr-2" />
                  983 625 022
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
