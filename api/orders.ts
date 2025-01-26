import axiosInstance from "./axios-instance";
import { OrderResponse, Order, PaymentData } from "./types";
import { refreshToken } from "./api";

export const fetchOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem("authToken");
  const refreshtokenValue = localStorage.getItem("refreshToken");

  if (!token || !refreshtokenValue) {
    throw new Error("User not authenticated, please login");
  }

  try {
    const response = await axiosInstance.get<{ results: Order[] }>("/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    if (error.response?.data?.code === "token_not_valid") {
      try {
        const newToken = await refreshToken(refreshtokenValue);

        // Store the new token
        localStorage.setItem("authToken", newToken);

        // Retry the request with the new token
        const response = await axiosInstance.get<{ results: Order[] }>(
          "/orders/",
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        );
        return Array.isArray(response.data.results)
          ? response.data.results
          : [];
      } catch (refreshError) {
        // If token refresh fails, log out the user
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userProfile");
        throw new Error("User not authenticated, please login");
      }
    } else {
      throw new Error("Failed to fetch orders");
    }
  }
};

export const initiateOrder = async (
  orderData: Order,
  token: string,
): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post("/orders/", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Initiating order failed:", error);
    throw error;
  }
};

export const getOrderDetail = async (
  id: string,
  token: string,
): Promise<Order> => {
  try {
    const response = await axiosInstance.get(`/orders/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching order detail failed:", error);
    throw error;
  }
};

export const processOrderPayment = async (
  orderId: string,
  paymentData: PaymentData,
  token: string,
): Promise<PaymentResponse> => {
  try {
    const response = await axiosInstance.post<PaymentResponse>(
      `payments/`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Processing payment failed:", error);
    throw error;
  }
};
