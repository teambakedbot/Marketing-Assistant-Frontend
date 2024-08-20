import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navigation from "./Navigation";
function Layout() {
  // Use the hook to validate user session
  const { isAuthenticated } = useAuth();
  return (
    isAuthenticated && (
      <div>
        <Navigation />
        <div className="ml-[66px] min-h-screen">
          <Outlet />
        </div>
      </div>
    )
  );
}

export default Layout;
