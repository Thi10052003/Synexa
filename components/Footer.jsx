import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      {/* Main content */}
      <div className="flex flex-col gap-10 px-6 py-10 
                      md:flex-row md:px-12 lg:px-32 md:py-14 md:gap-16">

        {/* Logo & Description */}
        <div className="flex-1 min-w-[200px] text-center md:text-left">
          <Image className="w-20 mx-auto md:mx-0" src={assets.logo} alt="Synexa Logo" />
          <p className="mt-4 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 text-gray-600">
            Synexa brings you closer to the future. Shop innovative tech, get unbeatable deals,
            and enjoy seamless service — all in one place.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex-1 min-w-[150px] text-center md:text-left">
          <h2 className="font-medium mb-4 text-gray-900">Company</h2>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-purple-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-purple-600 transition">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-purple-600 transition">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-purple-600 transition">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-[150px] text-center md:text-left">
          <h2 className="font-medium mb-4 text-gray-900">Get in touch</h2>
          <address className="not-italic text-sm space-y-2 text-gray-600">
            <p>+843897xxxx</p>
            <p>
              <a 
                href="mailto:lecaothi100503@gmail.com" 
                className="hover:text-purple-600 transition"
              >
                lecaothi100503@gmail.com
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-200">
        © {new Date().getFullYear()} Synexa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
