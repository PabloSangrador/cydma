import { Hono } from "hono";
import { prisma } from "../db";
import { getStripe } from "../stripe";

const app = new Hono();

/**
 * POST /api/payments/create-intent
 * Creates a Stripe PaymentIntent for an existing order.
 * Amount is always calculated server-side from the order record.
 * Body: { orderId: string }
 */
app.post("/create-intent", async (c) => {
  const { orderId } = await c.req.json();

  if (!orderId) {
    return c.json({ error: { message: "orderId is required", code: "BAD_REQUEST" } }, 400);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    return c.json({ error: { message: "Order not found", code: "NOT_FOUND" } }, 404);
  }

  if (order.status === "paid") {
    return c.json({ error: { message: "Order already paid", code: "ALREADY_PAID" } }, 400);
  }

  try {
    const stripe = getStripe();

    // If already has a PaymentIntent, retrieve it (idempotent)
    if (order.stripePaymentIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      // If it's still usable, return the client secret
      if (existingIntent.status !== "succeeded" && existingIntent.status !== "canceled") {
        return c.json({
          data: {
            clientSecret: existingIntent.client_secret,
            paymentIntentId: existingIntent.id,
          },
        });
      }
    }

    // Create new PaymentIntent — amount is in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // euros -> cents
      currency: "eur",
      metadata: {
        orderId: order.id,
        orderEmail: order.email,
      },
    });

    // Store payment intent ID on order
    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return c.json({
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Stripe error:", err);
    return c.json(
      { error: { message: error.message ?? "Payment processing error", code: "STRIPE_ERROR" } },
      500
    );
  }
});

/**
 * POST /api/payments/webhook
 * Handles Stripe webhook events.
 * Must receive the raw request body (not parsed) for signature verification.
 */
app.post("/webhook", async (c) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not configured — skipping signature verification");
  }

  let event: ReturnType<typeof JSON.parse>;

  try {
    const stripe = getStripe();
    const rawBody = await c.req.text();
    const sig = c.req.header("stripe-signature") ?? "";

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody);
    }
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Webhook signature verification failed:", error.message);
    return c.json({ error: "Webhook signature verification failed" }, 400);
  }

  console.log(`Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error("payment_intent.succeeded: no orderId in metadata");
          break;
        }

        // Update order status and decrement stock in a transaction
        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          });

          if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
          }

          if (order.status === "paid") {
            // Already processed (idempotent)
            return;
          }

          // Update order to paid
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "paid",
              stripePaymentIntentId: paymentIntent.id,
            },
          });

          // Decrement stock for each item — floor at 0 to prevent negative stock
          for (const item of order.items) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            const newStock = Math.max(0, (product?.stock ?? 0) - item.quantity);
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: newStock },
            });
          }

          console.log(`Order ${orderId} marked as PAID. Stock decremented.`);
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "failed" },
          });
          console.log(`Order ${orderId} marked as FAILED`);
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object;
        console.warn(`Dispute created for charge ${dispute.charge}. Manual review required.`);
        // In production: send alert to admin, flag the order
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return c.json({ error: "Webhook processing error" }, 500);
  }

  return c.json({ received: true });
});

export default app;
