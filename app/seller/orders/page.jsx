'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        const filtered = data.orders
          .map(order => ({
            ...order,
            items: order.items.filter(item => item.product !== null)
          }))
          .filter(order => order.items.length > 0);

        setOrders(filtered);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        '/api/order/mark-delivered',
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setLoading(true);
        fetchSellerOrders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update order.");
    }
  };

  useEffect(() => {
    if (user) fetchSellerOrders();
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-white text-black">

      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold">Orders</h2>

          <div className="space-y-5">
            {orders.map((order, index) => (
              <div
                key={index}
                className="
                  p-5 rounded-2xl 
                  bg-white/60 backdrop-blur-xl 
                  border border-gray-300 
                  shadow-[0_4px_30px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_6px_40px_rgba(0,0,0,0.12)]
                  transition
                  flex flex-col md:flex-row gap-6 justify-between
                "
              >
                {/* Product Info */}
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="flex gap-3">
                    {order.items[0]?.product?.image?.[0] ? (
                      <Image
                        src={order.items[0].product.image[0]}
                        alt={order.items[0].product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}

                    <div className="flex flex-col justify-center gap-1">
                      <p className="font-medium text-sm">
                        {order.items
                          .map(item => `${item.product.name} x ${item.quantity}`)
                          .join(", ")}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Items: {order.items.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col text-xs md:text-sm w-full md:w-1/4">
                  <p className="font-semibold">{order.address.fullName}</p>
                  <p>{order.address.area}</p>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.phoneNumber}</p>
                </div>

                {/* Price */}
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-base text-orange-600 md:text-right">
                    {currency}{order.amount}
                  </p>
                </div>

                {/* Payment + Delivery */}
                <div className="flex flex-col text-xs md:text-sm gap-1 md:items-end">
                  <p className="text-gray-700">Method: {order.paymentType || "COD"}</p>
                  <p className="text-gray-700">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    Payment: {order.isPaid ? "Paid" : "Pending"}
                  </p>
                  <p className="text-gray-700">
                    Delivery: {order.deliveryStatus || "Undelivered"}
                  </p>

                  {order.deliveryStatus !== "Delivered" && (
                    <button
                      onClick={() => markAsDelivered(order._id)}
                      className="
                        mt-2 px-4 py-1.5 rounded-lg
                        text-white text-xs md:text-sm font-medium
                        bg-gradient-to-r from-purple-500 to-purple-700
                        hover:opacity-90 transition
                        shadow-sm
                      "
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;
