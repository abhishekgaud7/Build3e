import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { HardHat, BrickWall, Package, Truck } from "lucide-react";

const featuredCategories = [
  {
    id: "1",
    name: "Cement",
    slug: "cement",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=construction%20cement%20bags%20stacked%20in%20warehouse%20industrial%20setting&image_size=square",
    description: "High quality cement for all construction needs"
  },
  {
    id: "2",
    name: "Steel",
    slug: "steel",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=steel%20rebars%20rods%20construction%20materials%20industrial&image_size=square",
    description: "Premium steel bars and rods for construction"
  },
  {
    id: "3",
    name: "Bricks",
    slug: "bricks",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=red%20clay%20bricks%20stacked%20construction%20site&image_size=square",
    description: "Durable bricks for building strong structures"
  },
  {
    id: "4",
    name: "Sand",
    slug: "sand",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=construction%20sand%20pile%20building%20material&image_size=square",
    description: "Fine quality sand for construction purposes"
  }
];

const featuredProducts = [
  {
    id: "1",
    name: "UltraTech Cement",
    price: 380,
    unit: "bag",
    category: "Cement",
    description: "Premium quality cement for strong construction",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=UltraTech%20cement%20bag%20construction%20material%20industrial&image_size=square",
    inStock: true
  },
  {
    id: "2",
    name: "TMT Steel Bars",
    price: 65000,
    unit: "tonne",
    category: "Steel",
    description: "High strength TMT bars for reinforced concrete",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=TMT%20steel%20rebars%20construction%20rods%20industrial&image_size=square",
    inStock: true
  },
  {
    id: "3",
    name: "Clay Bricks",
    price: 8,
    unit: "piece",
    category: "Bricks",
    description: "Traditional clay bricks for wall construction",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=red%20clay%20bricks%20construction%20building%20materials&image_size=square",
    inStock: true
  }
];

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg text-white py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Stronger with BUILD-SETU
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Your trusted hyperlocal marketplace for construction materials in Gwalior. 
            Connect with verified suppliers, get competitive pricing, and ensure timely delivery.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Browse Products
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HardHat className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Materials</h3>
            <p className="text-gray-600">Premium construction materials from trusted suppliers</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Timely delivery to your construction site in Gwalior</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wide Range</h3>
            <p className="text-gray-600">Complete range of construction materials in one place</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BrickWall className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">Professional guidance for your construction needs</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of construction materials categories
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <Link key={category.id} to={`/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-center">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our most popular construction materials
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500">{product.category}</p>
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
        <div className="text-center mt-8">
          <Link to="/products">
            <Button size="lg">View All Products</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};