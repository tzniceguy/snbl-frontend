import ProductCatalogue from "@/components/product-catalogue";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-7xl">
        <ProductCatalogue />
      </main>
    </div>
  );
}