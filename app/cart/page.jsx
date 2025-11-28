'use client'
import React, { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { trackEvent } from "@/lib/tracker";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  useEffect(() => {
    trackEvent("cart_view", {
      cart_count: getCartCount(),
      distinct_items: Object.keys(cartItems).length
    });
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-10 px-4 md:px-16 lg:px-32 pt-14 mb-20 text-black bg-white">

        {/* LEFT SECTION */}
        <div className="flex-1">

          {/* Title */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-6">
            <p className="text-2xl md:text-3xl text-black">
              Your{" "}
              <span className="font-medium bg-gradient-to-r from-[#7B5CFF] via-[#B46CDB] to-[#FF7A45] text-transparent bg-clip-text">
                Cart
              </span>
            </p>
            <p className="text-lg md:text-xl text-gray-600">{getCartCount()} Items</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">

            <table className="min-w-full table-auto text-black">
              <thead className="text-left bg-white/50 backdrop-blur-xl">
                <tr>
                  <th className="pb-6 px-4 font-medium text-gray-700">Product Details</th>
                  <th className="pb-6 px-4 font-medium text-gray-700">Price</th>
                  <th className="pb-6 px-4 font-medium text-gray-700">Quantity</th>
                  <th className="pb-6 px-4 font-medium text-gray-700">Subtotal</th>
                </tr>
              </thead>

              <tbody>

                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  return (
                    <tr key={itemId} className="border-b border-gray-200">

                      <td className="flex items-center gap-4 py-4 px-4">

                        {/* Product Image */}
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-200/60 backdrop-blur-lg p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-contain"
                              width={80}
                              height={80}
                            />
                          </div>

                          <button
                            className="text-xs text-red-500 mt-1 hover:underline"
                            onClick={() => {
                              trackEvent("remove_from_cart", {
                                product_id: product._id,
                                qty: cartItems[itemId]
                              });
                              updateCartQuantity(product._id, 0);
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="text-sm hidden md:block">
                          <p className="text-black">{product.name}</p>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="py-4 px-4 text-black">
                        ${product.offerPrice}
                      </td>

                      {/* QUANTITY */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">

                          {/* Decrease */}
                          <button
                            onClick={() => {
                              const oldQty = cartItems[itemId];
                              const newQty = oldQty - 1;

                              trackEvent("cart_update_quantity", {
                                product_id: product._id,
                                old_qty: oldQty,
                                new_qty: newQty
                              });

                              updateCartQuantity(product._id, newQty);
                            }}
                          >
                            <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4" />
                          </button>

                          {/* Input */}
                          <input
                            onChange={e => {
                              const newQty = Number(e.target.value);
                              const oldQty = cartItems[itemId];

                              trackEvent("cart_update_quantity", {
                                product_id: product._id,
                                old_qty: oldQty,
                                new_qty: newQty
                              });

                              updateCartQuantity(product._id, newQty);
                            }}
                            type="number"
                            value={cartItems[itemId]}
                            className="w-10 border border-gray-400 text-center bg-white text-black rounded"
                          />

                          {/* Increase */}
                          <button
                            onClick={() => {
                              const oldQty = cartItems[itemId];
                              const newQty = oldQty + 1;

                              trackEvent("cart_update_quantity", {
                                product_id: product._id,
                                old_qty: oldQty,
                                new_qty: newQty
                              });

                              addToCart(product._id);
                            }}
                          >
                            <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* SUBTOTAL */}
                      <td className="py-4 px-4 text-black font-medium">
                        ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                      </td>
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
                <div
                  key={itemId}
                  className="
                    flex gap-4 p-4 rounded-2xl
                    bg-white/40 backdrop-blur-xl border border-gray-300 shadow-lg
                  "
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      className="w-20 h-20 object-contain rounded-md"
                      width={80}
                      height={80}
                    />

                    <button
                      className="text-xs text-red-500 mt-1 hover:underline"
                      onClick={() => {
                        trackEvent("remove_from_cart", {
                          product_id: product._id,
                          qty: cartItems[itemId]
                        });
                        updateCartQuantity(product._id, 0);
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <p className="text-black text-sm">{product.name}</p>
                    <p className="text-gray-600 text-sm">${product.offerPrice}</p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">

                      <button
                        onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}
                      >
                        <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4" />
                      </button>

                      <input
                        type="number"
                        value={cartItems[itemId]}
                        onChange={e => updateCartQuantity(product._id, Number(e.target.value))}
                        className="w-10 border text-center bg-white text-black rounded"
                      />

                      <button
                        onClick={() => addToCart(product._id)}
                      >
                        <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-gray-700 text-sm mt-1">
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
            className="
              group flex items-center mt-6 gap-2 
              text-black font-medium px-5 py-2 
              rounded-full border border-black/20 
              hover:bg-black hover:text-white transition
            "
          >
            Continue Shopping →
          </button>
        </div>

        {/* RIGHT SECTION: ORDER SUMMARY */}
        <div className="md:w-1/3 w-full">
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Cart;
