import axios from "axios";
import { BASE_URL } from "../../../utils/api";
import { ThemeSettings } from "../settings";

export interface Product {
  cann_sku_id: string;
  brand_name: string | null;
  brand_id: number | null;
  url: string;
  image_url: string;
  raw_product_name: string;
  product_name: string;
  raw_weight_string: string | null;
  display_weight: string | null;
  raw_product_category: string | null;
  category: string;
  raw_subcategory: string | null;
  subcategory: string | null;
  product_tags: string[] | null;
  percentage_thc: number | null;
  percentage_cbd: number | null;
  mg_thc: number | null;
  mg_cbd: number | null;
  quantity_per_package: number | null;
  medical: boolean;
  recreational: boolean;
  latest_price: number;
  menu_provider: string;
  retailer_id: string;
  meta_sku: string;
  updated_at: string;
  id: string;
}

export interface ProductResponse {
  products: {
    meta_sku: string;
    retailer_id: string;
    products: Product[];
  }[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
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
