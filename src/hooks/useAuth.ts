import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setDisplayName(currentUser?.displayName || null);
      setPhotoURL(currentUser?.photoURL || null);
      setIsLoading(false);
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return { isAuthenticated, isLoading, user, displayName, photoURL };
};

export default useAuth;
