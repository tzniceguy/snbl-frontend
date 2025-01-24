"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-context";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, dispatch } = useCart();

  const updateQuantity = React.useCallback(
    (id: number, newQuantity: number) => {
      if (newQuantity < 1) {
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
      } else {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { id, quantity: newQuantity },
        });
      }
    },
    [dispatch],
  );

  const removeItem = React.useCallback(
    (id: number) => {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    },
    [dispatch],
  );

  const { subtotal, delivery, total } = React.useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
    const delivery = cartItems.length > 0 ? 2500 : 0;
    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
    };
  }, [cartItems]);

  if (!cartItems) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={96} // Adjusted width
                      height={96} // Adjusted height
                      className="w-48 h-48 relative object-contain rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">Tsh {item.price}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="font-medium">
                        TZS{" "}
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Tsh. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>Tsh. {delivery.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Tsh. {total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
