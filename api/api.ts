import axiosInstance from "./axios-instance";
import { RegisterData, RegisterResponse, LoginData } from "./types";

export const register = async (
  formData: RegisterData,
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post("register/", formData);
    return response.data;
  } catch (error) {
    console.error("registering failed:", error);
    throw error;
  }
};

export const login = async (formData: LoginData) => {
  try {
    const response = await axiosInstance.post("login/", formData);
    return response.data;
  } catch (error) {
    console.error("login failed:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    //only attempt to logout if there is authtoken
    if (authToken) {
      //ensuring auth token in included in the request header
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${authToken}`;

      const response = await axiosInstance.post("logout/");

      //clear auth headers after logout
      delete axiosInstance.defaults.headers.common["Authorization"];

      return response.data;
    }
  } catch (error) {
    console.error("logout failed:", error);
    throw error;
  } finally {
    //clear auth token from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
  }
};

export const fetchProfile = async () => {
  const authToken = localStorage.getItem("authToken");

  try {
    const response = await axiosInstance.get("customers/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetching profile failed:", error);
    throw error;
  }
};

export const refreshToken = async (token: string): Promise<string> => {
  try {
    const response = await axiosInstance.post("token/refresh/", {
      refresh: token,
    });
    const newToken = response.data.access;

    // Update token in local storage
    localStorage.setItem("authToken", newToken);

    return newToken;
  } catch (error) {
    console.error("Refreshing token failed:", error);
    throw error;
  }
};
