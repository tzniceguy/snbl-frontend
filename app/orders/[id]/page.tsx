"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderDetail } from "@/api/orders";
import { Order, OrderStatus } from "@/api/types";

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.replace("/auth/login");
          return;
        }

        const orderDetail = await getOrderDetail(orderId, token);
        setOrder(orderDetail);
      } catch (error) {
        setError("Failed to retrieve order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, router]);

  const renderOrderStatus = (status: OrderStatus) => {
    const statusStyles = {
      completed: "text-green-600",
      pending: "text-yellow-600",
      cancelled: "text-red-600",
    };

    return (
      <span
        className={`capitalize font-semibold ${statusStyles[status] || ""}`}
      >
        {status}
      </span>
    );
  };

  const handleAddPayment = () => {
    router.push(`/payment/${orderId}`);
  };

  if (loading) {
    return <Skeleton className="h-screen w-full" />;
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error || "Order not found"}</p>
          <Button onClick={() => router.push("/orders")} className="mt-4">
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-semibold">
                    TSh {order?.amount?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-semibold">
                    TSh {order?.amount_paid?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance</span>
                  <span className="font-semibold text-red-600">
                    TSh {order?.amount_remaining?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  {renderOrderStatus(order.status as OrderStatus)}
                </div>

                {/* Add Payment Button */}
                {(order.status === "PENDING" ||
                  order.status === "partially_paid") && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleAddPayment}>Add Payment</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between border-b pb-2 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x TSh{" "}
                          {item.price?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <span className="font-semibold">
                        TSh{" "}
                        {(item.quantity * (item.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items in this order</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
