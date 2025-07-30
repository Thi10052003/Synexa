import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Spline from '@splinetool/react-spline';

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="flex flex-col items-center pt-10 px-4 md:px-8 text-white">
      {/* 3D Banner */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] mb-8">
        <Spline scene="https://prod.spline.design/zit8CaEvh45UpYGk/scene.splinecode" />
      </div>

      {/* Section Title */}
      <p className="text-xl sm:text-2xl font-bold text-left w-full mb-4 
                     bg-gradient-to-r from-purple-500 via-white to-purple-500 
                     text-transparent bg-clip-text">
        Popular products
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-4 pb-10 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* See More Button */}
      <button
        onClick={() => router.push('/all-products')}
        className="mt-4 px-8 py-2 border rounded text-sm sm:text-base 
                   text-white border-white hover:bg-white/10 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;

