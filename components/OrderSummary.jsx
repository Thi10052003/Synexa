'use client';
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from 'next/image';
import stripe_logo from '@/assets/stripe_logo.png';

const OrderSummary = () => {
  const { currency, router, getToken, user, cartItems, setCartItems, products } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaceOrderClicked, setIsPlaceOrderClicked] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } });
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

  const getCartCount = () => Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const createOrder = async () => {
    try {
      if (!user) return toast('Please login to place order', { icon: '⚠️' });
      if (!selectedAddress) return toast.error('Please select an address');

      const cartItemsArray = Object.keys(cartItems)
        .filter(key => products.find(p => p._id === key))
        .map(key => ({ product: key, quantity: cartItems[key] }))
        .filter(item => item.quantity > 0);

      if (cartItemsArray.length === 0) return toast.error('Cart is empty or contains invalid items');

      const token = await getToken();
      const { data } = await axios.post('/api/order/create', { address: selectedAddress._id, items: cartItemsArray }, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        router.push('/order-placed');
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createOrderStripe = async () => {
    try {
      if (!user) return toast('Please login to place order', { icon: '⚠️' });
      if (!selectedAddress) return toast.error('Please select an address');

      const cartItemsArray = Object.keys(cartItems)
        .filter(key => products.find(p => p._id === key))
        .map(key => ({ product: key, quantity: cartItems[key] }))
        .filter(item => item.quantity > 0);

      if (cartItemsArray.length === 0) return toast.error('Cart is empty or contains invalid items');

      const token = await getToken();
      const { data } = await axios.post('/api/order/stripe', { address: selectedAddress._id, items: cartItemsArray }, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) window.location.href = data.url;
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { if (user) fetchUserAddresses(); }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-800 p-4 md:p-5 text-white rounded-md shadow-md mt-4 md:mt-0">
      <h2 className="text-lg md:text-2xl font-medium">Order Summary</h2>
      <hr className="border-gray-600 my-4" />

      <div className="space-y-6">
        {/* Address Selector */}
        <div>
          <label className="text-sm md:text-base font-medium uppercase block mb-2">Select Address</label>
          <div className="relative w-full text-sm border border-gray-600 rounded">
            <button
              className="w-full text-left px-3 py-2 bg-gray-700 text-white focus:outline-none flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                  : "Select Address"}
              </span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ccc">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <ul className="absolute w-full bg-gray-700 border border-gray-600 shadow-md mt-1 z-10 max-h-40 overflow-y-auto">
                {userAddresses.map((address, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-purple-800 cursor-pointer text-sm" onClick={() => handleAddressSelect(address)}>
                    {address.fullName}, {address.area}, {address.city}
                  </li>
                ))}
                <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-purple-800 cursor-pointer text-center text-sm">
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-sm md:text-base font-medium uppercase block mb-2">Promo Code</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input type="text" placeholder="Enter promo code" className="flex-grow w-full outline-none p-2 text-white bg-gray-700 border border-gray-600 rounded" />
            <button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-5 py-2 rounded hover:opacity-90 text-sm">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-600 my-4" />

        {/* Price Details */}
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
          <div className="flex justify-between text-lg font-medium border-t border-gray-600 pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {!isPlaceOrderClicked ? (
        <button onClick={() => setIsPlaceOrderClicked(true)} className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-2 mt-4 rounded hover:opacity-90 text-sm md:text-base">
          Place Order
        </button>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <button onClick={createOrder} className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-2 rounded hover:opacity-90 text-sm md:text-base">
            Cash On Delivery
          </button>
          <button onClick={createOrderStripe} className="w-full flex justify-center items-center border border-indigo-500 bg-white hover:bg-gray-100 py-2 rounded">
            <Image className="w-12" src={stripe_logo} alt="Stripe Logo" width={80} height={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
