import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navigation from "./Navigation";
import ChatWidget from "../views/ChatWidget";
function Layout() {
  // Use the hook to validate user session
  const { isAuthenticated } = useAuth();
  return (
    isAuthenticated && (
      <div>
        <Navigation />
        <div className="ml-[110px] min-h-screen">
          <Outlet />
          <ChatWidget />
        </div>
      </div>
    )
  );
}

export default Layout;
