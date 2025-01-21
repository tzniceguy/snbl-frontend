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
