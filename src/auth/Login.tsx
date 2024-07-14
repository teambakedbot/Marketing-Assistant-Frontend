import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useKindeAuth();

  return (
    <div className="h-screen w-screen  flex items-center justify-center">
      <div className="min-w-96 min-h-[50%] rounded-lg text-black flex flex-col items-center gap-5 justify-center">
        <h1 className="font-bold text-2xl text-center">Login to Application</h1>
        <div className="w-full">
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
    </div>
  );
};

export default Login;
