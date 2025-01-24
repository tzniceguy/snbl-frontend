// types.ts

// User-related interfaces
export interface UserTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  tokens: UserTokens;
}

// Auth-related interfaces
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  user: {
    username: string;
    email: string;
    first_name: string;
  };
  password: string;
  password2: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  user: User;
}

export interface AuthResponse {
  user: User;
}

// Product-related interfaces
export interface Product {
  id: number;
  name: string;
  slug: string;
  vendor_name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  stock: number;
  sku: string;
  image_url: string;
}

// Order-related interfaces
export interface OrderItem {
  product: number;
  quantity: number;
}

export interface Order {
  items: OrderItem[]; // List of items in the order
  shipping_address?: string; // Optional shipping address
}

export interface OrderResponse {
  id: number;
  customer: number;
  amount: string;
  items: OrderItem[]; // Replace '[]' with 'OrderItem[]' for type safety
  status: "PROCESSING" | "COMPLETED" | "CANCELLED"; // Union type for status
  status_display: string;
  payment_status: "PAID" | "PENDING" | "FAILED"; // Union type for payment status
  payment_status_display: string;
  amount_paid: string;
  shipping_address: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
}

// Payment-related interfaces
export interface PaymentResponse {
  id: string;
  amount: string;
  payment_method: string;
  transaction_id: string;
  phone_number: string;
  status: "COMPLETED" | "PENDING" | "FAILED"; // Union type for status
  order: number;
  created_at: string;
  updated_at: string;
}
