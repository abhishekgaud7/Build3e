import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home, 
  MapPin, 
  Phone, 
  Calendar,
  ArrowLeft,
  Download,
  MessageCircle,
  RotateCcw
} from 'lucide-react'
import { api } from '@/lib/api'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  subtotal: number
  deliveryCharges: number
  gst: number
  itemCount: number
  createdAt: string
  estimatedDelivery: string
  shippedAt?: string
  deliveredAt?: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  billingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: Array<{
    id: string
    name: string
    category: string
    quantity: number
    price: number
    total: number
    image: string
  }>
  trackingNumber?: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
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
      return <Clock className="h-5 w-5" />
    case 'confirmed':
      return <CheckCircle className="h-5 w-5" />
    case 'shipped':
      return <Truck className="h-5 w-5" />
    case 'delivered':
      return <Home className="h-5 w-5" />
    default:
      return <Package className="h-5 w-5" />
  }
}

const getPaymentStatusColor = (status: Order['paymentStatus']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!id) {
      navigate('/orders')
      return
    }

    const loadOrder = async () => {
      try {
        const { order } = await api.orders.get(id)
        const o = order as any
        const mapped: Order = {
          id: o.id,
          orderNumber: o.id.slice(0, 8).toUpperCase(),
          status: (o.status || 'PENDING').toLowerCase(),
          totalAmount: o.totalAmount || 0,
          subtotal: o.subtotal || 0,
          deliveryCharges: o.deliveryCharges || 0,
          gst: o.gst || 0,
          itemCount: (o.items || []).length,
          createdAt: o.createdAt,
          estimatedDelivery: o.updatedAt,
          shippedAt: o.shippedAt,
          deliveredAt: o.deliveredAt,
          shippingAddress: {
            name: o.address?.label || 'Address',
            street: o.address?.line1 || '',
            city: o.address?.city || '',
            state: o.address?.state || '',
            zipCode: o.address?.pincode || '',
            phone: ''
          },
          billingAddress: {
            name: o.address?.label || 'Address',
            street: o.address?.line1 || '',
            city: o.address?.city || '',
            state: o.address?.state || '',
            zipCode: o.address?.pincode || ''
          },
          items: (o.items || []).map((it: any) => ({
            id: it.productId,
            name: it.product?.name || 'Item',
            category: it.product?.category?.name || '',
            quantity: it.quantity,
            price: it.product?.price || 0,
            total: (it.product?.price || 0) * it.quantity,
            image: it.product?.image || 'https://via.placeholder.com/100'
          })),
          trackingNumber: o.trackingNumber,
          paymentMethod: o.paymentMethod || 'COD',
          paymentStatus: (o.paymentStatus || 'pending') as any,
        }
        setOrder(mapped)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [user, id, navigate])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const handleReorder = () => {
    // Navigate to products with items pre-added to cart
    navigate('/products')
  }

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `invoice-${order?.orderNumber}.pdf`
    link.click()
  }

  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                {order.trackingNumber && (
                  <span className="text-sm text-gray-600">
                    Tracking: {order.trackingNumber}
                  </span>
                )}
              </div>
              
              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.shippedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-sm text-gray-600">{formatDate(order.shippedAt)}</p>
                    </div>
                  </div>
                )}
                
                {order.deliveredAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Home className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Order Delivered</p>
                      <p className="text-sm text-gray-600">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.itemCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.total)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">{formatCurrency(order.deliveryCharges)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">{formatCurrency(order.gst)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {order.shippingAddress.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.status === 'delivered' && (
                <>
                  <Button onClick={handleReorder} className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reorder Items
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </>
              )}
              
              {order.status === 'pending' && (
                <>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    Cancel Order
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </>
              )}
              
              {(order.status === 'shipped' || order.status === 'confirmed') && (
                <>
                  <Button variant="outline" className="w-full">
                    Track Order
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-xs">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Placed on</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span>{order.itemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
