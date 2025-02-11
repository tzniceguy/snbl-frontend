"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductDetail } from "@/api/products";
import { useCart } from "@/components/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/api/types";

// Main Product Page Component
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { dispatch } = useCart();
  const router = useRouter();

  // Fetch Product Data
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetail(slug);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || "Product not found"}</div>
      </div>
    );
  }

  const productImages = [product.image_url];
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  const addToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        image_url: product.image_url,
        quantity: quantity,
        sku: product.sku,
        vendor_name: product.vendor_name,
      },
    });

    toast.success(`Added ${product.name} to cart`);
    router.push("/cart");
  };

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + change)));
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="shadow-lg rounded-lg">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            {/* Product Image Carousel */}
            <div className="mt-5 relative h-[400px] md:h-[600px] group">
              <Image
                src={productImages[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {/* Navigation Buttons */}
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 md:p-8 flex flex-col">
              <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">SKU: {product.sku}</p>
                <p className="text-xl font-semibold text-gray-900 mt-4">
                  TSh {product.price.toLocaleString()}
                </p>
                <p className="text-gray-600 mt-2">
                  Vendor: {product.vendor_name}
                </p>

                {/* Quantity Selector */}
                <div className="mt-4 flex items-center gap-4">
                  <label htmlFor="quantity" className="text-gray-600">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(-1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                </div>
              </div>

              <div className="py-6 flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={addToCart}
                  className="w-full bg-blue-100 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={product.stock === 0}
                >
                  Lipa Kidogo Kidogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
