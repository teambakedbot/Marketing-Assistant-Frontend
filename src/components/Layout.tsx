import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
function Layout() {
  // Check if user is loggedin
  const { isAuthenticated, isLoading } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User is not loggedin; redirect to login page
      navigate("/login");
    }
  }, [isAuthenticated, isLoading]);

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
