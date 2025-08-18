'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  const { getToken, currency } = useAppContext();
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    ordersByDate: {},
    topProducts: [],
    paymentMethods: {},
  });
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/dashboard/seller-metrics?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setMetrics(data.metrics);
        const allEntries = Object.entries(data.metrics.ordersByDate || {}).map(([date, data]) => ({
          date,
          revenue: data.revenue,
          orders: data.count,
        }));
        const recent7 = allEntries.slice(-7);
        setFilteredData(recent7);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [month, year]);

  const COLORS = ['#8b5cf6', '#10b981', '#f472b6', '#f97316'];

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-6">Seller Dashboard</h2>

      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium">Month:</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-2 py-1 text-black"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <label className="text-sm font-medium">Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24 text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <p className="text-gray-400">Total Revenue</p>
          <h3 className="text-3xl font-bold">{currency}{metrics.totalSales}</h3>
        </div>
        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <p className="text-gray-400">Total Orders</p>
          <h3 className="text-3xl font-bold">{metrics.totalOrders}</h3>
        </div>
        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <p className="text-gray-400">Items Sold</p>
          <h3 className="text-3xl font-bold">{metrics.totalItemsSold}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Chart (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <Line type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={3} />
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563", color: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Order Volume Chart (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <Line type="monotone" dataKey="orders" stroke="#34d399" strokeWidth={3} />
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563", color: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.topProducts}>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563", color: "#fff" }} />
              <Bar dataKey="quantity" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Payment Method Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(metrics.paymentMethods || {}).map(([type, value], i) => ({
                  name: type,
                  value
                }))}
                cx="50%" cy="50%" outerRadius={100}
                label
                dataKey="value"
              >
                {Object.keys(metrics.paymentMethods || {}).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;