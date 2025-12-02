import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@/components/ui'
import { 
  Package, 
  BrickWall, 
  HardHat, 
  Truck, 
  Wrench,
  Home,
  ArrowRight,
  Search
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  productCount: number
  image: string
  subcategories: string[]
}

const categories: Category[] = [
  {
    id: 'cement',
    name: 'Cement',
    description: 'High-quality Portland cement for all construction needs',
    icon: Package,
    productCount: 8,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Portland%20cement%20bags%20stacked%20in%20warehouse%2C%20construction%20material%2C%20professional%20product%20photography&image_size=landscape_16_9',
    subcategories: ['Portland Cement', 'PPC Cement', 'White Cement', 'Rapid Hardening Cement']
  },
  {
    id: 'steel',
    name: 'Steel & TMT Bars',
    description: 'Reinforcement steel bars for concrete structures',
    icon: HardHat,
    productCount: 12,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Steel%20TMT%20bars%20reinforcement%2C%20construction%20steel%20rods%2C%20industrial%20metal%20materials&image_size=landscape_16_9',
    subcategories: ['TMT Bars', 'Mild Steel Bars', 'Tor Steel', 'Binding Wire']
  },
  {
    id: 'bricks',
    name: 'Bricks & Blocks',
    description: 'Various types of bricks and concrete blocks',
    icon: BrickWall,
    productCount: 15,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Concrete%20bricks%20stacked%2C%20construction%20building%20materials%2C%20gray%20solid%20blocks&image_size=landscape_16_9',
    subcategories: ['Clay Bricks', 'Concrete Blocks', 'AAC Blocks', 'Fly Ash Bricks']
  },
  {
    id: 'sand',
    name: 'Sand & Aggregates',
    description: 'River sand, crushed sand, and construction aggregates',
    icon: Home,
    productCount: 6,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=River%20sand%20pile%2C%20construction%20sand%2C%20fine%20aggregate%20material&image_size=landscape_16_9',
    subcategories: ['River Sand', 'Crushed Sand', '10mm Aggregate', '20mm Aggregate']
  },
  {
    id: 'tiles',
    name: 'Tiles & Flooring',
    description: 'Ceramic, vitrified, and natural stone tiles',
    icon: Home,
    productCount: 20,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Ceramic%20floor%20tiles%20stacked%2C%20construction%20finishing%20materials%2C%20beige%20tiles&image_size=landscape_16_9',
    subcategories: ['Ceramic Tiles', 'Vitrified Tiles', 'Natural Stone', 'Marble']
  },
  {
    id: 'plumbing',
    name: 'Plumbing Materials',
    description: 'Pipes, fittings, and plumbing accessories',
    icon: Wrench,
    productCount: 25,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=PVC%20pipes%20stacked%2C%20white%20plastic%20plumbing%20pipes%2C%20construction%20materials&image_size=landscape_16_9',
    subcategories: ['PVC Pipes', 'CPVC Pipes', 'Fittings', 'Valves']
  },
  {
    id: 'electrical',
    name: 'Electrical Materials',
    description: 'Wires, cables, switches, and electrical accessories',
    icon: Wrench,
    productCount: 18,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Electrical%20wires%20cables%2C%20construction%20electrical%20materials%2C%20copper%20wires&image_size=landscape_16_9',
    subcategories: ['Electrical Wires', 'Cables', 'Switches', 'MCB & Distribution']
  },
  {
    id: 'paint',
    name: 'Paints & Chemicals',
    description: 'Interior, exterior paints and construction chemicals',
    icon: Package,
    productCount: 22,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Paint%20cans%20stacked%2C%20construction%20paints%2C%20colorful%20paint%20containers&image_size=landscape_16_9',
    subcategories: ['Interior Paint', 'Exterior Paint', 'Primers', 'Construction Chemicals']
  }
]

export function CategoriesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Construction Materials Categories</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse our comprehensive range of construction materials organized by category. 
          Find everything you need for your building project in one place.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories, materials, or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-semibold mb-1">{category.name}</h3>
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                    {category.productCount} Products
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    
                    <div className="space-y-1 mb-4">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {sub}
                        </div>
                      ))}
                      {category.subcategories.length > 3 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{category.subcategories.length - 3} more
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group"
                    >
                      View Products
                      <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or browse all our construction materials.
          </p>
          <Button onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}

      {/* Construction Tips */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Construction Tips & Guidelines</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert advice on selecting the right materials for your construction projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HardHat className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
            <p className="text-sm text-gray-600">
              Always choose high-quality materials that meet IS standards for long-lasting construction
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Timely Delivery</h3>
            <p className="text-sm text-gray-600">
              Plan your material requirements in advance to avoid construction delays
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bulk Savings</h3>
            <p className="text-sm text-gray-600">
              Order in bulk to save on costs and ensure consistent material quality
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
