'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { useAppContext } from "@/context/AppContext";

export default function Dashboard() {

  const { getToken, currency } = useAppContext();

  const [metrics, setMetrics] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const COLORS = ["#8b5cf6", "#10b981", "#f472b6", "#f97316", "#3b82f6", "#eab308"];

  async function fetchDashboard() {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `/api/dashboard/seller-metrics?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setMetrics(data.metrics);

        const entries = Object.entries(data.metrics.ordersByDate).map(([date, v]) => ({
          date,
          revenue: v.revenue,
          orders: v.count
        }));

        setFilteredData(entries.slice(-7));
      }

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, [month, year]);

  if (!metrics) return (
    <div className="w-full h-screen flex items-center justify-center text-gray-600">
      Loading Dashboard...
    </div>
  );

  // Format Data
  const paymentData = Object.entries(metrics.paymentMethods).map(([method, count]) => ({
    name: method,
    value: count
  }));

  const categoryData = Object.entries(metrics.salesByCategory).map(([cat, qty]) => ({
    name: cat,
    value: qty
  }));

  const topProductsData = metrics.topProducts.map(p => ({
    name: p.name,
    quantity: p.quantity
  }));

  const revenueByBrandData = Object.entries(metrics.revenueByBrand).map(([brand, value]) => ({
    name: brand,
    value
  }));

  const quantityByBrandData = Object.entries(metrics.quantityByBrand).map(([brand, value]) => ({
    name: brand,
    value
  }));

  // Glass Card
  const Card = ({ children }) => (
    <div className="
      bg-white/60 
      backdrop-blur-xl 
      shadow-[0_8px_30px_rgba(0,0,0,0.07)]
      border border-white/50
      rounded-2xl 
      p-6
    ">
      {children}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8 text-gray-900">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-6">Seller Dashboard</h1>

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-8">
        <span className="font-medium">Month:</span>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 bg-white shadow-sm"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>

        <span className="font-medium">Year:</span>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 bg-white shadow-sm w-28"
        />
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold">{currency}{metrics.totalSales}</h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-3xl font-bold">{metrics.totalOrders}</h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Items Sold</p>
          <h2 className="text-3xl font-bold">{metrics.totalItemsSold}</h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <h2 className="text-3xl font-bold">{currency}{metrics.avgOrderValue}</h2>
        </Card>
      </div>

      {/* MAIN CHARTS 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Revenue */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={filteredData}>
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
              <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={filteredData}>
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} />
              <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductsData}>
              <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentData}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {paymentData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* EXTRA 4 CHARTS */}
      <h2 className="text-xl font-semibold mt-12 mb-4">Additional Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Sales by Category */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} outerRadius={100} dataKey="value" label>
                {categoryData.map((d, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by Brand */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue by Brand</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByBrandData}>
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quantity by Brand */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Quantity Sold by Brand</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quantityByBrandData}>
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Distribution */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Payment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={paymentData} outerRadius={100} dataKey="value" label>
                {paymentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>

    </div>
  );
}
