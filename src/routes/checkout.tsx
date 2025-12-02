import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'

interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

interface CreateOrderData {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: Address
  totalAmount: number
  subtotal: number
  deliveryCharges: number
  gst: number
}

export function CheckoutPage() {
  const { user } = useAuth()
  const { items: cartItems, total, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: '',
    line1: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = total
  const deliveryCharges = subtotal > 5000 ? 0 : 299
  const gst = Math.round(subtotal * 0.18)
  const totalAmount = subtotal + deliveryCharges + gst

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    const loadAddresses = async () => {
      try {
        const { addresses } = await api.addresses.list()
        setAddresses(addresses as Address[])
        setSelectedAddress((addresses[0] as any)?.id || '')
      } catch {
        setAddresses([])
      }
    }

    loadAddresses()
  }, [user, cartItems, navigate])

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.line1 || !newAddress.city || 
        !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields')
      return
    }

    try {
      const { address } = await api.addresses.create({ ...newAddress, isDefault: addresses.length === 0 })
      const created = address as Address
      const next = [...addresses, created]
      setAddresses(next)
      setNewAddress({ label: '', line1: '', city: '', state: '', pincode: '' })
      setIsAddingAddress(false)
      if (addresses.length === 0) setSelectedAddress(created.id)
      toast.success('Address added successfully')
    } catch {
      toast.error('Failed to add address')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.addresses.delete(id)
      const updated = addresses.filter(addr => addr.id !== id)
      setAddresses(updated)
      if (selectedAddress === id && updated.length > 0) setSelectedAddress(updated[0].id)
      toast.success('Address deleted successfully')
    } catch {
      toast.error('Failed to delete address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        addressId: selectedAddress,
      }
      const { order } = await api.orders.create(payload)
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${(order as any).id}`)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Delivery Address
              </CardTitle>
              <CardDescription>
                Select or add a delivery address for your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg mb-3 hover:bg-gray-50">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={address.id} className="font-medium">
                        {address.label}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* TODO: Edit address */}}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {!isAddingAddress ? (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              ) : (
                <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Address Label</Label>
                      <Input
                        id="label"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                        placeholder="e.g., Site Office, Home"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})}
                      placeholder="House/Building number, Street name"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress} size="sm">
                      Save Address
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingAddress(false)} 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Review the items in your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">
                    {deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{gst.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                
                {subtotal < 5000 && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                    Add ₹{(5000 - subtotal).toLocaleString()} more to get free delivery!
                  </div>
                )}
                
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !selectedAddress}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
