import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant="outline">{product.type}</Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-2">{product.brand}</div>
          <div className="flex gap-2 text-sm">
            <Badge variant="secondary">THC: {product.thcContent}</Badge>
            <Badge variant="secondary">CBD: {product.cbdContent}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
