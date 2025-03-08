import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function Home() {
  const [search] = useSearch();
  const query = new URLSearchParams(search).get("q") || "";
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", query],
    queryFn: ({ signal }) => 
      fetch(`/api/products${query ? `?q=${query}` : ""}`, { signal })
        .then(res => res.json())
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
