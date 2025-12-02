import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle,
  X,
  Save,
  Home,
  Building,
  Navigation,
  Phone
} from 'lucide-react'
import { toast } from 'sonner'

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  isDefault: boolean
  type: 'home' | 'office' | 'site'
}

export function AddressesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    type: 'home' as Address['type']
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Simulate loading addresses
    const loadAddresses = () => {
      const mockAddresses: Address[] = [
        {
          id: '1',
          name: 'Home',
          street: '123 Residential Colony, Civil Lines',
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          zipCode: '474001',
          phone: '+91 98765 43210',
          isDefault: true,
          type: 'home'
        },
        {
          id: '2',
          name: 'Site Office',
          street: '456 Construction Site, Industrial Area',
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          zipCode: '474002',
          phone: '+91 98765 43211',
          isDefault: false,
          type: 'site'
        },
        {
          id: '3',
          name: 'Office',
          street: '789 Business Complex, City Center',
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          zipCode: '474003',
          phone: '+91 98765 43212',
          isDefault: false,
          type: 'office'
        }
      ]
      
      setAddresses(mockAddresses)
      setIsLoading(false)
    }

    setTimeout(loadAddresses, 1000)
  }, [user, navigate])

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || 
        !newAddress.state || !newAddress.zipCode || !newAddress.phone) {
      toast.error('Please fill all address fields')
      return
    }

    // Phone validation
    const phoneRegex = /^\+91\s?\d{10}$/
    if (!phoneRegex.test(newAddress.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Indian phone number (+91 XXXXXXXXXX)')
      return
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0
    }

    setAddresses([...addresses, address])
    setNewAddress({ 
      name: '', 
      street: '', 
      city: '', 
      state: '', 
      zipCode: '', 
      phone: '',
      type: 'home'
    })
    setIsAddingAddress(false)
    
    toast.success('Address added successfully')
  }

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id)
    
    // If we deleted the default address, make the first one default
    const deletedAddress = addresses.find(addr => addr.id === id)
    if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }
    
    setAddresses(updatedAddresses)
    toast.success('Address deleted successfully')
  }

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }))
    setAddresses(updatedAddresses)
    toast.success('Default address updated')
  }

  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />
      case 'office':
        return <Building className="h-4 w-4" />
      case 'site':
        return <Navigation className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'bg-blue-100 text-blue-800'
      case 'office':
        return 'bg-green-100 text-green-800'
      case 'site':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Addresses</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage your delivery addresses</p>
        </div>
        {!isAddingAddress && (
          <Button onClick={() => setIsAddingAddress(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add New Address Form */}
          {isAddingAddress && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-name">Address Name</Label>
                      <Input
                        id="new-name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        placeholder="e.g., Home, Office, Site Office"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-type">Address Type</Label>
                      <select
                        id="new-type"
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({...newAddress, type: e.target.value as Address['type']})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="site">Construction Site</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-street">Street Address</Label>
                    <Input
                      id="new-street"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      placeholder="House/Building number, Street name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="new-city">City</Label>
                      <Input
                        id="new-city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-state">State</Label>
                      <Input
                        id="new-state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-zipCode">PIN Code</Label>
                      <Input
                        id="new-zipCode"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-phone">Phone Number</Label>
                    <Input
                      id="new-phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Address
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingAddress(false)
                        setNewAddress({ 
                          name: '', 
                          street: '', 
                          city: '', 
                          state: '', 
                          zipCode: '', 
                          phone: '',
                          type: 'home'
                        })
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Add your first delivery address to start ordering construction materials
                </p>
                <Button onClick={() => setIsAddingAddress(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <Card key={address.id} className={`relative ${address.isDefault ? 'border-blue-300 bg-blue-50' : ''}`}>
                  {address.isDefault && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getAddressIcon(address.type)}
                        {address.name}
                      </CardTitle>
                      <Badge className={getAddressTypeColor(address.type)}>
                        {address.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">{address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {address.phone}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* TODO: Edit address */}}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
