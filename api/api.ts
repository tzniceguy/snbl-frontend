import axiosInstance from "./axios-instance";

export interface registerData {
  username: string;
  password: string;
  firstname: string;
  email: string;
  lastname: string;
  phonenumber: string;
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
  formData: registerData,
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post("register/", formData);
    return response.data;
  } catch (error) {
    console.error("registering failed:", error);
    throw error;
  }
};
