import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, Package, Truck, MapPin, Mail, User, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Order } from "../../../backend/src/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <Skeleton className="h-5 w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <Skeleton className="h-5 w-40 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Confirmacion() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [copied, setCopied] = useState(false);
  const { cart, clearCart } = useCart();
  const hasCleared = useRef(false);

  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => api.get<Order>(`/api/orders/${orderId}`),
    enabled: !!orderId,
    retry: false,
  });

  // Clear cart once after order confirmed
  useEffect(() => {
    if (order && cart?.id && !hasCleared.current) {
      hasCleared.current = true;
      clearCart(cart.id).catch(() => {
        // Ignore errors — cart will naturally expire
      });
    }
  }, [order, cart?.id, clearCart]);

  function handleCopyOrderId() {
    if (!order?.id) return;
    navigator.clipboard.writeText(order.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!orderId || isError) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-serif text-2xl font-semibold mb-2">Pedido no encontrado</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            {!orderId
              ? "No se especificó un número de pedido."
              : "No pudimos encontrar el pedido solicitado. Es posible que el enlace sea incorrecto."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading || !order) {
    return (
      <Layout>
        <OrderSkeleton />
      </Layout>
    );
  }

  const shippingLabel = order.shippingMethod === "express" ? "Express" : "Estándar";

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">

          {/* Animated success icon + heading */}
          <div className="text-center mb-12">
            <motion.div
              className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              >
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              ¡Pedido confirmado!
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg mb-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Gracias por tu pedido, {order.shippingName}
            </motion.p>

            {/* Order ID with copy button */}
            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-4 py-2 text-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <span className="text-muted-foreground">Número de pedido:</span>
              <span className="font-mono font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
              <button
                onClick={handleCopyOrderId}
                className="ml-1 p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Copiar número de pedido"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Two-column grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {/* Left: Order summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-serif text-lg font-semibold mb-5 flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Resumen del pedido
              </h2>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const name = item.product?.name ?? `Producto`;
                  const subtotal = item.unitPrice * item.quantity;
                  return (
                    <div key={item.id} className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.quantity} x {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground flex-shrink-0">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Envío ({shippingLabel})
                  </span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">TOTAL</span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Shipping details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-serif text-lg font-semibold mb-5 flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent" />
                Datos de envío
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Nombre</p>
                    <p className="text-sm text-foreground">{order.shippingName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Email</p>
                    <p className="text-sm text-foreground">{order.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Dirección</p>
                    <p className="text-sm text-foreground">{order.shippingAddress}</p>
                    <p className="text-sm text-foreground">
                      {order.shippingPostalCode} {order.shippingCity}
                    </p>
                    <p className="text-sm text-foreground">{order.shippingCountry}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Método de envío</p>
                    <Badge
                      className={cn(
                        "text-xs font-medium",
                        order.shippingMethod === "express"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-secondary text-muted-foreground border-border"
                      )}
                      variant="outline"
                    >
                      {shippingLabel}
                    </Badge>
                  </div>
                </div>

                {order.notes ? (
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Notas</p>
                      <p className="text-sm text-foreground">{order.notes}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
