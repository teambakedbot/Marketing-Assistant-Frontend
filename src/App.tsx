import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import "./styles/main.css";
import Layout from "./components/Layout";
import Category from "./views/Category";
import Document from "./views/Document";
import BrushSquare from "./views/BrushSquare";
import FolderAdd from "./views/FolderAdd";
import Message from "./views/Message";
import Settings from "./views/Settings";
import Profile from "./views/Profile";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route path="category" element={<Category />}></Route>
            <Route path="document" element={<Document />}></Route>
            <Route path="copy" element={<Home />}></Route>
            <Route path="brush-square" element={<BrushSquare />}></Route>
            <Route path="folder-add" element={<FolderAdd />}></Route>
            <Route path="message" element={<Message />}></Route>
            <Route path="settings" element={<Settings />}></Route>
            <Route path="profile" element={<Profile />}></Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
