import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext();

    return (
        <div
            onClick={() => {
                router.push('/product/' + product._id);
                scrollTo(0, 0);
            }}
            className="flex flex-col items-start gap-1 w-full sm:max-w-[220px] p-2 sm:p-0 cursor-pointer"
        >
            {/* Product Image */}
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-44 sm:h-52 flex items-center justify-center">
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

            {/* Description (hiển thị cả mobile nhưng rút gọn hơn) */}
            <p className="w-full text-xs text-gray-400 truncate">
                {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon}
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            {/* Price & Buy button */}
            <div className="flex items-center justify-between w-full mt-2">
                <p className="text-sm sm:text-base font-medium">
                    {currency}{product.offerPrice}
                </p>
                <button className="px-3 py-1 text-xs sm:px-4 sm:py-1.5 text-white border border-white/30 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-fuchsia-600 hover:text-white transition">
                    Buy now
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
