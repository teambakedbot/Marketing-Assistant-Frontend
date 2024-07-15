import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const { isAuthenticated, isLoading, user } = useKindeAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated]);

  return { isAuthenticated, isLoading, user };
};

export default useAuth;
