import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../config/firebase-config";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email/password login logic here
    onLogin();
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bb-sm-login-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="bb-sm-login-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="bb-sm-login-input"
      />
      <button type="submit" className="bb-sm-login-button">
        Login
      </button>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="bb-sm-google-login-button"
      >
        Login with Google
      </button>
    </form>
  );
};

export default LoginForm;
