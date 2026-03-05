# TESTING Guide — CYDMA E-Commerce

This document explains how to test the full e-commerce flow, verify Stripe webhook events locally, and validate each phase of the implementation.

---

## Prerequisites

- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:8000`
- [Stripe CLI](https://stripe.com/docs/stripe-cli) installed for webhook testing
- `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` configured in `.env` files

---

## Phase 1 — Database Verification

```bash
# Verify all tables exist
cd backend && bunx prisma studio   # Opens visual DB browser at localhost:5555

# Or query directly with SQLite
sqlite3 prisma/dev.db ".tables"
# Expected: Cart  CartItem  Order  OrderItem  Product  User

# Count seeded products
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Product;"
# Expected: 22

# Verify indexes
sqlite3 prisma/dev.db ".indexes"
```

**Verify via API:**
```bash
# List all products
curl http://localhost:3000/api/products | jq '.data | length'

# Filter by category
curl "http://localhost:3000/api/products?category=puertas" | jq '[.data[].name]'

# Get single product by slug
curl http://localhost:3000/api/products/puerta-lisa-l100
```

---

## Phase 2 — Shopping Cart

### Test guest cart persistence

```bash
# 1. Add item to cart (use a real product ID from DB)
PRODUCT_ID=$(curl -s http://localhost:3000/api/products/puerta-lisa-l100 | jq -r '.data.id')
SESSION_ID="test-session-$(date +%s)"

curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":2,\"sessionId\":\"$SESSION_ID\"}"

# 2. Retrieve cart (simulates page refresh)
curl "http://localhost:3000/api/cart?sessionId=$SESSION_ID"

# 3. Verify item count = 2
```

### Test stock validation

```bash
# Try to add more than available stock
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":999,\"sessionId\":\"$SESSION_ID\"}"
# Expected: 400 INSUFFICIENT_STOCK error
```

### Test update and remove

```bash
CART=$(curl -s "http://localhost:3000/api/cart?sessionId=$SESSION_ID")
ITEM_ID=$(echo $CART | jq -r '.data.items[0].id')

# Update quantity
curl -X PATCH http://localhost:3000/api/cart/items/$ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity":1}'

# Remove item (quantity = 0)
curl -X PATCH http://localhost:3000/api/cart/items/$ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity":0}'

# Verify cart is empty
curl "http://localhost:3000/api/cart?sessionId=$SESSION_ID" | jq '.data.items | length'
# Expected: 0
```

---

## Phase 3 — Checkout Flow

### End-to-end order creation test

```bash
# 1. Create a cart with items
SESSION_ID="checkout-test-$(date +%s)"
PRODUCT_ID=$(curl -s http://localhost:3000/api/products/puerta-lisa-l100 | jq -r '.data.id')

CART=$(curl -s -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1,\"sessionId\":\"$SESSION_ID\"}")

CART_ID=$(echo $CART | jq -r '.data.id')

# 2. Create order
IDEMPOTENCY_KEY="order-$(date +%s%N)"

ORDER=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"cartId\": \"$CART_ID\",
    \"idempotencyKey\": \"$IDEMPOTENCY_KEY\",
    \"shippingMethod\": \"standard\",
    \"shippingAddress\": {
      \"email\": \"test@cydma.es\",
      \"name\": \"Test User\",
      \"address\": \"Calle Test 123\",
      \"city\": \"Valladolid\",
      \"postalCode\": \"47001\",
      \"country\": \"ES\"
    }
  }")

echo $ORDER | jq '.data | {id, status, total}'
# Expected: { id: "...", status: "pending", total: 197.9 } (189 + 8.90 shipping)

ORDER_ID=$(echo $ORDER | jq -r '.data.id')

# 3. Test idempotency (same key = same order)
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"cartId\":\"$CART_ID\",\"idempotencyKey\":\"$IDEMPOTENCY_KEY\",\"shippingMethod\":\"standard\",\"shippingAddress\":{\"email\":\"test@cydma.es\",\"name\":\"Test\",\"address\":\"Test\",\"city\":\"Test\",\"postalCode\":\"12345\",\"country\":\"ES\"}}" \
  | jq '.data.id'
# Expected: same order ID as before

# 4. Validate stock
curl http://localhost:3000/api/orders/$ORDER_ID/validate-stock | jq '.data'
# Expected: { valid: true, issues: [] }
```

---

## Phase 4 — Stripe Payments

### Setup Stripe CLI for local webhook testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local backend
stripe listen --forward-to http://localhost:3000/api/payments/webhook
# This outputs a webhook signing secret — copy it to backend/.env as STRIPE_WEBHOOK_SECRET
```

### Test successful payment (card 4242 4242 4242 4242)

1. Navigate to `http://localhost:8000/catalogo/puertas`
2. Click any product → "Añadir al carrito"
3. Open cart drawer → "Finalizar pedido"
4. Fill checkout form:
   - Email: test@example.com
   - Name: Test User
   - Address: any valid address
5. Select shipping method → "Continuar"
6. Review order → "Proceder al pago"
7. In Stripe Payment Element, enter:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/28`
   - CVC: `123`
8. Click "Confirmar y pagar"
9. Expected: redirect to `/confirmacion?orderId=xxx`
10. Verify in terminal: Stripe CLI shows `payment_intent.succeeded` event

```bash
# Verify order status changed to "paid"
sqlite3 backend/prisma/dev.db "SELECT id, status, total FROM \"Order\" ORDER BY createdAt DESC LIMIT 1;"
# Expected: ...|paid|...

# Verify stock was decremented
sqlite3 backend/prisma/dev.db "SELECT slug, stock FROM Product WHERE slug='puerta-lisa-l100';"
# Expected: stock = 44 (was 45)
```

### Test declined payment (card 4000 0000 0000 0002)

Same flow as above but use card `4000 0000 0000 0002`.
Expected: error message "Su tarjeta fue rechazada." displayed in the payment form.
Order status should remain `pending` (webhook `payment_intent.payment_failed` will update to `failed`).

### Test 3D Secure (card 4000 0025 0000 3155)

Same flow but use card `4000 0025 0000 3155`.
Expected: 3D Secure authentication modal appears → complete → redirects to confirmation.

### Trigger webhook events manually via Stripe CLI

```bash
# Simulate successful payment for a specific PaymentIntent
stripe trigger payment_intent.succeeded

# Simulate failed payment
stripe trigger payment_intent.payment_failed

# Simulate dispute
stripe trigger charge.dispute.created
```

---

## Phase 5 — Edge Cases

### Out-of-stock between add-to-cart and checkout

```bash
# 1. Add an item with low stock to cart
LOW_STOCK_ID=$(curl -s "http://localhost:3000/api/products?category=acorazadas" | jq -r '.data[0].id')
# Manually set stock to 1 in DB
sqlite3 backend/prisma/dev.db "UPDATE Product SET stock=1 WHERE id='$LOW_STOCK_ID';"

# 2. Add 1 unit to cart
SESSION_ID="edge-test-$(date +%s)"
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$LOW_STOCK_ID\",\"quantity\":1,\"sessionId\":\"$SESSION_ID\"}"

# 3. Manually set stock to 0 in DB (simulating someone else buying it)
sqlite3 backend/prisma/dev.db "UPDATE Product SET stock=0 WHERE id='$LOW_STOCK_ID';"

# 4. Try to create order
CART=$(curl -s "http://localhost:3000/api/cart?sessionId=$SESSION_ID")
CART_ID=$(echo $CART | jq -r '.data.id')

curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"cartId\":\"$CART_ID\",\"idempotencyKey\":\"$(date +%s)\",\"shippingMethod\":\"standard\",\"shippingAddress\":{\"email\":\"test@test.com\",\"name\":\"Test\",\"address\":\"Test\",\"city\":\"Test\",\"postalCode\":\"12345\",\"country\":\"ES\"}}"
# Expected: 400 INSUFFICIENT_STOCK error

# Reset stock
sqlite3 backend/prisma/dev.db "UPDATE Product SET stock=5 WHERE id='$LOW_STOCK_ID';"
```

### Double-submit prevention (idempotency)

Already tested in Phase 3 above — same idempotency key returns same order.

### Double-payment prevention

```bash
# Create an order and mark it as paid manually
ORDER_ID="..."  # use a real order ID
sqlite3 backend/prisma/dev.db "UPDATE \"Order\" SET status='paid' WHERE id='$ORDER_ID';"

# Try to create payment intent for it
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"$ORDER_ID\"}"
# Expected: 400 "Este pedido ya ha sido pagado"
```

---

## Checking Server Logs

```bash
# Backend logs
tail -f backend/server.log

# Frontend build logs
tail -f webapp/server.log
```

---

## Resetting Test Data

```bash
# Clear all carts and orders (keep products)
sqlite3 backend/prisma/dev.db "DELETE FROM CartItem; DELETE FROM Cart; DELETE FROM OrderItem; DELETE FROM \"Order\";"

# Re-seed products
cd backend && bun run src/seed.ts
```
