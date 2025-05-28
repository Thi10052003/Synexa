import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-white">
        <div className="w-4/5">
          <Image className="w-20 md:w-20" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            QuickCart brings you closer to the future. Shop innovative tech, get unbeatable deals, and enjoy seamless service — all in one place.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-white mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:underline transition" href="#">Home</a></li>
              <li><a className="hover:underline transition" href="#">About us</a></li>
              <li><a className="hover:underline transition" href="#">Contact us</a></li>
              <li><a className="hover:underline transition" href="#">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-white mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>lecaothi100503@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
