'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const filtered = data.orders
          .map(order => ({
            ...order,
            items: order.items.filter(item => item.product !== null),
          }))
          .filter(order => order.items.length > 0);

        setOrders(filtered.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-4 md:px-16 lg:px-32 py-6 min-h-screen text-white">
        <div className="space-y-5 w-full">
          <h2 className="text-lg font-semibold mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-gray-400 text-center mt-6">No orders found.</p>
          ) : (
            <div className="max-w-5xl border-t border-gray-600 text-sm mx-auto">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 justify-between p-5 border-b border-gray-700"
                >
                  {/* Product Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {order.items[0]?.product?.image?.[0] ? (
                      <Image
                        className="w-16 h-16 object-cover rounded"
                        src={order.items[0].product.image[0]}
                        alt={order.items[0].product.name}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs text-white">
                        No Image
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base leading-snug">
                        {order.items.map(item => `${item.product.name} x ${item.quantity}`).join(", ")}
                      </span>
                      <span className="text-gray-400 text-sm">Items: {order.items.length}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:w-56 text-sm">
                    <p className="leading-snug">
                      <span className="font-medium block">{order.address.fullName}</span>
                      <span>{order.address.area}</span>
                      <span className="block">{`${order.address.city}, ${order.address.state}`}</span>
                      <span className="block">{order.address.phoneNumber}</span>
                    </p>
                  </div>

                  {/* Price */}
                  <p className="font-semibold text-base my-auto text-purple-400 md:text-right">
                    {currency}{order.amount}
                  </p>

                  {/* Payment & Delivery */}
                  <div className="text-xs md:text-sm text-gray-300 flex flex-col gap-1 md:w-40">
                    <span>Method: {order.paymentType || "COD"}</span>
                    <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                    <span>Payment: {order.isPaid ? "Paid ✅" : "Pending ⏳"}</span>
                    <span>Delivery: {order.deliveryStatus || "Undelivered"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
