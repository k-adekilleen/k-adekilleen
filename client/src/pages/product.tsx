import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import ProductReviews from "@/components/product-reviews";

export default function ProductPage() {
  const { id } = useParams();
  const productId = parseInt(id);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: ({ signal }) => 
      fetch(`/api/products/${id}`, { signal }).then(res => res.json())
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex gap-4">
            <Badge className="text-lg px-4 py-1">{product.type}</Badge>
            <Badge variant="outline" className="text-lg px-4 py-1">
              THC: {product.thcContent}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-1">
              CBD: {product.cbdContent}
            </Badge>
          </div>

          <p className="text-lg">{product.description}</p>

          <div>
            <h2 className="font-semibold mb-2">Effects</h2>
            <div className="flex flex-wrap gap-2">
              {product.effects.map((effect) => (
                <Badge key={effect} variant="secondary">{effect}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Flavors</h2>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((flavor) => (
                <Badge key={flavor} variant="secondary">{flavor}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={productId} />
    </div>
  );
}