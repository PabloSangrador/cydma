import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart, X, Minus, Plus, Trash2, Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default function CartDrawer() {
  const { cart, cartCount, cartSubtotal, isCartOpen, setIsCartOpen, updateQuantity, removeItem } =
    useCart();
  const navigate = useNavigate();

  const items = cart?.items ?? [];

  function handleCheckout() {
    setIsCartOpen(false);
    navigate("/checkout");
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 bg-background border-border"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-accent" />
              <SheetTitle className="font-serif text-lg">Tu Carrito</SheetTitle>
              {cartCount > 0 && (
                <Badge className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-lg text-foreground mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">
                Explora nuestro catálogo y añade productos
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-2"
              onClick={() => setIsCartOpen(false)}
            >
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const product = item.product;
                  const image = product?.images?.[0];
                  return (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt={product?.name ?? "Producto"}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-accent font-medium tracking-wider uppercase mb-0.5">
                            {product?.code ?? ""}
                          </p>
                          <p className="text-sm font-medium text-foreground leading-tight truncate">
                            {product?.name ?? "Producto"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatPrice(item.unitPrice)} / ud.
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Qty + subtotal row */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-md p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded flex items-center justify-center hover:bg-background transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={cn(
                              "w-7 h-7 rounded flex items-center justify-center hover:bg-background transition-colors",
                              product?.stock !== undefined &&
                                item.quantity >= product.stock &&
                                "opacity-40 cursor-not-allowed"
                            )}
                            disabled={
                              product?.stock !== undefined && item.quantity >= product.stock
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        {/* Item subtotal */}
                        <span className="text-sm font-semibold text-foreground">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border space-y-4 bg-card/50">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-bold text-foreground">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {/* Shipping hint */}
              <p className="text-xs text-muted-foreground">
                Envío calculado en el checkout
              </p>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar pedido
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCartOpen(false)}
                >
                  Seguir comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
