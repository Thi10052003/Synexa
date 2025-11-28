'use client';
import { assets } from "@/assets/assets";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/product/list');
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          setSliderData(json.products.slice(0, 5));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sliderData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [sliderData]);

  const handleSlideChange = (index) => setCurrentSlide(index);

  const handleTouchStart = (e) =>
    setTouchStartX(e.touches[0].clientX);

  const handleTouchMove = (e) =>
    setDragOffset(e.touches[0].clientX - touchStartX);

  const handleTouchEnd = () => {
    const threshold = 50;
    if (dragOffset < -threshold) {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    } else if (dragOffset > threshold) {
      setCurrentSlide((prev) =>
        prev === 0 ? sliderData.length - 1 : prev - 1
      );
    }
    setDragOffset(0);
  };

  return (
    <div
      className="overflow-hidden relative w-full pb-6 bg-white"   // 💡 nền trắng hoàn toàn
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`
        }}
      >
        {sliderData.map((product) => (
          <div
            key={product._id}
            className="min-w-full px-6 md:px-14 py-10 mt-6 flex justify-center"
          >

            {/* Neumorphic Card */}
            <div
              className="
                w-full max-w-6xl rounded-3xl p-10
                bg-white
                shadow-[10px_10px_25px_#d5d5d5,-10px_-10px_25px_#ffffff]
                flex flex-col-reverse md:flex-row items-center justify-between 
                gap-10
              "
            >

              {/* Text Section */}
              <div className="text-center md:text-left max-w-md">

                <p className="text-purple-600 font-semibold pb-1 text-sm md:text-base">
                  Hot Deal!
                </p>

                <h1
                  className="
    text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug
    bg-gradient-to-r from-[#6D4EFF] via-[#A051B2] to-[#F7763B]
    text-transparent bg-clip-text drop-shadow-[1px_1px_2px_rgba(0,0,0,0.15)]
  "
                >
                  {product.name}
                </h1>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center md:justify-start gap-4 mt-6">

                  {/* Buy Now */}
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="
    px-8 py-3 rounded-full text-white font-medium
    bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
    shadow-[5px_5px_12px_#d5d5d5,-5px_-5px_12px_#ffffff]
    hover:opacity-90 transition
    w-full sm:w-auto
  "
                  >
                    Buy now
                  </button>

                  {/* Details */}
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="
                      flex items-center gap-2 px-6 py-3 rounded-full 
                      text-gray-700 font-medium 
                      bg-white
                      border border-gray-300
                      shadow-[5px_5px_12px_#d5d5d5,-5px_-5px_12px_#ffffff]
                      hover:bg-gray-50
                      transition 
                      w-full sm:w-auto
                    "
                  >
                    <span>Details</span>
                    <Image src={assets.arrow_icon} alt="arrow" />
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex items-center justify-center flex-1">
                <Image
                  className="w-44 sm:w-56 md:w-72 drop-shadow-xl"
                  src={product.image[0]}
                  alt={product.name}
                  width={300}
                  height={300}
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Slider Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`
              h-3 w-3 rounded-full cursor-pointer transition
              ${currentSlide === index ? "bg-purple-600" : "bg-gray-300"}
            `}
          />
        ))}
      </div>

    </div>
  );
};

export default HeaderSlider;
