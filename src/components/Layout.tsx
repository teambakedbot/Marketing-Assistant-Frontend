import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navigation from "./Navigation";
import ChatWidget from "../views/ChatWidget";
import { CartProvider } from "../views/ChatWidget/CartContext";
function Layout() {
  // Use the hook to validate user session
  const { isAuthenticated } = useAuth();
  return (
    isAuthenticated && (
      <div>
        <Navigation />
        <div className="ml-[110px] min-h-screen">
          <CartProvider>
            <Outlet />
            <ChatWidget view="main" skipVerify />
          </CartProvider>
        </div>
      </div>
    )
  );
}

export default Layout;
