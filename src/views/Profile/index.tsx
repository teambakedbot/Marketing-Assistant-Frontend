import React from "react";
import useAuth from "../../hooks/useAuth";
import { memo } from "react";

const Profile = memo(function Profile() {
  const { displayName, photoURL, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <img
        src={photoURL || "/images/person-image.png"}
        alt="Profile"
        className="rounded-full w-32 h-32"
      />
      <h1 className="text-2xl mt-4 font-semibold">
        {displayName || "Anonymous User"}
      </h1>
      <p className="text-lg mt-2 text-white-600">
        {user?.email || "No email available"}
      </p>
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p className="text-black text-xl">Profile Details</p>
      </div>
    </div>
  );
});

export default Profile;
