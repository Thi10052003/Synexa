"use client";
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-white bg-black relative">
      {/* Logo */}
      <Image
        className="cursor-pointer w-20 md:w-16"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <Link href="/" className="hover:text-purple-400 transition">Home</Link>
        <Link href="/all-products" className="hover:text-purple-400 transition">Shop</Link>
        <Link href="/" className="hover:text-purple-400 transition">About Us</Link>
        <Link href="/" className="hover:text-purple-400 transition">Contact</Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full border-white hover:bg-white hover:text-black transition"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop User Section */}
      <ul className="hidden md:flex items-center gap-4 text-white">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-purple-400 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Right Section */}
      <div className="flex items-center md:hidden gap-3 text-white">
        {/* Hamburger menu for mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-t border-gray-700 flex flex-col p-4 gap-4 md:hidden z-50">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Home</Link>
          <Link href="/all-products" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Shop</Link>
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">About Us</Link>
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Contact</Link>

          {isSeller && (
            <button
              onClick={() => {
                router.push("/seller");
                setMenuOpen(false);
              }}
              className="text-xs border px-4 py-1.5 rounded-full border-white hover:bg-white hover:text-black transition"
            >
              Seller Dashboard
            </button>
          )}

          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push("/all-products")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={() => {
                openSignIn();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 hover:text-purple-400 transition"
            >
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
