import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase-config";

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        onLogin();
      } catch (error) {
        console.error("Error signing in:", error);
      }
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
      <form
        onSubmit={handleSubmit}
        className="bb-sm-login-form flex flex-col gap-2 w-full max-w-md"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bb-sm-login-input p-3 rounded bg-gray-700 text-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bb-sm-login-input p-3 rounded bg-gray-700 text-lg"
        />
        <button
          type="submit"
          className="bb-sm-login-button border-2 border-white rounded-md p-3 text-lg hover:bg-white hover:text-gray-800 transition-colors"
        >
          Login
        </button>
        <div className="text-center my-4 text-lg">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="bb-sm-google-login-button border-2 border-white rounded-md p-3 text-lg flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors"
        >
          <img
            src="/images/google-icon.png"
            alt="Google"
            className="w-6 h-6 mr-2"
          />
          Login with Google
        </button>
      </form>
    );
  };

export default LoginForm
  