import {Link} from "react-router-dom";
import Conversations from "./Conversations";

function Profile() {
   return (
      <div className="">
         <Link to="/" className="flex justify-center mb-5">
            <img src="/images/large-logo.png" alt="" />
         </Link>
         <div className="font-bold text-center mb-[74px]">
            Cultivating Unforgettable Experiences
         </div>

         <Conversations />
         <div className="flex justify-center mb-2">
            <img src="/images/Sebo_logo.png" alt="" />
         </div>
         <p className="text-2xl font-rhodium-libre text-center leading-[1.4em] mb-44">
            Your Cannabots have saved you{" "}
            <span className="font-wendy-one text-red-800">200 minutes</span>. Tell a Friend!
         </p>
         <div role="button" className="bg-white rounded-2xl px-3 mx-7 py-5">
            <div className="flex justify-center mb-1.5">
               <img src="/images/btn-25.svg" alt="" />
            </div>
            <div className="text-4xl font-bold text-gray-700 text-center">
               Upload Customer Data to Get Started
            </div>
         </div>
      </div>
   );
}

export default Profile;
