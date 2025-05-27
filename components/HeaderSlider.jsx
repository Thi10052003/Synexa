'use client';
import { assets } from "@/assets/assets";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/product/list');
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          setSliderData(json.products.slice(0, 5));
        } else {
          console.error('Invalid product list response:', json);
        }
      } catch (err) {
        console.error('Error fetching product list:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sliderData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((product, index) => (
          <div
            key={product._id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-black border border-white py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full shadow-md"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 font-medium pb-1">
                Hot Deal!
              </p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold text-white">
                {product.name}
              </h1>
              <div className="flex items-center mt-4 md:mt-6">
                {/* Gradient purple button */}
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full text-white font-medium hover:opacity-90 transition"
                >
                  Buy now
                </button>

                {/* Gradient border that turns filled on hover */}
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="ml-4 flex items-center gap-2 px-6 py-2.5 text-white font-medium border rounded-full border-transparent bg-transparent transition group
                             border-[1px] border-[rgba(168,85,247,0.8)] hover:bg-gradient-to-r from-purple-500 to-fuchsia-500"
                >
                  <span className="group-hover:text-white text-white">Details</span>
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48 object-contain"
                src={product.image[0]}
                alt={product.name}
                width={300}
                height={300}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? 'bg-purple-500' : 'bg-white/20'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
