import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const { router, user } = useAppContext();

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b bg-white shadow-sm">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          onClick={() => router.push("/")}
          className="w-24 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />

        {/* Welcome text */}
        <div className="hidden sm:flex flex-col leading-tight">
          <p className="text-sm text-gray-500">Welcome,</p>
          <p className="text-base font-semibold text-gray-700">
            {user?.fullName || "Seller"} — <span className="text-purple-600">Seller Dashboard</span>
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            // Default icon
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 20.25a8.25 8.25 0 0115 0"
              />
            </svg>
          )}
        </div>

        {/* Logout Button */}
        <button
          className="bg-gray-800 text-white px-5 py-2 rounded-full text-xs sm:text-sm hover:bg-black transition"
          onClick={() => router.push("/logout")} // hoặc dùng clerk.signOut() nếu có
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
