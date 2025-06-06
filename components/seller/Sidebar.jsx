import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Add Product', path: '/seller', icon: assets.box },
    { name: 'Product List', path: '/seller/product-list', icon: assets.box },
    { name: 'Orders', path: '/seller/orders', icon: assets.box },
    {
      name: 'Dashboard',
      path: '/seller/dashboard',
      icon: assets.dashboard_icon || assets.box,
    },
  ];

  return (
    <div className="md:w-64 w-16 min-h-screen py-2 flex flex-col text-black bg-grey">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 transition-all duration-200 cursor-pointer
                ${isActive
                  ? "border-r-4 md:border-r-[6px] border-purple-500 bg-purple-800/20"
                  : "hover:bg-gradient-to-r from-purple-500 to-purple-700 hover:text-white"
                }`}
            >
              <Image
                src={item.icon}
                alt={`${item.name.toLowerCase()}_icon`}
                className="w-7 h-7"
              />
              <p className="md:block hidden text-white">{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
