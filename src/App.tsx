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
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import Login from "./auth/Login";
import Register from "./auth/Register";
function App() {
  return (
    <div>
      <KindeProvider
        clientId={import.meta.env.VITE_KINDE_CLIENT_ID as string}
        domain={import.meta.env.VITE_KINDE_DOMAIN as string}
        logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URL as string}
        redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URL as string}
      >
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
      </KindeProvider>
    </div>
  );
}

export default App;
