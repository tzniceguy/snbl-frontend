// types.ts
export type OrderStatus = "completed" | "pending" | "cancelled";

export interface ApiError {
  response?: {
    data?: {
      code?: string;
    };
  };
}

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
  price: number;
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
  id: number;
  customer: number;
  items: Array<{
    id: number;
    product: number;
    product_name: string;
    product_price: string;
    quantity: number;
    price: number;
  }>;
  amount: number;
  shipping_address: string;
  status: string;
  payment_status: string;
  amount_paid: number;
  amount_remaining: number;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  id: number;
  customer: number;
  amount: string;
  items: OrderItem[];
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
export interface PaymentData {
  order: number;
  phone_number: string;
  amount: number;
  payment_method: string;
}

export interface PaymentResponse {
  payment: {
    id: string;
    amount: number;
    phone_number: string;
    status: string;
  };
  order: {
    id: number;
    payment_status: string;
    amount_paid: number;
    remaining_balance: number;
    tracking_number: string | null;
    status: string;
  };
  azampay_response: {
    success: boolean;
    transactionId: string;
    message: string;
    messageCode: number;
  };
}

export interface CheckoutInfo {
  phoneNumber: string;
  network: string;
  location: string;
  amount: string;
  remainingBalance: number;
}
