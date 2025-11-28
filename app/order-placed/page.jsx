'use client'

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracker';
import { useUser } from "@clerk/nextjs";

const OrderPlaced = () => {
  const { router } = useAppContext();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return; 
    if (!user) return;    

    try {
      const orderId = localStorage.getItem("last_order_id");
      const totalValue = Number(localStorage.getItem("last_order_total") || 0);
      const items = JSON.parse(localStorage.getItem("last_order_items") || "[]");

      if (orderId && items.length > 0) {
        trackEvent("purchase", {
          order_id: orderId,
          total_value: totalValue,
          items
        });

        console.log("PURCHASE SENT");
      } else {
        console.warn("Missing purchase info");
      }

      localStorage.removeItem("last_order_id");
      localStorage.removeItem("last_order_total");
      localStorage.removeItem("last_order_items");

    } catch (e) {
      console.error("Failed to track purchase:", e);
    }

    const timeout = setTimeout(() => {
      router.push('/my-orders');
    }, 9000);

    return () => clearTimeout(timeout);

  }, [isLoaded, user]); 

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl text-white font-semibold">
        Order Placed Successfully
      </div>
    </div>
  );
};

export default OrderPlaced;
