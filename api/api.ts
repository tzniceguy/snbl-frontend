import axiosInstance from "./axios-instance";

export interface RegisterData {
  username: string;
  password: string;
  firstname: string;
  email: string;
  lastname: string;
  phonenumber: string;
}

export interface LoginData {
  username: string;
  password: string;
}

interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: number;
    username: string;
    address: string;
  };
}

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
    const response = await axiosInstance.post("logout/");
    return response.data;
  } catch (error) {
    console.error("logout failed:", error);
    throw error;
  }
};
