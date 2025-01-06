'use client';
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { relatedProducts } from "@/lib/data"

// Related Products Component
function RelatedProducts() {
 
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link 
            href={`/products/${product.title}`} 
            key={product.id}
            className="group"
          >
            <div className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48 md:h-64">
                <Image
                  src={product.img_url}
                  alt={product.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  TSh {product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Main Product Page Component
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = {
    title: `Product: ${slug}`,
    details: "This is a sample product description.",
    price: 1000,
    images: [
      "/sample-product.jpg",
      "/sample-product-2.jpg",
      "/sample-product-3.jpg",
      "/sample-product-4.jpg",
    ],
    vendor: "Vendor Name",
    sku: "SKU-1234",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="shadow-lg rounded-lg ">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            {/* Product Image Carousel */}
            <div className="mt-5 relative h-[400px] md:h-[600px] group">
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
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
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
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
                  {product.title}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">SKU: {product.sku}</p>
                <p className="text-xl font-semibold text-gray-900 mt-4">
                  TSh {product.price.toLocaleString()}
                </p>
                <p className="text-gray-600 mt-2">Vendor: {product.vendor}</p>
              </div>

              <div className="py-6 flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h2>
                <p className="text-gray-600">{product.details}</p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Buy Now
                </button>
                <button className="w-full bg-blue-100 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                  Lipa Kidogo Kidogo
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        <RelatedProducts />
      </div>
    </div>
  );
}