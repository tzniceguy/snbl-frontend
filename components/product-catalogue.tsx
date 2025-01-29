"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { getProducts } from "@/api/products";
import { Product } from "@/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductCatalogue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch products"),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load products: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!products.length) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="text-lg text-gray-600">No products available</div>
      </div>
    );
  }

  return (
    <section className="mb-16 w-full p-4 shadow-sm">
      <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image_url={product.image_url}
            slug={product.slug}
          />
        ))}
      </div>
    </section>
  );
}
