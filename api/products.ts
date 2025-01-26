import axiosInstance from "./axios-instance";
import { Product } from "./types";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get("products/");
    return response.data.results;
  } catch (error) {
    console.error("fetching products failed:", error);
    throw error;
  }
};
export const getProductDetail = async (slug: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`products/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("fetching product detail failed:", error);
    throw error;
  }
};
