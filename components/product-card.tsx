import React from "react";
import Image from "next/image";

interface cardProps {
    title : string;
    price : number;
    image_url : string;
}
export default function ProductCard({title,price,image_url}:cardProps) {
  return (
    <div className="group relative rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={image_url}
          alt={title} fill={true}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-md"
        />
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">Tsh: {price}</p>
      </div>
    </div>
  );
}