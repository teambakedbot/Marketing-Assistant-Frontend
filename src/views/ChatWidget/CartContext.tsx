import React, { createContext, ReactNode, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { checkout } from "../../utils/api";
import { Product } from "./api/renameChat";

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

interface CartContextProps {
  cart: { [key: string]: CartItem };
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  handleCheckout: (
    name: string,
    contactInfo: { email?: string; phone?: string }
  ) => void;
}

export const CartContext = createContext<CartContextProps | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
}: any) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const { user } = useAuth();

  const addToCart = async (product: Product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.id]) {
        newCart[product.id].quantity += 1;
      } else {
        newCart[product.id] = { product, quantity: 1 };
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId] = {
          ...newCart[productId],
          quantity: Math.max(0, newCart[productId].quantity + delta),
        };
        if (newCart[productId].quantity === 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const handleCheckout = async (
    name: string,
    contactInfo: { email?: string; phone?: string }
  ) => {
    try {
      const token = await user!.getIdToken();
      const checkoutData = {
        name,
        contact_info: contactInfo,
        cart: Object.fromEntries(
          Object.entries(cart).map(([id, { product, quantity }]) => [
            id,
            { quantity },
          ])
        ),
      };
      const response = await checkout(token, checkoutData);
      console.log("Checkout response:", response);
      setCart({});
      alert(
        "Order placed successfully! We will contact you for pickup details."
      );
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error processing your order. Please try again.");
    }
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
