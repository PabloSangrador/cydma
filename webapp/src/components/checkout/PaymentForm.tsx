import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  returnUrl: string;
}

export function PaymentForm({ onSuccess, onError, returnUrl }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      // Payment failed or was cancelled — Stripe won't redirect
      onError(error.message ?? "Error al procesar el pago");
      setIsProcessing(false);
    } else {
      // Stripe will redirect to return_url on success
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Pago 100% seguro. Tus datos están encriptados con SSL.</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium text-base"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Procesando pago...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Confirmar y pagar
          </>
        )}
      </Button>
    </form>
  );
}
