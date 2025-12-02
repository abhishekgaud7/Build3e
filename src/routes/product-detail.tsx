import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";


export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.products.get(id!),
    enabled: !!id,
  });

  const product = data?.product;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, quantity);
    toast.success("Added to cart");
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/products" className="text-blue-600 hover:text-blue-800">
          ← Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product?.image || "https://via.placeholder.com/400x300?text=Product"}
            alt={product?.name || "Product"}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
            <p className="text-gray-600 mb-4">{product?.unit}</p>
            <p className="text-gray-700">{product?.description}</p>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold text-blue-600">
                ₹{product ? product.price.toLocaleString() : 0}
              </span>
              <span className="text-gray-500">per {product?.unit}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                (product?.stockQuantity ?? 0) > 0 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {(product?.stockQuantity ?? 0) > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-500">
                  {quantity} {product?.unit}{quantity > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="text-lg font-medium">
              Total: ₹{(product ? product.price * quantity : 0).toLocaleString()}
            </div>

            <Button 
              onClick={handleAddToCart}
              disabled={(product?.stockQuantity ?? 0) <= 0}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Specifications */}
          {!isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Details provided by the seller.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* This would typically show related products from the same category */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Portland%20cement%20bag%20construction%20material%20industrial&image_size=square"
              alt="Portland Cement"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle className="text-lg">Portland Cement</CardTitle>
              <p className="text-sm text-gray-500">Cement</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">High grade Portland cement for all purposes</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">₹360</span>
                <span className="text-sm text-gray-500">per bag</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=construction%20sand%20pile%20building%20material%20industrial&image_size=square"
              alt="Construction Sand"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle className="text-lg">Construction Sand</CardTitle>
              <p className="text-sm text-gray-500">Sand</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">Fine quality river sand for construction</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">₹1,200</span>
                <span className="text-sm text-gray-500">per tonne</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=red%20clay%20bricks%20construction%20building%20materials&image_size=square"
              alt="Clay Bricks"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle className="text-lg">Clay Bricks</CardTitle>
              <p className="text-sm text-gray-500">Bricks</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">Traditional clay bricks for wall construction</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">₹8</span>
                <span className="text-sm text-gray-500">per piece</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
