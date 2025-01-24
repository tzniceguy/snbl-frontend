"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      router.replace("/checkout");
    }
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-4">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <Button onClick={() => router.push("/")}>Continue Shopping</Button>
    </div>
  );
}
