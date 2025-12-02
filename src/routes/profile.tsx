import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building,
  Edit2,
  Save,
  X,
  Calendar,
  Package,
  CreditCard,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  joinDate: string
  totalOrders: number
  totalSpent: number
  avatar?: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Simulate loading user profile
    const loadProfile = () => {
      const mockProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '+91 98765 43210',
        company: 'Rajesh Construction Company',
        address: {
          street: '123 Business Complex, City Center',
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          zipCode: '474001'
        },
        joinDate: '2024-01-15T10:30:00Z',
        totalOrders: 12,
        totalSpent: 125000,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=128`
      }
      
      setProfile(mockProfile)
      setEditedProfile(mockProfile)
      setIsLoading(false)
    }

    setTimeout(loadProfile, 1000)
  }, [user, navigate])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile)
  }

  const handleSave = () => {
    if (!editedProfile) return

    // Validate required fields
    if (!editedProfile.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!editedProfile.email.trim()) {
      toast.error('Email is required')
      return
    }

    if (!editedProfile.phone.trim()) {
      toast.error('Phone is required')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedProfile.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Phone validation (basic)
    const phoneRegex = /^\+91\s?\d{10}$/
    if (!phoneRegex.test(editedProfile.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Indian phone number (+91 XXXXXXXXXX)')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setProfile(editedProfile)
      setIsEditing(false)
      setIsLoading(false)
      toast.success('Profile updated successfully!')
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    if (!editedProfile) return
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      if (parent === 'address' && editedProfile.address) {
        setEditedProfile({
          ...editedProfile,
          address: {
            ...editedProfile.address,
            [child]: value
          }
        })
      }
    } else {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      } as UserProfile)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-600">Member since {formatDate(profile.joinDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editedProfile?.name : profile.name}
                    onChange={(e) => isEditing && handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile?.email : profile.email}
                    onChange={(e) => isEditing && handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedProfile?.phone : profile.phone}
                    onChange={(e) => isEditing && handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={isEditing ? editedProfile?.company || '' : profile.company || ''}
                    onChange={(e) => isEditing && handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={isEditing ? editedProfile?.address?.street || '' : profile.address?.street || ''}
                    onChange={(e) => isEditing && handleInputChange('address.street', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={isEditing ? editedProfile?.address?.city || '' : profile.address?.city || ''}
                      onChange={(e) => isEditing && handleInputChange('address.city', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={isEditing ? editedProfile?.address?.state || '' : profile.address?.state || ''}
                      onChange={(e) => isEditing && handleInputChange('address.state', e.target.value)}
                      disabled={!isEditing}
                      placeholder="State"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="zipCode">PIN Code</Label>
                  <Input
                    id="zipCode"
                    value={isEditing ? editedProfile?.address?.zipCode || '' : profile.address?.zipCode || ''}
                    onChange={(e) => isEditing && handleInputChange('address.zipCode', e.target.value)}
                    disabled={!isEditing}
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{profile.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold">{formatCurrency(profile.totalSpent)}</span>
              </div>
              <Separator />
              <div className="text-sm text-gray-600">
                <p>Average order value: {formatCurrency(profile.totalSpent / profile.totalOrders)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
                <Package className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/addresses')}>
                <MapPin className="h-4 w-4 mr-2" />
                Manage Addresses
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/support')}>
                <Settings className="h-4 w-4 mr-2" />
                Support & Help
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600">Account Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Member Since</p>
                <p className="font-medium">{formatDate(profile.joinDate)}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Email Verified</p>
                <p className="font-medium text-green-600">✓ Verified</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Phone Verified</p>
                <p className="font-medium text-green-600">✓ Verified</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}