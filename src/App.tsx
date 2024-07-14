import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Layout from "./components/Layout";
import "./styles/main.css";
import Home from "./views/Home";

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
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </KindeProvider>
    </div>
  );
}

export default App;
