import React, { createContext, ReactNode, useState } from "react";

interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextProps {
  cart: { [key: string]: CartItem };
  addToCart: (product: any) => void;
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

  const addToCart = (product: any) => {
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

  const handleCheckout = (
    name: string,
    contactInfo: { email?: string; phone?: string }
  ) => {
    // Here you would typically send the order to your backend
    // For this example, we'll just log the order details
    console.log("Order placed:", { name, contactInfo, cart });
    // Reset cart and close checkout
    setCart({});
    // navigateTo("cart");
    // Show confirmation message
    alert("Order placed successfully! We will contact you for pickup details.");
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
