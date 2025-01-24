import axiosInstance from "./axios-instance";
import { OrderResponse } from "./types";
import { Order } from "./types";
import { refreshToken } from "./api";

export const fetchOrders = async (): Promise<Order[]> => {
  let token = localStorage.getItem("authToken");

  const refreshtokenValue = localStorage.getItem("refreshToken");
  if (!token || !refreshtokenValue) {
    throw new Error("User not authenticated, please not login");
  }

  try {
    const response = await axiosInstance.get<Order[]>("/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    if (error.response?.data?.code === "token_not_valid") {
      try {
        //refresh the access token
        const newtoken = await refreshToken(refreshtokenValue);

        //store the new token
        localStorage.setItem("authToken", newtoken);

        //retry the request with new token
        const response = await axiosInstance.get<Order[]>("/orders/", {
          headers: {
            Authorization: `Bearer ${newtoken}`,
          },
        });
        return response.data;
      } catch (refreshError) {
        //if token fails to refresh, log out the user
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
