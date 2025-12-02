import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const categories = ["All"]; 

export const ProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(slug || "All");
  const [sortBy, setSortBy] = useState("name");

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.products.categories(1, 50),
  });
  const dynamicCategories = ["All", ...(catData?.categories?.map((c: any) => c.slug) || [])];

  const { data, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, searchTerm],
    queryFn: () => api.products.list({
      search: searchTerm || undefined,
      categorySlug: selectedCategory !== "All" ? selectedCategory : undefined,
      page: 1,
      limit: 30,
    }),
  });

  const products = (data?.products || []).sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {slug ? `${slug} Products` : "All Products"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our wide selection of construction materials from verified suppliers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {dynamicCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {data?.total ?? 0} products found
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="text-center py-12">Loading products...</div>
        )}
        {!isLoading && products.map((product: any) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <img
                src={product.image || "https://via.placeholder.com/300x200?text=Product"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    (product.stockQuantity ?? 0) > 0 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {(product.stockQuantity ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{product.unit}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">per {product.unit}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {!isLoading && (products.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
