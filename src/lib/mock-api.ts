import type { User, LoginData, RegisterData, CartItem, Product } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "buyer"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+0987654321",
    role: "seller"
  }
];

export const authAPI = {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    return {
      user,
      token: "mock-jwt-token-" + user.id
    };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(500);
    
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: "mock-jwt-token-" + newUser.id
    };
  },

  async logout(): Promise<void> {
    await delay(200);
  }
};

let cartItems: CartItem[] = [];

export const cartAPI = {
  async getCart(): Promise<CartItem[]> {
    await delay(300);
    return [...cartItems];
  },

  async addToCart(productId: string, quantity: number): Promise<CartItem[]> {
    await delay(300);
    
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const mockProduct: Product = {
        id: productId,
        name: "Sample Product",
        category: "Construction",
        price: 100,
        unit: "bag",
        description: "Sample product description",
        image: "https://via.placeholder.com/150",
        inStock: true
      };
      
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId,
        name: mockProduct.name,
        price: mockProduct.price,
        quantity,
        unit: mockProduct.unit
      };
      
      cartItems.push(newItem);
    }
    
    return [...cartItems];
  },

  async updateQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    await delay(300);
    
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.productId !== productId);
      }
    }
    
    return [...cartItems];
  },

  async removeFromCart(productId: string): Promise<CartItem[]> {
    await delay(300);
    cartItems = cartItems.filter(item => item.productId !== productId);
    return [...cartItems];
  },

  async clearCart(): Promise<void> {
    await delay(300);
    cartItems = [];
  }
};;