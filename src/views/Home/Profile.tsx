import { Link } from "react-router-dom";
import Conversations from "./Conversations";

interface ProfileProps {
  setCustomerFile: (file: File) => void;
  fileRef?: React.RefObject<HTMLInputElement>;
}
function Profile({ setCustomerFile, fileRef }: ProfileProps) {
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    setCustomerFile(file);

    // use the file
    console.log(file.name);
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!fileRef || !fileRef.current) return;

    fileRef.current.click();
  }

  return (
    <div className="">
      <Link to="/" className="flex justify-center mb-5">
        <img
          className="w-[120px] md:w-[150px]"
          src="/images/large-logo.png"
          alt=""
        />
      </Link>
      <div className="font-bold text-center mb-[15px] md:mb-[50px]">
        Cultivating Unforgettable Experiences
      </div>

      <Conversations />
      {/* <div className="flex justify-center mb-2">
        <img src="/images/Sebo_logo.png" alt="" />
      </div> */}
      <p className="bg-[#636363] font-istok-web text-white text-base text-center font-semibold py-1 rounded-2xl">
        Calling Smokey to send an SMS
      </p>
      <div className="text-center mx-2 mt-[20px] md:mt-[30px]">
        <p className="text-[13px] mb-2 md:mb-3 font-rhodium-libre">
          You are using the Limited Free Version of BakedBot.
        </p>
        <p className="text-[13px] mb-0 md:mb-3 font-rhodium-libre">
          Upgrade and Go Unlimited? Starting at $25/Month
        </p>
      </div>
      <div className="flex justify-center mx-1">
        <button
          onClick={handleButtonClick}
          className="bg-white mt-2 mx-10 md:m-4 flex flex-col items-center justify-center md:gap-2 text-gray-700 text-[12px] md:text-[15px] font-roboto font-bold rounded-2xl py-5 px-3 "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 47 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="23.7743"
              cy="18.8704"
              rx="22.9032"
              ry="18.7339"
              fill="#384455"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.2088 24.4864C17.164 24.5433 15.4471 23.2381 15.3672 21.5658V18.5259C15.4467 16.8533 17.1638 15.548 19.2088 15.6051L19.9722 15.6053C20.245 15.6053 20.497 15.7244 20.6333 15.9175C20.7698 16.1107 20.7698 16.3488 20.6333 16.542C20.497 16.7352 20.245 16.8542 19.9722 16.8542H19.2088C18.0369 16.8207 17.0526 17.5686 17.007 18.527V21.567C17.053 22.5252 18.0369 23.2731 19.2088 23.2404L28.3334 23.2405C29.5053 23.2731 30.4893 22.5252 30.5352 21.5668V18.5215C30.4901 17.5668 29.51 16.8216 28.3428 16.8542H27.5701C27.2973 16.8542 27.0453 16.7352 26.909 16.542C26.7725 16.3488 26.7725 16.1107 26.909 15.9175C27.0453 15.7244 27.2973 15.6053 27.5701 15.6053H28.3427C30.3828 15.5487 32.0953 16.8512 32.1744 18.5197V21.5652C32.0949 23.2373 30.3783 24.5426 28.3335 24.4858L19.2088 24.4864ZM22.9496 20.1232V13.5038L21.9571 14.2594C21.6249 14.4956 21.1306 14.4956 20.7983 14.2594C20.6456 14.147 20.5584 13.987 20.5584 13.8191C20.5584 13.6513 20.6456 13.4912 20.7983 13.379L23.1886 11.553C23.5262 11.3267 24.0121 11.3267 24.3498 11.553L26.7401 13.3784C26.8923 13.4909 26.9792 13.651 26.9792 13.8188C26.9792 13.9867 26.8923 14.1467 26.7401 14.2594C26.4104 14.5026 25.9094 14.5026 25.5796 14.2594L24.5871 13.5038V20.1232H22.9496Z"
              fill="white"
            />
          </svg>
          Upload Customer Data to Get Started
        </button>
        <input ref={fileRef} type="file" hidden onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default Profile;
