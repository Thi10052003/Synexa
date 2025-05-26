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
        console.log("Fetched product data:", json);
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


  // Auto slide
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
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((product, index) => (
          <div
            key={product._id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">Hot Deal!</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {product.name}
              </h1>
              <div className="flex items-center mt-4 md:mt-6">
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium"
                >
                  Buy now
                </button>
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="flex items-center gap-2 px-6 py-2.5 text-orange-600 font-medium border border-orange-600 rounded-full hover:bg-orange-50 transition"
                >
                  Details
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
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
            className={`h-2 w-2 rounded-full cursor-pointer ${currentSlide === index ? 'bg-orange-600' : 'bg-gray-500/30'
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
