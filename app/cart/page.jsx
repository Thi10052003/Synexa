'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-4 md:px-16 lg:px-32 pt-14 mb-20 text-white">
        <div className="flex-1">
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-100">
              Your <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-300">{getCartCount()} Items</p>
          </div>

          {/* Product List */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-6 px-4 text-gray-300 font-medium">Product Details</th>
                  <th className="pb-6 px-4 text-gray-300 font-medium">Price</th>
                  <th className="pb-6 px-4 text-gray-300 font-medium">Quantity</th>
                  <th className="pb-6 px-4 text-gray-300 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;
                  return (
                    <tr key={itemId}>
                      <td className="flex items-center gap-4 py-4 px-4">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-600 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-purple-300 mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-white">{product.name}</p>
                          <button
                            className="text-xs text-purple-300 mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">${product.offerPrice}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                            <Image src={assets.decrease_arrow} alt="decrease_arrow" className="w-4 h-4" />
                          </button>
                          <input 
                            onChange={e => updateCartQuantity(product._id, Number(e.target.value))} 
                            type="number" 
                            value={cartItems[itemId]} 
                            className="w-10 border text-center bg-gray-700 text-white" 
                          />
                          <button onClick={() => addToCart(product._id)}>
                            <Image src={assets.increase_arrow} alt="increase_arrow" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">${(product.offerPrice * cartItems[itemId]).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {Object.keys(cartItems).map((itemId) => {
              const product = products.find(p => p._id === itemId);
              if (!product || cartItems[itemId] <= 0) return null;
              return (
                <div key={itemId} className="flex gap-4 bg-gray-800 p-4 rounded-lg">
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                      width={1280}
                      height={720}
                    />
                    <button
                      className="text-xs text-purple-300 mt-1 block"
                      onClick={() => updateCartQuantity(product._id, 0)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <p className="text-white text-sm">{product.name}</p>
                    <p className="text-gray-300 text-sm">${product.offerPrice}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                        <Image src={assets.decrease_arrow} alt="decrease_arrow" className="w-4 h-4" />
                      </button>
                      <input
                        onChange={e => updateCartQuantity(product._id, Number(e.target.value))}
                        type="number"
                        value={cartItems[itemId]}
                        className="w-10 border text-center bg-gray-700 text-white"
                      />
                      <button onClick={() => addToCart(product._id)}>
                        <Image src={assets.increase_arrow} alt="increase_arrow" className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Subtotal: ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => router.push('/all-products')}
            className="group flex items-center mt-6 gap-2 text-white bg-gradient-to-r from-purple-600 to-purple-400 px-4 py-2 rounded shadow-md hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 w-full">
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Cart;
