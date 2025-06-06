'use client';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none"); // none | lowToHigh | highToLow
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
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 text-white min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full pt-12 gap-6">
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-white to-purple-500 text-transparent bg-clip-text">
            All products
          </p>

          <div className="flex gap-4 flex-wrap">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Price Sort */}
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10 pb-14 w-full">
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