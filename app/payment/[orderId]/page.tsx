"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter, useParams } from "next/navigation";
import { getOrderDetail, processOrderPayment } from "@/api/orders";
import { Order } from "@/api/types";

// Tanzania Network prefixes
const NETWORK_PREFIXES = {
  "074": "M-PESA",
  "075": "M-PESA",
  "076": "M-PESA",
  "067": "yas",
  "065": "yas",
  "071": "AIRTEL-MONEY",
  "068": "AIRTEL-MONEY",
  "069": "AIRTEL-MONEY",
} as const;

type PaymentInfo = {
  phoneNumber: string;
  network: string;
  amount: string;
};

export default function PaymentPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    phoneNumber: "",
    network: "",
    amount: "",
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // If the number starts with '0', replace it with '255'
    if (cleanNumber.startsWith("0")) {
      return `255${cleanNumber.slice(1)}`;
    }

    // If the number doesn't start with '255', add it
    if (!cleanNumber.startsWith("255")) {
      return `255${cleanNumber}`;
    }

    return cleanNumber;
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.replace("/auth");
          return;
        }

        const orderDetail = await getOrderDetail(orderId, token);
        setOrder(orderDetail);
      } catch (error) {
        if (error instanceof Error) {
          setError("Failed to fetch order details");
        }
        console.error(error);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // Detect network based on phone number prefix
  useEffect(() => {
    const prefix = paymentInfo.phoneNumber.slice(0, 3);
    const detectedNetwork =
      NETWORK_PREFIXES[prefix as keyof typeof NETWORK_PREFIXES] || "";
    setPaymentInfo((prev) => ({ ...prev, network: detectedNetwork }));
  }, [paymentInfo.phoneNumber]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPaymentInfo((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPaymentInfo((prev) => ({ ...prev, amount: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentInfo.network) {
      alert("Invalid phone number or network not detected");
      return;
    }

    if (!order) {
      alert("Order details not available");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      // Process payment using the independent payment route
      const formattedPhoneNumber = formatPhoneNumber(paymentInfo.phoneNumber);
      const formattedNetwork = paymentInfo.network
        .toLowerCase()
        .replace("", "-");
      const response = await processOrderPayment(
        orderId,
        {
          order: parseInt(orderId),
          phone_number: formattedPhoneNumber,
          amount: parseFloat(paymentInfo.amount),
          payment_method: formattedNetwork,
        },
        token,
      );

      if (response.azampay_response.success) {
        // Update order state with new payment info
        setOrder((prevOrder) => ({
          ...prevOrder!,
          payment_status: response.order.payment_status,
          amount_paid: response.order.amount_paid,
          amount_remaining: response.order.remaining_balance,
          status: response.order.status,
        }));
        alert(
          `Payment request sent successfully!\n` +
            `Transaction ID: ${response.azampay_response.transactionId}\n` +
            `Status: ${response.payment.status}\n` +
            `${response.azampay_response.message}`,
        );
        // Redirect to order details page after a delay
        setTimeout(() => {
          router.push(`/orders/${orderId}`);
        }, 1000);
      } else {
        setError("Payment processing failed. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("Payment processing failed. Please try again.");
      }
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Payment</h1>
        <p className="text-gray-600 mb-4">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment for Order #{order.id}</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Money Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Remaining balance: TSh {order?.amount_remaining}
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Money Number</Label>
                  <Input
                    id="phoneNumber"
                    required
                    placeholder="Enter your phone number"
                    value={paymentInfo.phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                  {paymentInfo.network && (
                    <p className="text-sm text-green-600">
                      Network detected: {paymentInfo.network}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (TSh)</Label>
                  <Input
                    id="amount"
                    required
                    placeholder="Enter amount to pay"
                    value={paymentInfo.amount}
                    onChange={handleAmountChange}
                  />
                  <p className="text-sm text-gray-500">
                    Remaining balance: TSh {order?.amount_remaining}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isProcessing || !paymentInfo.network || !paymentInfo.amount
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay TSh ${paymentInfo.amount || "0"}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order?.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>
                    TSh {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="h-px bg-gray-200" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>TSh {order?.amount}</span>
              </div>
              {order?.amount_remaining > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Remaining Balance</span>
                  <span>TSh {order?.amount_remaining}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
