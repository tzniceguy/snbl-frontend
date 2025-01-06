import React from 'react'
import ProductCatalogue from '@/components/product-catalogue'

export default function Page() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="mx-auto max-w-7xl">
            <ProductCatalogue />
          </main>
        </div>
  )
}
