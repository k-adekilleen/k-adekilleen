import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import EffectFilters from "@/components/effect-filters";
import type { Product } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get("q") || "";
  const effects = searchParams.getAll("effect");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", query, effects],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      effects.forEach(effect => params.append("effect", effect));

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
      console.log("Fetching products with URL:", url); // Debug log
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <EffectFilters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="space-y-8">
        <EffectFilters />
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EffectFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}