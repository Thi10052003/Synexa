'use client';
import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/tracker";

const ProductCard = ({ product }) => {
    const { currency } = useAppContext();
    const router = useRouter();

    const handleClick = () => {
        trackEvent("product_click", {
            product_id: product?._id || product?.id,
            category_id: product?.category,
            price: product?.price
        });
        router.push('/product/' + product._id);
        scrollTo(0, 0);
    };

    return (
        <div
            onClick={handleClick}
            className="flex flex-col items-start gap-1 w-full sm:max-w-[220px] p-2 sm:p-0 cursor-pointer"
        >
            {/* Product Image */}
            <div className="
  cursor-pointer group relative 
  bg-transparent rounded-lg
  w-full h-44 sm:h-52 
  flex items-center justify-center
">


                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-contain w-4/5 h-4/5 sm:w-full sm:h-full"
                    width={800}
                    height={800}
                />
            </div>

            {/* Product Name */}
            <p className="text-sm sm:text-base font-medium pt-2 w-full truncate">
                {product.name}
            </p>


            {/* Price + Button */}
            <div className="flex items-center justify-between w-full mt-2">
                <p className="text-sm sm:text-base font-medium">
                    {currency}{product.offerPrice}
                </p>

            </div>
        </div>
    );
};

export default ProductCard;
