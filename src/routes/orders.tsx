import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import { Package, Clock, CheckCircle, Truck, Home } from 'lucide-react'
import { api } from '@/lib/api'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  itemCount: number
  createdAt: string
  estimatedDelivery: string
  shippingAddress: {
    name: string
    street: string
    city: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }>
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <Home className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const loadOrders = async () => {
      try {
        const { orders } = await api.orders.list()
        const mapped: Order[] = (orders as any[]).map((o: any) => ({
          id: o.id,
          orderNumber: o.id.slice(0, 8).toUpperCase(),
          status: (o.status || 'PENDING').toLowerCase(),
          totalAmount: o.totalAmount || 0,
          itemCount: (o.items || []).length,
          createdAt: o.createdAt,
          estimatedDelivery: o.updatedAt,
          shippingAddress: {
            name: o.address?.label || 'Address',
            street: o.address?.line1 || '',
            city: o.address?.city || ''
          },
          items: (o.items || []).map((it: any) => ({
            id: it.productId,
            name: it.product?.name || 'Item',
            quantity: it.quantity,
            price: it.product?.price || 0,
            image: it.product?.image || 'https://via.placeholder.com/100'
          }))
        }))
        setOrders(mapped)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user, navigate])

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your construction material orders</p>
        </div>
        <Button onClick={() => navigate('/products')}>
          <Package className="h-4 w-4 mr-2" />
          Shop More
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Orders' : status}
            {status !== 'all' && (
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {orders.filter(order => order.status === status).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {filter === 'all' 
                ? 'Start building your project by ordering construction materials'
                : `You don't have any ${filter} orders at the moment`
              }
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)} • {order.itemCount} items • {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Items Preview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.items.length > 4 && (
                      <p className="text-sm text-gray-600 mt-2">
                        +{order.items.length - 4} more items
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Delivery Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name} • {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Cancel Order
                      </Button>
                    )}
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Need Help?
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
