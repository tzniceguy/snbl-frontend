import axiosInstance from "./axios-instance";
import { OrderResponse, Order, PaymentData, PaymentResponse } from "./types";
import { refreshToken } from "./api";

interface ApiError {
  response?: {
    data?: {
      code?: string;
    };
  };
}

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const handleTokenRefresh = async (refreshTokenValue: string) => {
  const newToken = await refreshToken(refreshTokenValue);
  localStorage.setItem("authToken", newToken);
  return newToken;
};

const withAuthRetry = async <T>(requestFn: (token: string) => Promise<T>) => {
  const token = localStorage.getItem("authToken");
  const refreshTokenValue = localStorage.getItem("refreshToken");

  if (!token || !refreshTokenValue) {
    throw new Error("User not authenticated, please login");
  }

  try {
    return await requestFn(token);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.code === "token_not_valid") {
      try {
        const newToken = await handleTokenRefresh(refreshTokenValue);
        return await requestFn(newToken);
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userProfile");
        throw new Error("User not authenticated, please login");
      }
    } else {
      throw error;
    }
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  return withAuthRetry(async (token) => {
    const response = await axiosInstance.get<{ results: Order[] }>("/orders/", {
      headers: getAuthHeaders(token),
    });
    return Array.isArray(response.data.results) ? response.data.results : [];
  });
};

export const initiateOrder = async (
  orderData: Order,
  token: string,
): Promise<OrderResponse> => {
  const response = await axiosInstance.post("/orders/", orderData, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getOrderDetail = async (
  id: string,
  token: string,
): Promise<Order> => {
  const response = await axiosInstance.get(`/orders/${id}/`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const processOrderPayment = async (
  orderId: string,
  paymentData: PaymentData,
  token: string,
): Promise<PaymentResponse> => {
  const response = await axiosInstance.post<PaymentResponse>(
    `payments/`,
    paymentData,
    {
      headers: getAuthHeaders(token),
    },
  );
  return response.data;
};
