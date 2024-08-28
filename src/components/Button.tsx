import {Link} from "react-router-dom";

interface ButtonProps {
   name: string;
   path: string;
   color?: "grey" | "blue";
}

function Button(props: ButtonProps) {
   const {name, path, color = "grey"} = props;

   return (
      <Link
         to={path}
         className={`py-2.5 px-9 font-bold ${
            color === "grey" ? "bg-gray-600 rounded-[20px]" : "bg-blue-400 rounded-xl"
         } text-white`}
      >
         {name}
      </Link>
   );
}

export default Button;
