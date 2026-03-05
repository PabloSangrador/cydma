import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calculator, DoorOpen, Square, Palette, Settings2, ArrowRight, Phone, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const doorTypes = [
  { id: "lisa", name: "Lisa", basePrice: 85, description: "Puerta lisa sin fresados" },
  { id: "fresada", name: "Fresada", basePrice: 120, description: "Con fresados decorativos" },
  { id: "lacada", name: "Lacada", basePrice: 180, description: "Lacada en RAL a elegir" },
  { id: "clasica", name: "Clásica", basePrice: 220, description: "Estilo tradicional" },
  { id: "vinilo2d", name: "Vinilo 2D", basePrice: 95, description: "Acabado vinilo plano" },
  { id: "vinilo3d", name: "Vinilo 3D", basePrice: 140, description: "Vinilo con relieve" },
  { id: "acorazada", name: "Acorazada", basePrice: 650, description: "Máxima seguridad" },
];

const finishes = [
  { id: "roble", name: "Roble Natural", multiplier: 1 },
  { id: "nogal", name: "Nogal", multiplier: 1.1 },
  { id: "wengue", name: "Wengué", multiplier: 1.1 },
  { id: "blanco", name: "Blanco", multiplier: 1 },
  { id: "gris", name: "Gris", multiplier: 1.05 },
  { id: "lacado", name: "Lacado RAL", multiplier: 1.3 },
];

const hardwareOptions = [
  { id: "basico", name: "Básico", price: 25, description: "Manilla estándar + bisagras" },
  { id: "estandar", name: "Estándar", price: 55, description: "Manilla diseño + bisagras reforzadas" },
  { id: "premium", name: "Premium", price: 95, description: "Herraje premium + cierre suave" },
  { id: "lujo", name: "Lujo", price: 150, description: "Herraje diseño exclusivo" },
];

export default function Calculadora() {
  const [doorType, setDoorType] = useState("");
  const [finish, setFinish] = useState("");
  const [hardware, setHardware] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [includeFrame, setIncludeFrame] = useState(true);
  const [includeInstallation, setIncludeInstallation] = useState(false);

  const selectedDoor = doorTypes.find(d => d.id === doorType);
  const selectedFinish = finishes.find(f => f.id === finish);
  const selectedHardware = hardwareOptions.find(h => h.id === hardware);

  const estimate = useMemo(() => {
    if (!selectedDoor || !selectedFinish || !selectedHardware) return null;

    const basePrice = selectedDoor.basePrice * selectedFinish.multiplier;
    const hardwarePrice = selectedHardware.price;
    const framePrice = includeFrame ? 45 : 0;
    const installationPrice = includeInstallation ? 80 : 0;

    const unitPrice = basePrice + hardwarePrice + framePrice + installationPrice;
    const subtotal = unitPrice * quantity;

    // Descuentos por volumen
    let discount = 0;
    if (quantity >= 50) discount = 0.15;
    else if (quantity >= 20) discount = 0.10;
    else if (quantity >= 10) discount = 0.05;

    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    return {
      unitPrice: unitPrice.toFixed(2),
      subtotal: subtotal.toFixed(2),
      discount: (discount * 100).toFixed(0),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    };
  }, [selectedDoor, selectedFinish, selectedHardware, quantity, includeFrame, includeInstallation]);

  const isComplete = doorType && finish && hardware && quantity > 0;

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
                <BreadcrumbPage>Calculadora de Presupuesto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calculator className="h-4 w-4" />
              Herramienta online
            </div>
            <h1 className="font-serif text-display-sm md:text-display text-foreground mb-4">
              Calculadora de Presupuesto
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Obtenga una estimación instantánea para su proyecto. Configure las opciones
              y reciba un presupuesto orientativo al momento.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Door Type */}
              <div className="bg-card rounded-xl border p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Tipo de Puerta</h3>
                    <p className="text-sm text-muted-foreground">Seleccione el modelo base</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {doorTypes.map((door) => (
                    <button
                      key={door.id}
                      onClick={() => setDoorType(door.id)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all",
                        doorType === door.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-accent hover:bg-secondary/50"
                      )}
                    >
                      <DoorOpen className={cn(
                        "h-6 w-6 mb-2",
                        doorType === door.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <p className="font-medium text-sm">{door.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Desde {door.basePrice}€
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Finish */}
              <div className="bg-card rounded-xl border p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Acabado</h3>
                    <p className="text-sm text-muted-foreground">Elija el acabado deseado</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFinish(f.id)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all",
                        finish === f.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-accent hover:bg-secondary/50"
                      )}
                    >
                      <Palette className={cn(
                        "h-5 w-5 mb-2",
                        finish === f.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <p className="font-medium text-sm">{f.name}</p>
                      {f.multiplier > 1 && (
                        <p className="text-xs text-accent mt-1">
                          +{((f.multiplier - 1) * 100).toFixed(0)}%
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Hardware */}
              <div className="bg-card rounded-xl border p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Herrajes</h3>
                    <p className="text-sm text-muted-foreground">Nivel de herrajes incluidos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hardwareOptions.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setHardware(h.id)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all",
                        hardware === h.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-accent hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Settings2 className={cn(
                            "h-5 w-5 mb-2",
                            hardware === h.id ? "text-primary" : "text-muted-foreground"
                          )} />
                          <p className="font-medium">{h.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-accent">+{h.price}€</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Options */}
              <div className="bg-card rounded-xl border p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Opciones adicionales</h3>
                    <p className="text-sm text-muted-foreground">Personalice su pedido</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad de puertas</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={999}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-lg font-medium"
                    />
                    {quantity >= 10 && (
                      <p className="text-xs text-accent">
                        Descuento por volumen aplicado
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFrame}
                        onChange={(e) => setIncludeFrame(e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">
                        Incluir cerco/marco (+45€/ud)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInstallation}
                        onChange={(e) => setIncludeInstallation(e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">
                        Incluir instalación (+80€/ud)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-card rounded-xl border p-6 shadow-soft">
                  <h3 className="font-serif text-xl font-semibold mb-6">
                    Resumen del Presupuesto
                  </h3>

                  {isComplete && estimate ? (
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo de puerta</span>
                          <span className="font-medium">{selectedDoor?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Acabado</span>
                          <span className="font-medium">{selectedFinish?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Herrajes</span>
                          <span className="font-medium">{selectedHardware?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cantidad</span>
                          <span className="font-medium">{quantity} uds</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Precio unitario</span>
                          <span>{estimate.unitPrice}€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{estimate.subtotal}€</span>
                        </div>
                        {parseInt(estimate.discount) > 0 && (
                          <div className="flex justify-between text-sm text-accent">
                            <span>Descuento ({estimate.discount}%)</span>
                            <span>-{estimate.discountAmount}€</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg font-semibold">Total estimado</span>
                          <span className="text-2xl font-bold text-primary">{estimate.total}€</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          * IVA no incluido. Presupuesto orientativo.
                        </p>
                      </div>

                      <Button asChild className="w-full mt-4" size="lg">
                        <Link to="/contacto">
                          Solicitar Presupuesto Definitivo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Complete la configuración para ver el presupuesto estimado</p>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-secondary/50 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">¿Necesita asesoramiento?</p>
                      <p className="text-muted-foreground mb-3">
                        Nuestro equipo puede ayudarle a configurar su pedido según sus necesidades específicas.
                      </p>
                      <a href="tel:983625022" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                        <Phone className="h-4 w-4" />
                        983 625 022
                      </a>
                    </div>
                  </div>
                </div>

                {/* Volume Discounts */}
                <div className="bg-card rounded-xl border p-5">
                  <h4 className="font-semibold text-sm mb-3">Descuentos por volumen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">10-19 unidades</span>
                      <span className="font-medium text-accent">5% dto.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">20-49 unidades</span>
                      <span className="font-medium text-accent">10% dto.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">+50 unidades</span>
                      <span className="font-medium text-accent">15% dto.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
