'use client';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  useEffect(() => {
    let updated = [...products];

    if (selectedCategory !== "All") {
      updated = updated.filter(p => p.category === selectedCategory);
    }

    if (sortOrder === "lowToHigh") {
      updated.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "highToLow") {
      updated.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    setFilteredProducts(updated);
  }, [products, selectedCategory, sortOrder]);

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-start px-4 md:px-16 lg:px-32 text-black min-h-screen bg-white">

        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full pt-12 gap-6">

          {/* Title */}
          <p className="text-2xl font-bold 
            bg-gradient-to-r from-purple-600 via-purple-400 to-pink-500
            text-transparent bg-clip-text
          ">
            All Products
          </p>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="
                bg-white border border-gray-300 text-black 
                px-3 py-2 rounded w-full sm:w-auto
              "
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Price Sort */}
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="
                bg-white border border-gray-300 text-black 
                px-3 py-2 rounded w-full sm:w-auto
              "
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>

          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
            gap-4 sm:gap-6 mt-10 pb-14 w-full">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
};

export default AllProducts;
