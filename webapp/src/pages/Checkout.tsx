import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, Truck, ClipboardList, CreditCard, Check, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import type { Order, ShippingMethod } from "../../../backend/src/types";
import { cn } from "@/lib/utils";
import { StripeProvider } from "@/components/checkout/StripeProvider";
import { PaymentForm } from "@/components/checkout/PaymentForm";

// ── Shipping costs (mirrors backend/src/types.ts SHIPPING_COSTS) ──────────────
const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 8.9,
  express: 19.9,
};

// ── Local Zod v3 schema for react-hook-form (mirrors backend ShippingAddressSchema) ──
const ShippingAddressFormSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nombre demasiado corto"),
  address: z.string().min(5, "Dirección demasiado corta"),
  city: z.string().min(2, "Ciudad requerida"),
  postalCode: z.string().min(4, "Código postal inválido"),
  country: z.string().default("ES"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type ShippingFormData = z.infer<typeof ShippingAddressFormSchema>;

const STEPS = [
  { id: 1, label: "Contacto", icon: Package },
  { id: 2, label: "Envío", icon: Truck },
  { id: 3, label: "Resumen", icon: ClipboardList },
  { id: 4, label: "Pago", icon: CreditCard },
];

const COUNTRIES = [
  { code: "ES", name: "España" },
  { code: "PT", name: "Portugal" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Alemania" },
  { code: "IT", name: "Italia" },
  { code: "GB", name: "Reino Unido" },
  { code: "US", name: "Estados Unidos" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price);
}

// ── Step Progress Bar ─────────────────────────────────────────────────────────

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isCompleted
                    ? "bg-accent border-accent text-accent-foreground"
                    : isActive
                    ? "bg-background border-accent text-accent"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 1: Contact & Shipping Address ────────────────────────────────────────

function Step1Form({
  form,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
}) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const country = watch("country");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          Datos de contacto y envío
        </h2>
        <p className="text-sm text-muted-foreground">
          Introduce los datos para el envío de tu pedido.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="pedidos@empresa.com"
            {...register("email")}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            placeholder="Juan García López"
            {...register("name")}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            placeholder="Calle Mayor 123, 2ºA"
            {...register("address")}
            className={cn(errors.address && "border-destructive")}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            placeholder="Valladolid"
            {...register("city")}
            className={cn(errors.city && "border-destructive")}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>

        {/* Postal code */}
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Código postal *</Label>
          <Input
            id="postalCode"
            placeholder="47001"
            {...register("postalCode")}
            className={cn(errors.postalCode && "border-destructive")}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <Label htmlFor="country">País *</Label>
          <Select
            value={country ?? "ES"}
            onValueChange={(val) => setValue("country", val)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Seleccionar país" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+34 983 625 022"
            {...register("phone")}
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="notes">Notas del pedido</Label>
          <Textarea
            id="notes"
            placeholder="Instrucciones de entrega, referencias internas..."
            rows={3}
            {...register("notes")}
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Shipping Method ───────────────────────────────────────────────────

function Step2Shipping({
  selected,
  onSelect,
}: {
  selected: ShippingMethod;
  onSelect: (method: ShippingMethod) => void;
}) {
  const options: { id: ShippingMethod; label: string; desc: string; price: number }[] = [
    {
      id: "standard",
      label: "Envío estándar",
      desc: "3-5 días laborables",
      price: SHIPPING_COSTS.standard,
    },
    {
      id: "express",
      label: "Envío express",
      desc: "24-48 horas",
      price: SHIPPING_COSTS.express,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          Método de envío
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecciona la velocidad de entrega que prefieras.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={cn(
              "w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-200 text-left",
              selected === opt.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-border/80 bg-card"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  selected === opt.id ? "border-accent" : "border-muted-foreground"
                )}
              >
                {selected === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{opt.label}</p>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </div>
            </div>
            <span className="font-semibold text-foreground text-sm">
              {formatPrice(opt.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Order Summary ─────────────────────────────────────────────────────

function Step3Summary({
  shippingMethod,
  shippingData,
  onEditShipping,
}: {
  shippingMethod: ShippingMethod;
  shippingData: ShippingFormData;
  onEditShipping: () => void;
}) {
  const { cart, cartSubtotal } = useCart();
  const items = cart?.items ?? [];
  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const total = cartSubtotal + shippingCost;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          Resumen del pedido
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa tu pedido antes de confirmar el pago.
        </p>
      </div>

      {/* Items */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-foreground">
            Productos ({items.length})
          </p>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => {
            const image = item.product?.images?.[0];
            return (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt={item.product?.name ?? "Producto"}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground m-auto mt-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.product?.name ?? "Producto"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} ud. × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Dirección de envío</p>
          <button
            type="button"
            onClick={onEditShipping}
            className="text-xs text-accent hover:underline"
          >
            Editar
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{shippingData.name}</p>
        <p className="text-sm text-muted-foreground">{shippingData.address}</p>
        <p className="text-sm text-muted-foreground">
          {shippingData.postalCode} {shippingData.city},{" "}
          {COUNTRIES.find((c) => c.code === shippingData.country)?.name ?? shippingData.country}
        </p>
        {shippingData.phone && (
          <p className="text-sm text-muted-foreground">{shippingData.phone}</p>
        )}
      </div>

      {/* Totals */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Envío ({shippingMethod === "standard" ? "estándar" : "express"})
          </span>
          <span className="text-foreground">{formatPrice(shippingCost)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-accent text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Payment ───────────────────────────────────────────────────────────

function Step4Payment({
  orderId,
  shippingMethod,
  paymentError,
  onPaymentError,
  onReviewOrder,
}: {
  orderId: string;
  shippingMethod: ShippingMethod;
  paymentError: string | null;
  onPaymentError: (msg: string) => void;
  onReviewOrder: () => void;
}) {
  const { cartSubtotal } = useCart();
  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const total = cartSubtotal + shippingCost;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingIntent(true);
    setIntentError(null);

    api
      .post<{ clientSecret: string }>("/api/payments/create-intent", { orderId })
      .then((data) => {
        if (!cancelled) {
          setClientSecret(data.clientSecret);
          setIsLoadingIntent(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setIntentError(err.message ?? "No se pudo iniciar el pago.");
          setIsLoadingIntent(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const returnUrl = `${window.location.origin}/confirmacion?orderId=${orderId}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          Pago seguro
        </h2>
        <p className="text-sm text-muted-foreground">
          Completa tu pedido de forma segura.
        </p>
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <CreditCard className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Pago seguro con tarjeta</p>
          <p className="text-xs text-muted-foreground">
            Cifrado SSL 256-bit. Tus datos de pago están protegidos.
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4">
        <span className="font-medium text-foreground">Total a pagar</span>
        <span className="font-bold text-accent text-xl">{formatPrice(total)}</span>
      </div>

      {/* Payment element */}
      {isLoadingIntent ? (
        <div className="min-h-[180px] bg-card border border-border rounded-xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Preparando pago seguro...</p>
        </div>
      ) : intentError ? (
        <div className="min-h-[100px] bg-destructive/10 border border-destructive/30 rounded-xl flex items-center justify-center p-4">
          <p className="text-sm text-destructive text-center">{intentError}</p>
        </div>
      ) : clientSecret ? (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentForm
            returnUrl={returnUrl}
            onSuccess={() => toast.info("Redirigiendo...")}
            onError={onPaymentError}
          />
        </StripeProvider>
      ) : null}

      {/* Payment error alert with retry options */}
      {paymentError && (
        <div className="space-y-3">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {paymentError}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReviewOrder}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Revisar pedido
            </Button>
            <p className="text-xs text-muted-foreground">
              o corrije los datos de tarjeta y vuelve a intentarlo.
            </p>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Al confirmar, aceptas nuestras{" "}
        <a href="/legal" className="underline hover:text-foreground">
          condiciones de venta
        </a>{" "}
        y{" "}
        <a href="/privacidad" className="underline hover:text-foreground">
          política de privacidad
        </a>
        .
      </p>
    </div>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────────────

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartCount } = useCart();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isValidatingStock, setIsValidatingStock] = useState(false);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(ShippingAddressFormSchema),
    defaultValues: {
      country: "ES",
    },
  });

  // Creates order then validates stock and advances to payment step
  const createOrderMutation = useMutation({
    mutationFn: (payload: {
      cartId: string;
      shippingAddress: ShippingFormData;
      shippingMethod: ShippingMethod;
      idempotencyKey: string;
    }) => api.post<Order>("/api/orders", payload),
    onSuccess: async (order) => {
      // Validate stock before proceeding to payment
      setIsValidatingStock(true);
      try {
        const validation = await api.get<{
          valid: boolean;
          issues: Array<{ productName: string; requested: number; available: number }>;
        }>(`/api/orders/${order.id}/validate-stock`);

        if (!validation.valid) {
          const issueText = validation.issues
            .map((i) => `"${i.productName}" — solo quedan ${i.available} ud.`)
            .join(", ");
          toast.error(`Stock insuficiente: ${issueText}`);
          return;
        }
      } catch {
        // If validation endpoint fails, still allow proceeding — backend will guard
      } finally {
        setIsValidatingStock(false);
      }

      setOrderId(order.id);
      setStep(4);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "No se pudo crear el pedido. Inténtalo de nuevo.");
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
    }
    // Step 3 "Proceder al pago" → create order first
    if (step === 3) {
      if (!cart?.id) {
        toast.error("No se encontró tu carrito. Inténtalo de nuevo.");
        return;
      }
      const shippingData = form.getValues();
      createOrderMutation.mutate({
        cartId: cart.id,
        shippingAddress: shippingData,
        shippingMethod,
        idempotencyKey: crypto.randomUUID(),
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  // Empty cart guard — allow step 4 even if cart was cleared after order creation
  if (cartCount === 0 && step < 4 && !createOrderMutation.isPending) {
    return (
      <Layout>
        <div className="container py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Tu carrito está vacío</h1>
          <p className="text-muted-foreground">
            Añade productos antes de continuar al checkout.
          </p>
          <Button asChild>
            <a href="/catalogo">Ver catálogo</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/30 border-b">
        <div className="container py-6">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Finaliza tu pedido en {STEPS.length} pasos sencillos
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          <StepProgress currentStep={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 1 && <Step1Form form={form} />}
              {step === 2 && (
                <Step2Shipping selected={shippingMethod} onSelect={setShippingMethod} />
              )}
              {step === 3 && (
                <Step3Summary
                  shippingMethod={shippingMethod}
                  shippingData={form.getValues()}
                  onEditShipping={() => setStep(1)}
                />
              )}
              {step === 4 && orderId && (
                <Step4Payment
                  orderId={orderId}
                  shippingMethod={shippingMethod}
                  paymentError={paymentError}
                  onPaymentError={(msg) => setPaymentError(msg)}
                  onReviewOrder={() => { setPaymentError(null); setStep(3); }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons (for steps 1-3) */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={step === 1 ? () => navigate(-1) : handleBack}
                className="flex items-center gap-2"
                disabled={createOrderMutation.isPending}
              >
                <ChevronLeft className="h-4 w-4" />
                {step === 1 ? "Volver" : "Anterior"}
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando pedido...
                  </>
                ) : (
                  <>
                    {step === 3 ? "Proceder al pago" : "Continuar"}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Back button for step 4 */}
          {step === 4 && (
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Volver al resumen
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
