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
      const { data } = await axios.put('/api/order/mark-delivered', { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        setLoading(true);
        await fetchSellerOrders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update order.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between text-sm text-white bg-black">
      {loading ? <Loading /> : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>

          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 md:gap-5 justify-between p-4 border rounded-md border-gray-600 bg-gray-900"
              >
                {/* Product Info */}
                <div className="flex flex-col md:flex-row md:flex-1 gap-3">
                  <div className="flex gap-3">
                    {order.items[0]?.product?.image?.[0] ? (
                      <Image
                        className="w-16 h-16 object-cover rounded"
                        src={order.items[0].product.image[0]}
                        alt={order.items[0].product.name}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {order.items.map(item => `${item.product.name} x ${item.quantity}`).join(", ")}
                      </span>
                      <span className="text-gray-400 text-xs">Items: {order.items.length}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col text-xs md:text-sm md:w-1/4">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p>{order.address.area}</p>
                  <p>{`${order.address.city}, ${order.address.state}`}</p>
                  <p>{order.address.phoneNumber}</p>
                </div>

                {/* Price */}
                <p className="font-medium my-auto md:text-right">{currency}{order.amount}</p>

                {/* Payment & Delivery */}
                <div className="flex flex-col text-xs md:text-sm gap-1 md:items-end">
                  <p>Method: {order.paymentType || 'COD'}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Payment: {order.isPaid ? 'Paid' : 'Pending'}</p>
                  <p>Delivery: {order.deliveryStatus || 'Undelivered'}</p>

                  {order.deliveryStatus !== 'Delivered' && (
                    <button
                      className="mt-2 px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 transition text-xs md:text-sm"
                      onClick={() => markAsDelivered(order._id)}
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
