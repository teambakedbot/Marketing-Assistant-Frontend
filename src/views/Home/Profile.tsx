import { Link } from "react-router-dom";
import Conversations from "./Conversations";
import { useRef } from "react";
import { DocumentUpload } from "iconsax-react";

interface ProfileProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Profile({ onFileUpload }: ProfileProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  }

  return (
    <div className="">
      <Link to="/" className="flex justify-center mb-5">
        <img
          className="w-[120px] md:w-[150px]"
          src="/images/bakedBot_logo.png"
          alt=""
        />
      </Link>
      <div className="text-center my-[15px] md:mb-[50px] font-playfair-display font-bold">
        Cultivating Unforgettable Experiences
      </div>

      <Conversations />
      {/* <p className="medium-gray font-istok-web text-base text-center font-semibold py-1 rounded-2xl">
        Calling Smokey to send an SMS
      </p> */}
      <div className="text-center mx-2 mb-10 mt-[20px] md:mt-[30px]">
        <p className="text-[13px] mb-2 md:mb-3 font-istok-web">
          You are using the Limited Free Version of BakedBot.
        </p>
        <p className="text-[13px] mb-0 md:mb-3 font-istok-web">
          Upgrade and Go Unlimited? Starting at $25/Month
        </p>
      </div>
      <div className="flex justify-center mx-1 mt-5">
        <button
          onClick={handleButtonClick}
          className="bg-white mt-2 mx-10 md:m-4 flex flex-col items-center justify-center md:gap-2 text-gray-700 text-[12px] md:text-[15px] font-istok-web font-bold rounded-2xl py-5 px-3 "
        >
          {/* <i className="fas fa-upload fa-2x"></i> */}
          <DocumentUpload className="text-4xl" variant="Bold" size={32} />
          Upload Customer Data to Get Started
        </button>
        <input ref={inputRef} type="file" hidden onChange={onFileUpload} />
      </div>
    </div>
  );
}

export default Profile;
