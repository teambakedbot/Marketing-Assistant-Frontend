import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        navigate("/");
      });
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="h-screen w-screen  flex items-center justify-center">
      <div className="min-w-96 min-h-[50%] rounded-lg text-black flex flex-col items-center gap-5 justify-center">
        <h1 className="font-bold text-2xl text-center">Login to Application</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={async () => {
            await login();
          }}
          className="bg-black/70 text-white w-full py-3 rounded-lg"
        >
          Click here
        </button>

        <p className="text-black/80 pl-2 text-base">
          Or{" "}
          <Link to={"/register"} className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
