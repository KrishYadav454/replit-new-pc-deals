import { Link } from "wouter";
import { useCart } from "../contexts/CartContext";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      licenseTypeId: 1, // Default to first license type (single user)
      product,
      licenseType: {
        id: 1,
        name: "Single User",
        description: "For individual users",
        price: product.price,
        maxUsers: 1,
      },
      quantity: 1,
    });
  };

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.isBestSeller && (
            <Badge variant="secondary" className="bg-accent text-white">Best Seller</Badge>
          )}
          {product.isPopular && (
            <Badge variant="secondary" className="bg-secondary text-white">Popular</Badge>
          )}
          {product.isNew && (
            <Badge variant="outline" className="bg-gray-200 text-gray-800">New</Badge>
          )}
        </div>
        <p className="mt-2 text-gray-600 line-clamp-3">{product.shortDescription}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
          <div className="flex space-x-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="outline" size="sm">Details</Button>
            </Link>
            <Button size="sm" onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
