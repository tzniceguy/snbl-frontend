import React from "react";

import { products } from "@/lib/data";
import ProductCard from "./product-card";
export default function ProductCatalogue(){
    
    return(
        <section className="mb-16 w-full p-4 shadow-sm">
          <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Cards would go here */}
            {products.map((product) => (
              <ProductCard key={product.id} title={product.title} price={product.price} image_url={product.img_url} />
            ))}
          </div>
        </section>
    )
}