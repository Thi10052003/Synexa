'use client';
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, user } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

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

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-16 lg:px-32 pt-14 space-y-10 text-white bg-black-900">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <div className="px-0 md:px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-white mb-4">
              <Image
                src={mainImage || productData.image?.[0]}
                alt="main product"
                className="w-full h-auto object-cover"
                width={1280}
                height={720}
              />
            </div>

            {/* Thumbnails - Horizontal scroll on mobile */}
            <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto">
              {productData.image?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className="cursor-pointer flex-shrink-0 rounded-lg overflow-hidden bg-white w-20 h-20 md:w-auto md:h-auto"
                >
                  <Image
                    src={img}
                    alt={`image ${idx}`}
                    className="w-full h-full object-cover"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-medium mb-4">{productData.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, idx) => (
                  <Image key={idx} className="h-4 w-4" src={assets.star_icon} alt="star" />
                ))}
                <Image className="h-4 w-4" src={assets.star_dull_icon} alt="half star" />
              </div>
              <p className="text-sm">(4.5)</p>
            </div>
            <p className="text-gray-300 mt-3 text-sm md:text-base">{productData.description}</p>
            <p className="text-2xl md:text-3xl font-medium mt-6">
              {productData.offerPrice ?? "N/A"}
              <span className="text-sm md:text-base font-normal text-gray-400 line-through ml-2">
                {productData.price ?? "N/A"}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />

            {/* Product Details */}
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-xs text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-400 font-medium pr-4">Brand</td>
                    <td className="text-gray-200">{productData.brand?.trim() || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 font-medium pr-4">Color</td>
                    <td className="text-gray-200">Multi</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 font-medium pr-4">Category</td>
                    <td className="text-gray-200">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center mt-10 gap-4">
              <button
                onClick={() => addToCart(productData._id)}
                className="w-full py-3.5 bg-gray-600 text-white hover:bg-gray-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push(user ? '/cart' : '');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-2xl md:text-3xl font-medium text-center">
              Featured <span className="font-medium text-purple-500">Products</span>
            </p>
            <div className="w-20 md:w-28 h-0.5 bg-purple-500 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-white hover:bg-gray-700 transition">
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
