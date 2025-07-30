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

  // --- SWIPE HANDLERS ---
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const moveX = e.touches[0].clientX;
    setDragOffset(moveX - touchStartX);
  };

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
      className="overflow-hidden relative w-full"
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
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-black border border-white py-6 px-4 md:px-14 mt-4 rounded-xl min-w-full shadow-md"
          >
            {/* Text Section */}
            <div className="mt-6 md:mt-0 md:pl-8 text-center md:text-left">
              <p className="text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 font-medium pb-1">
                Hot Deal!
              </p>
              <h1 className="text-xl sm:text-2xl md:text-[40px] md:leading-[48px] font-semibold text-white max-w-md">
                {product.name}
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mt-4 md:mt-6">
                {/* Buy Now */}
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="px-6 sm:px-8 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full text-white text-sm sm:text-base font-medium hover:opacity-90 transition w-full sm:w-auto"
                >
                  Buy now
                </button>

                {/* Details */}
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-sm sm:text-base text-white font-medium border rounded-full border-[rgba(168,85,247,0.8)] hover:bg-gradient-to-r from-purple-500 to-fuchsia-500 transition w-full sm:w-auto"
                >
                  <span>Details</span>
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                    loading="lazy"
                  />
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="w-40 sm:w-52 md:w-72 object-contain"
                src={product.image[0]}
                alt={product.name}
                width={300}
                height={300}
                loading="lazy" // ⬅️ Lazy load ảnh sản phẩm
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 md:mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? 'bg-purple-500' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
