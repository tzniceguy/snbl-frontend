import React from "react";
import Image from "next/image";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Simulated product data (replace this with real API fetching)
  const product = {
    title: `Product: ${slug}`,
    details: "This is a sample product description.",
    price: 1000,
    image: "/sample-product.jpg",
    vendor: "Vendor Name",
    sku: "SKU-1234",
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-[400px] md:h-[600px] shadow-md p-2">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
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
    </div>
  );
}