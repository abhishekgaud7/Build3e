import type { Address } from "./user";
import type { CartItem } from "./product";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered";
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface CreateOrderData {
  items: CartItem[];
  addressId: string;
  totalAmount: number;
}