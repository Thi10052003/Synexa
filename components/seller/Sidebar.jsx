'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { HiOutlineCube, HiOutlineShoppingBag, HiOutlineViewGrid } from "react-icons/hi";

const Sidebar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const menu = [
    { label: "Dashboard", icon: <HiOutlineViewGrid size={22} />, path: "/seller/dashboard" },
    { label: "Add Product", icon: <HiOutlineCube size={22} />, path: "/seller/add-product" },
    { label: "Product List", icon: <HiOutlineCube size={22} />, path: "/seller/product-list" },
    { label: "Orders", icon: <HiOutlineShoppingBag size={22} />, path: "/seller/orders" },
  ];

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 border-r border-gray-700
        ${open ? "w-52" : "w-16"}`}
    >
      {/* Hamburger */}
      <div className="p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <FiMenu size={22} />
      </div>

      {/* Menu */}
      <div className="space-y-2 mt-4">
        {menu.map((item, i) => (
          <div
            key={i}
            onClick={() => router.push(item.path)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 rounded-md 
              transition`}
          >
            {item.icon}
            {open && <span className="text-sm">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
