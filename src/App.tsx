import { Route, Routes } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./config/firebase-config";
import { useEffect, useState } from "react";
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
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="document" element={<Document />} />
        <Route path="copy" element={<Home />} />
        <Route path="brush-square" element={<BrushSquare />} />
        <Route path="folder-add" element={<FolderAdd />} />
        <Route path="message" element={<Message />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
