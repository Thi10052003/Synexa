'use client';
import { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { trackEvent } from "@/lib/tracker";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, user } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const viewStart = useRef(Date.now());

  useEffect(() => {
    if (id) {
      trackEvent("product_view", { product_id: id });
    }

    return () => {
      const duration = (Date.now() - viewStart.current) / 1000;
      trackEvent("product_view_end", {
        product_id: id,
        time_on_page_seconds: duration,
      });
    };
  }, [id]);

  useEffect(() => {
    if (products?.length > 0) {
      const product = products.find((p) => p._id === id);
      if (product) {
        setProductData(product);
        setMainImage(product.image?.[0]);
      }
    }
  }, [id, products]);

  if (!productData) return <Loading />;

  const handleAddToCart = () => {
    trackEvent("add_to_cart", {
      product_id: productData._id,
      qty: 1,
      price: productData.offerPrice ?? productData.price,
    });

    addToCart(productData._id);
  };

  const handleBuyNow = () => {
    trackEvent("buy_now", {
      product_id: productData._id,
      price: productData.offerPrice ?? productData.price,
    });

    addToCart(productData._id);
    router.push(user ? "/cart" : "");
  };

  return (
    <>
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="px-4 md:px-16 lg:px-32 pt-14 space-y-10 text-black bg-white">

        {/* TOP SECTION */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16">

          {/* Images Section */}
          <div className="px-0 md:px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-white mb-4 shadow-sm">
              <Image
                src={mainImage || productData.image?.[0]}
                alt="main product"
                className="w-full h-auto object-contain"
                width={1280}
                height={720}
              />
            </div>

            <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto">
              {productData.image?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    trackEvent("product_variant_click", {
                      product_id: productData._id,
                      image_index: idx,
                    });
                    setMainImage(img);
                  }}
                  className="cursor-pointer flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white w-20 h-20 md:w-auto md:h-auto p-1 shadow-sm"
                >
                  <Image
                    src={img}
                    alt={`image ${idx}`}
                    className="w-full h-full object-contain"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">

            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {productData.name}
            </h1>

            <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
              {productData.description}
            </p>

            {/* PRICE */}
            <p className="text-2xl font-bold text-orange-600 mt-4 mb-6">
              {productData.offerPrice}
              <span className="text-gray-400 line-through ml-3 text-lg">
                {productData.price}
              </span>
            </p>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-xs text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-500 font-medium pr-4 py-1">Brand</td>
                    <td className="text-gray-700">{productData.brand || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 font-medium pr-4 py-1">Category</td>
                    <td className="text-gray-700">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center mt-10 gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="
                  w-full py-3.5 font-medium text-white
                   bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                  rounded hover:opacity-90 transition
                "
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">

            <p className="text-2xl md:text-3xl font-semibold text-center">
              Featured{" "}
              <span
                className="
                  bg-gradient-to-r from-[#7B5CFF] via-[#B46CDB] to-[#FF7A45]
                  text-transparent bg-clip-text
                "
              >
                Products
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          <button 
          onClick={() => router.push("/all-products")}
          className="px-8 py-2 mb-16 border rounded text-black hover:bg-gray-100 transition">
            See more
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;
