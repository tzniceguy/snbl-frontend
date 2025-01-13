import axiosInstance from "./axios-instance";

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
  sku: number;
  image_url: string;
}

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
