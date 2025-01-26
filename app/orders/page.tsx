"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOrders } from "@/api/orders";
import { Order } from "@/api/types";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const userOrders = await fetchOrders();
        setOrders(userOrders);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Session expired. Please log in again."
        ) {
          // Redirect to login page if session expires
          router.replace("/auth");
        } else {
          setError(
            "Unable to retrieve orders. Check your connection and try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();

    // Cleanup function to abort the request if the component unmounts
    return () => {
      // Optionally, you can abort the request here if using a library like Axios with cancel tokens
    };
  }, [router]); // Add fetchOrders to the dependency array if it's defined outside the component

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-40 w-full mb-4" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>Order Retrieval Error</CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-gray-500">No orders found</p>
            <Button onClick={() => router.push("/products")} className="mt-4">
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Orders list
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">TSh {order.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold">
                    TSh {order.amount_paid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining Balance</p>
                  <p className="font-semibold text-red-600">
                    TSh {order.amount - order.amount_paid}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
