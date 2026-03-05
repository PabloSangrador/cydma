import { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

// ── Inline Cart types (mirrors backend/src/types.ts) ───────────────────────────

interface CartItemProduct {
  id: string;
  slug: string;
  name: string;
  code: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategoryId: string | null;
  features: string[] | null;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: CartItemProduct;
}

interface Cart {
  id: string;
  sessionId: string | null;
  userId: string | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Session ID ─────────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem("cydma_session_id");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("cydma_session_id", id);
  return id;
}

// ── Context types ──────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  cartSubtotal: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: (cartId: string) => Promise<void>;
  sessionId: string;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart", sessionId],
    queryFn: () => api.get<Cart>(`/api/cart?sessionId=${sessionId}`),
    staleTime: 30_000,
  });

  const invalidateCart = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
  }, [queryClient, sessionId]);

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.post<Cart>("/api/cart/add", { productId, quantity, sessionId }),
    onSuccess: () => {
      invalidateCart();
      toast.success("Producto añadido al carrito");
      setIsCartOpen(true);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "No se pudo añadir al carrito");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.patch<Cart>(`/api/cart/items/${itemId}`, { quantity }),
    onSuccess: () => {
      invalidateCart();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "No se pudo actualizar la cantidad");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.delete<void>(`/api/cart/items/${itemId}`),
    onSuccess: () => {
      invalidateCart();
      toast.success("Producto eliminado del carrito");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "No se pudo eliminar el producto");
    },
  });

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const cartSubtotal =
    cart?.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;

  const addToCart = useCallback(
    async (productId: string, quantity: number) => {
      await addToCartMutation.mutateAsync({ productId, quantity });
    },
    [addToCartMutation]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItemMutation.mutateAsync(itemId);
        return;
      }
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
    },
    [updateQuantityMutation, removeItemMutation]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await removeItemMutation.mutateAsync(itemId);
    },
    [removeItemMutation]
  );

  const clearCartMutation = useMutation({
    mutationFn: (cartId: string) => api.delete<void>(`/api/cart/${cartId}`),
    onSuccess: () => {
      invalidateCart();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "No se pudo vaciar el carrito");
    },
  });

  const clearCart = useCallback(
    async (cartId: string) => {
      await clearCartMutation.mutateAsync(cartId);
    },
    [clearCartMutation]
  );

  return (
    <CartContext.Provider
      value={{
        cart: cart ?? null,
        cartCount,
        cartSubtotal,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        sessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
