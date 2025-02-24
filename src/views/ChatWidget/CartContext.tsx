import React, { createContext, ReactNode, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { checkout } from "../../utils/api";
import { Product } from "./api/renameChat";
import Swal from "sweetalert2";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartData {
  name: string;
  contact_info: {
    email: string;
    phone: string;
  };
  cart: {
    [key: string]: CartItem;
  };
}
const buildCartData = (
  email: string,
  phone: string,
  name: string,
  cartItems: Map<string, CartItem>
): CartData => {
  return {
    name: name || "Anonymous",
    contact_info: {
      email: email || "",
      phone: phone || "",
    },
    cart: Object.fromEntries(cartItems),
  };
};

interface CartContextType {
  cart: { [key: string]: CartItem };
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, change: number) => void;
  removeFromCart: (productId: string) => void;
  handleCheckout: (contactInfo: {
    email: string;
    phone: string;
  }) => Promise<boolean>;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const { user } = useAuth();

  const addToCart = (product: Product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id ?? product.product_id]: {
        product,
        quantity: 1,
      },
    }));
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((prevCart) => {
      const item = prevCart[productId];
      if (!item) return prevCart;

      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [productId]: {
          ...item,
          quantity: newQuantity,
        },
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const { [productId]: _, ...rest } = prevCart;
      return rest;
    });
  };

  const handleCheckout = async (contactInfo: {
    email: string;
    phone: string;
  }): Promise<any> => {
    try {
      if (Object.keys(cart).length === 0) {
        await Swal.fire({
          title: "Error",
          text: "Your cart is empty",
          icon: "error",
        });
        return false;
      }

      // Calculate total price
      const totalPrice = Object.values(cart).reduce(
        (sum, { product, quantity }) => sum + product.latest_price * quantity,
        0
      );

      // Format cart items as required by the API
      const formattedCart = Object.entries(cart).reduce(
        (acc, [productId, { product, quantity }]) => {
          acc[productId] = {
            sku: productId,
            product_name: product.product_name,
            quantity,
            price: product.latest_price,
            weight: product.display_weight || undefined,
          };
          return acc;
        },
        {} as Record<string, any>
      );

      const orderData = {
        name: user?.displayName || "Anonymous",
        contact_info: {
          email: contactInfo.email,
          phone: contactInfo.phone,
        },
        cart: formattedCart,
        total_price: totalPrice,
      };

      const token = user ? await user.getIdToken() : null;
      const response = await checkout(orderData, token);

      if (response.success) {
        // Show success message
        // await Swal.fire({
        //   title: "Success",
        //   text: response.message,
        //   icon: "success",
        // });
        // Clear the cart after successful checkout
        setCart({});
        return response;
      } else {
        await Swal.fire({
          title: "Error",
          text: response.message || "Failed to process checkout",
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred during checkout",
        icon: "error",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
