import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useKindeAuth();

  return (
    <div className="h-screen w-screen  flex items-center justify-center">
      <div className="min-w-96 min-h-[50%] rounded-lg text-black flex flex-col items-center gap-5 justify-center">
        <h1 className="font-bold text-2xl text-center">
          Register to Application
        </h1>
        <div className="w-full">
          <button
            onClick={async () => {
              await register();
            }}
            className="bg-black/70 text-white w-full py-3 rounded-lg"
          >
            Click here
          </button>

          <p className="text-black/80 pl-2 text-base">
            Or{" "}
            <Link to={"/login"} className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
