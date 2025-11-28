'use client';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from 'next/image';
import stripe_logo from '@/assets/stripe_logo.png';
import { trackEvent } from "@/lib/tracker";

const OrderSummary = () => {

  const { currency, router, getToken, user, cartItems, setCartItems, products } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaceOrderClicked, setIsPlaceOrderClicked] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const buildCheckoutItems = () => {
    return Object.keys(cartItems)
      .map(id => {
        const product = products.find(p => p._id === id);
        if (!product) return null;
        return {
          product_id: id,
          qty: cartItems[id],
          price: product.offerPrice,
        };
      })
      .filter(Boolean);
  };

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const getCartAmount = () => {
    let total = 0;
    for (let key in cartItems) {
      const product = products.find(p => p._id === key);
      if (product?.offerPrice) total += product.offerPrice * cartItems[key];
    }
    return total;
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const saveOrderSnapshot = (type) => {
    const items = buildCheckoutItems();

    localStorage.setItem("last_order_items", JSON.stringify(items));
    localStorage.setItem("last_order_total", getCartAmount());
    localStorage.setItem("last_order_payment_method", type);
  };

  const createOrder = async () => {
    try {
      if (!user) return toast('Please login to place order', { icon: '⚠️' });
      if (!selectedAddress) return toast.error('Please select an address');

      const items = buildCheckoutItems();

      trackEvent("checkout_start", {
        payment_method: "COD",
        total_value: getCartAmount(),
        item_count: getCartCount(),
        items,
      });

      saveOrderSnapshot("COD");

      const cartItemsArray = Object.keys(cartItems)
        .map(key => ({ product: key, quantity: cartItems[key] }))
        .filter(item => item.quantity > 0);

      const token = await getToken();
      const { data } = await axios.post(
        '/api/order/create',
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        if (data.orderId) {
          localStorage.setItem("last_order_id", data.orderId);
        }

        toast.success(data.message);
        setCartItems({});
        router.push('/order-placed');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const createOrderStripe = async () => {
    try {
      if (!user) return toast('Please login to place order', { icon: '⚠️' });
      if (!selectedAddress) return toast.error('Please select an address');

      const items = buildCheckoutItems();

      trackEvent("checkout_start", {
        payment_method: "Stripe",
        total_value: getCartAmount(),
        item_count: getCartCount(),
        items,
      });

      saveOrderSnapshot("Stripe");

      const cartItemsArray = Object.keys(cartItems)
        .map(key => ({ product: key, quantity: cartItems[key] }))
        .filter(item => item.quantity > 0);

      const token = await getToken();
      const { data } = await axios.post(
        '/api/order/stripe',
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        if (data.orderId) {
          localStorage.setItem("last_order_id", data.orderId);
        }
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { if (user) fetchUserAddresses(); }, [user]);

  /* --------------------------------------------------------
       APPLE VISION PRO UI GLASS PANEL WRAPPER
     -------------------------------------------------------- */
  return (
    <div className="relative w-full md:w-96 p-6 rounded-[28px]">

      {/* 1️⃣ FROST GLASS */}
      <div className="
        absolute inset-0 rounded-[28px]
        bg-gradient-to-br from-white/55 via-white/30 to-white/15
        backdrop-blur-[80px]
        border border-white/40
        shadow-[0_30px_80px_-10px_rgba(0,0,0,0.35)]
        pointer-events-none
      " />

      {/* 2️⃣ Fog Rim Light */}
      <div className="
        absolute inset-0 rounded-[28px]
        bg-gradient-to-tr from-white/40 via-white/10 to-transparent
        opacity-60
        pointer-events-none
      " />

      {/* 3️⃣ Highlight */}
      <div className="
        absolute inset-0 rounded-[28px]
        bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.45),rgba(255,255,255,0)_60%)]
        opacity-40
        pointer-events-none
      " />

      {/* 4️⃣ Noise */}
      <div className="
        absolute inset-0 rounded-[28px]
        mix-blend-overlay opacity-[0.22]
        bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]
        pointer-events-none
      " />

      {/* 5️⃣ REAL CONTENT */}
      <div className="relative z-10 text-black">

        <h2 className="text-lg md:text-2xl font-semibold">Order Summary</h2>
        <hr className="border-black/10 my-4" />

        <div className="space-y-6">

          {/* Address */}
          <div>
            <label className="text-sm font-medium uppercase block mb-2">
              Select Address
            </label>

            <div className="relative w-full text-sm border border-black/20 rounded-lg bg-white/40">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-left px-3 py-2 flex justify-between items-center"
              >
                <span className="truncate">
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                    : "Select Address"}
                </span>

                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#555"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white backdrop-blur-xl border border-black/10 shadow-md mt-1 z-10 max-h-40 overflow-y-auto rounded-md">
                  {userAddresses.map((address, i) => (
                    <li
                      key={i}
                      onClick={() => handleAddressSelect(address)}
                      className="px-4 py-2 hover:bg-black/5 cursor-pointer"
                    >
                      {address.fullName}, {address.area}, {address.city}
                    </li>
                  ))}

                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 text-center hover:bg-black/5 cursor-pointer"
                  >
                    + Add New Address
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between">
              <p className="uppercase">Items {getCartCount()}</p>
              <p>{currency}{getCartAmount()}</p>
            </div>

            <div className="flex justify-between">
              <p>Shipping Fee</p>
              <p className="font-medium">Free</p>
            </div>

            <div className="flex justify-between">
              <p>Tax (2%)</p>
              <p className="font-medium">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
            </div>

            <div className="flex justify-between text-lg font-medium border-t border-black/10 pt-3">
              <p>Total</p>
              <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        {!isPlaceOrderClicked ? (
          <button
            onClick={() => setIsPlaceOrderClicked(true)}
            className="
              w-full py-2 mt-6 rounded-full
              text-white font-medium
              bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
              hover:opacity-90 transition
            "
          >
            Place Order
          </button>
        ) : (
          <div className="flex flex-col md:flex-row gap-2 mt-6">

            <button
              onClick={createOrder}
              className="
                w-full py-2 rounded-full text-white font-medium
                bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                hover:opacity-90 transition
              "
            >
              Cash On Delivery
            </button>

            <button
              onClick={createOrderStripe}
              className="w-full flex justify-center items-center border border-indigo-500 bg-white hover:bg-gray-100 py-2 rounded-full"
            >
              <Image className="w-12" src={stripe_logo} alt="Stripe Logo" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderSummary;
