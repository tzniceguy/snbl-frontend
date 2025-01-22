"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/components/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface CheckoutInfo {
  phoneNumber: string;
  network: string;
  location: string;
  amount: string;
  remainingBalance: number;
}

// Tanzania Network prefixes
const NETWORK_PREFIXES = {
  "074": "M-PESA",
  "075": "M-PESA",
  "076": "M-PESA",
  "067": "TIGO PESA",
  "065": "TIGO PESA",
  "071": "AIRTEL MONEY",
  "068": "AIRTEL MONEY",
  "069": "AIRTEL MONEY",
} as const;

export default function CheckoutPage() {
  const { cartItems, dispatch } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({
    phoneNumber: "",
    network: "",
    location: "",
    amount: "",
    remainingBalance: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          router.replace("/auth");
          return;
        }
      } catch (error) {
        console.error("fetching acces tokens failed:", error);
      }
    };
    checkAuth();
  }, []);

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  // Set initial remaining balance
  useEffect(() => {
    setCheckoutInfo((prev) => ({ ...prev, remainingBalance: total }));
  }, [total]);

  // Detect network based on phone number prefix
  useEffect(() => {
    const prefix = checkoutInfo.phoneNumber.slice(0, 3);
    const detectedNetwork =
      NETWORK_PREFIXES[prefix as keyof typeof NETWORK_PREFIXES] || "";
    setCheckoutInfo((prev) => ({ ...prev, network: detectedNetwork }));
  }, [checkoutInfo.phoneNumber]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCheckoutInfo((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const numValue = Number(value);
    if (numValue <= total) {
      setCheckoutInfo((prev) => ({
        ...prev,
        amount: value,
        remainingBalance: total - numValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutInfo.network) {
      alert("Invalid phone number or network not detected");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (checkoutInfo.remainingBalance === 0) {
        // If fully paid, clear cart
        dispatch({ type: "LOAD_CART", payload: [] });
        window.location.href = "/checkout/success";
      } else {
        // If partially paid, show remaining balance
        alert(
          `Payment successful. Remaining balance: TSh ${checkoutInfo.remainingBalance.toFixed(2)}`,
        );
        setCheckoutInfo((prev) => ({
          ...prev,
          amount: "",
          phoneNumber: "",
        }));
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

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
                  Partial payments are accepted. Remaining balance: TSh{" "}
                  {checkoutInfo.remainingBalance.toFixed(2)}
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Money Number</Label>
                  <Input
                    id="phoneNumber"
                    required
                    placeholder="Enter your phone number"
                    value={checkoutInfo.phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                  {checkoutInfo.network && (
                    <p className="text-sm text-green-600">
                      Network detected: {checkoutInfo.network}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (TSh)</Label>
                  <Input
                    id="amount"
                    required
                    placeholder="Enter amount to pay"
                    value={checkoutInfo.amount}
                    onChange={handleAmountChange}
                  />
                  <p className="text-sm text-gray-500">
                    Total to pay: TSh {total.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Delivery Location</Label>
                  <Input
                    id="location"
                    required
                    placeholder="Enter your delivery location in Tanzania"
                    value={checkoutInfo.location}
                    onChange={(e) =>
                      setCheckoutInfo((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isProcessing ||
                    !checkoutInfo.network ||
                    !checkoutInfo.amount
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay TSh ${checkoutInfo.amount || "0"}`
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
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    TSh {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="h-px bg-gray-200" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>TSh {total.toFixed(2)}</span>
              </div>
              {checkoutInfo.remainingBalance > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Remaining Balance</span>
                  <span>TSh {checkoutInfo.remainingBalance.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
