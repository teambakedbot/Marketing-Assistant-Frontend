import axios from "axios";
import { BASE_URL } from "../../../utils/api";
import { ThemeSettings } from "../settings";

export interface Product {
  id: string;
  cann_sku_id: string;
  brand_name: string;
  brand_id: number;
  url: string;
  image_url: string;
  raw_product_name: string;
  product_name: string;
  raw_weight_string: string;
  display_weight: string;
  raw_product_category: string;
  category: string;
  raw_subcategory: string;
  subcategory: string;
  product_tags: string[];
  percentage_thc: number;
  percentage_cbd: number;
  mg_thc: number;
  mg_cbd: number;
  quantity_per_package: number;
  medical: boolean;
  recreational: boolean;
  latest_price: number;
  menu_provider: string;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
    next_page?: number;
    prev_page?: number;
  };
}

export const renameChat = async (
  token: string,
  chatId: string,
  newName: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/chat/rename?chat_id=${chatId}&new_name=${newName}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming chat:", error);
    throw error;
  }
};

export const saveThemeSettings = async (
  token: string,
  settings: ThemeSettings
) => {
  await axios.post(`${BASE_URL}/users/theme`, settings, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getThemeSettings = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/users/theme`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
