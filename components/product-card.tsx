import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  name: string;
  price: number;
  image_url: string;
  slug: string;
}
export default function ProductCard({
  name,
  price,
  image_url,
  slug,
}: CardProps) {
  return (
    <Link
      href="/products/[slug]"
      as={`/products/${slug}`}
      className="group relative rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="group relative rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={image_url}
            alt={name}
            fill={true}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-md"
          />
        </div>

        {/* Content Container */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{name}</h3>
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
            Tsh: {price}
          </p>
        </div>
      </div>
    </Link>
  );
}
