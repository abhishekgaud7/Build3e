import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  Send,
  BookOpen,
  Users,
  Truck,
  Shield,
  CreditCard,
  Package,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastReply?: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I place an order on BUILD-SETU?',
    answer: 'Browse our catalog, add items to your cart, select your delivery address, and proceed to checkout. You can pay via UPI, credit/debit card, or cash on delivery.',
    category: 'Ordering'
  },
  {
    id: '2',
    question: 'What is the minimum order value?',
    answer: 'There is no minimum order value. However, delivery charges of ₹299 apply for orders below ₹5000. Orders above ₹5000 qualify for free delivery.',
    category: 'Ordering'
  },
  {
    id: '3',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 2-4 business days within Gwalior city limits. Express delivery (1-2 days) is available for selected products at an additional charge.',
    category: 'Delivery'
  },
  {
    id: '4',
    question: 'Can I track my order?',
    answer: 'Yes, you can track your order in real-time. Once your order is shipped, you will receive a tracking number and link via SMS and email.',
    category: 'Delivery'
  },
  {
    id: '5',
    question: 'What if I receive damaged materials?',
    answer: 'We have a 7-day return policy for damaged or defective materials. Contact our support team immediately with photos of the damaged items for quick resolution.',
    category: 'Returns'
  },
  {
    id: '6',
    question: 'Do you provide bulk discounts?',
    answer: 'Yes, we offer competitive bulk pricing for large orders. Contact our sales team at sales@buildsetu.com or call +91-751-1234567 for bulk inquiries.',
    category: 'Pricing'
  }
]

const supportTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'Delay in cement delivery',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-12-01T10:30:00Z',
    lastReply: '2024-12-01T14:20:00Z',
    category: 'Delivery Issue'
  },
  {
    id: '2',
    subject: 'Wrong steel bars delivered',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-11-28T09:15:00Z',
    lastReply: '2024-11-29T16:45:00Z',
    category: 'Product Issue'
  },
  {
    id: '3',
    subject: 'Bulk pricing inquiry for tiles',
    status: 'open',
    priority: 'low',
    createdAt: '2024-11-25T14:20:00Z',
    category: 'Pricing Inquiry'
  }
]

const getStatusColor = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-orange-100 text-orange-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function SupportPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact'>('faq')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'general'
  })

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error('Please fill all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Simulate form submission
    toast.success('Your message has been sent! We will get back to you within 24 hours.')
    setContactForm({
      ...contactForm,
      subject: '',
      message: ''
    })
  }

  const quickLinks = [
    { icon: BookOpen, title: 'Ordering Guide', description: 'Learn how to place orders efficiently' },
    { icon: Truck, title: 'Delivery Information', description: 'Track orders and delivery schedules' },
    { icon: Package, title: 'Product Catalog', description: 'Browse our construction materials' },
    { icon: Shield, title: 'Quality Assurance', description: 'Our quality standards and guarantees' },
    { icon: CreditCard, title: 'Payment Options', description: 'Available payment methods' },
    { icon: Users, title: 'Bulk Orders', description: 'Information about bulk purchasing' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get answers to your questions about construction materials, ordering, delivery, and more
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <link.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak with our support team directly</p>
            <p className="font-semibold text-lg mb-2">+91-751-1234567</p>
            <p className="text-sm text-gray-600">Mon-Sat: 9 AM - 6 PM</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us your questions via email</p>
            <p className="font-semibold text-lg mb-2">support@buildsetu.com</p>
            <p className="text-sm text-gray-600">Response within 24 hours</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team online</p>
            <Button className="w-full mb-2">Start Chat</Button>
            <p className="text-sm text-gray-600">Available during business hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={activeTab === 'faq' ? 'default' : 'outline'}
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Frequently Asked Questions
        </Button>
        <Button
          variant={activeTab === 'tickets' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tickets')}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          My Support Tickets
        </Button>
        <Button
          variant={activeTab === 'contact' ? 'default' : 'outline'}
          onClick={() => setActiveTab('contact')}
        >
          <Mail className="h-4 w-4 mr-2" />
          Contact Us
        </Button>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <div className="text-blue-600">
                        {expandedFAQ === faq.id ? (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">−</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">+</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-600">{faq.answer}</p>
                      <Badge className="mt-3 bg-gray-100 text-gray-800">
                        {faq.category}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Support Tickets</h2>
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
          </div>

          <div className="grid gap-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.category}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created: {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        {ticket.lastReply && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Last reply: {new Date(ticket.lastReply).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contact Form Tab */}
      {activeTab === 'contact' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={contactForm.category}
                    onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="product">Product Information</option>
                    <option value="pricing">Pricing & Bulk Orders</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Please provide detailed information about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
