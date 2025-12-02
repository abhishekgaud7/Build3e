export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}