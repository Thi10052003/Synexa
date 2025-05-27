import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Spline from '@splinetool/react-spline';

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="flex flex-col items-center pt-14 text-white">
      <div className="w-full h-[600px] mb-10">
        <Spline scene="https://prod.spline.design/zit8CaEvh45UpYGk/scene.splinecode" />
      </div>
      
      <p className="text-2xl font-bold text-left w-full bg-gradient-to-r from-purple-500 via-white to-purple-500 text-transparent bg-clip-text">
  Popular products
</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      <button
        onClick={() => router.push('/all-products')}
        className="px-12 py-2.5 border rounded text-white border-white hover:bg-white/10 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
