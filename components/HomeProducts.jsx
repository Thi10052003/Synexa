import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Spline from "@splinetool/react-spline";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="flex flex-col items-center pt-10 px-4 md:px-8 text-gray-800">
      {/* 3D Banner */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] mb-8">
        <Spline scene="https://prod.spline.design/zit8CaEvh45UpYGk/scene.splinecode" />
      </div>

      {/* Section Title */}
      <p
        className="
          text-xl sm:text-2xl font-bold text-left w-full mb-4 
          bg-gradient-to-r from-purple-600 via-gray-900 to-purple-600 
          text-transparent bg-clip-text
        "
      >
        Popular products
      </p>

      {/* Product Grid */}
      <div className="
  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
  lg:grid-cols-4 xl:grid-cols-4 
  gap-6 mt-4 pb-10 w-full
">
  {products.slice(0, 12).map((product, index) => (
    <ProductCard key={index} product={product} />
  ))}
</div>

<button
  onClick={() => router.push("/all-products")}
  className="
    group relative
    mt-4 px-6 py-2 rounded-full text-sm sm:text-base font-medium
    text-black
    border border-transparent
    transition-all duration-200
    flex items-center gap-2
  "
>
  {/* Text */}
  <span className="transition duration-200">
    See more
  </span>

  {/* Arrow appears on hover */}
  <span
    className="
      opacity-0 group-hover:opacity-100
      translate-x-[-4px] group-hover:translate-x-0
      transition-all duration-200
      text-black
    "
  >
    →
  </span>

  {/* Border (rounded pill) on hover → fixed with z-index */}
  <span
    className="
      absolute inset-0 rounded-full
      z-10
      pointer-events-none
      group-hover:border-black
      group-hover:border
      transition-all duration-200
    "
  />
</button>

    </div>
  );
};

export default HomeProducts;
