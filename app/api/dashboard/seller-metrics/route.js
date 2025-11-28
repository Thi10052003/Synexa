import connectDB from '@/config/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const monthParam = url.searchParams.get('month');
    const yearParam = url.searchParams.get('year');

    // Get paid orders
    let orders = await Order.find({ isPaid: true }).populate('items.product');

    // Filter by month + year
    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10);
      const year = parseInt(yearParam, 10);

      orders = orders.filter(o => {
        const d = new Date(o.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
    }

    // Remove null product refs
    orders = orders.filter(order =>
      order.items.some(item => item.product)
    );

    /* ---------------------------
        BASIC METRICS
    ---------------------------- */
    const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = orders.length;

    const totalItemsSold = orders.reduce(
      (sum, o) => sum + o.items.reduce((cnt, i) => cnt + (i.product ? i.quantity : 0), 0),
      0
    );

    const avgOrderValue =
      totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0";

    const avgItemsPerOrder =
      totalOrders > 0 ? (totalItemsSold / totalOrders).toFixed(2) : "0";

    /* ---------------------------
        ORDERS BY DATE
    ---------------------------- */
    const ordersByDate = {};
    orders.forEach(o => {
      const key = new Date(o.date).toLocaleDateString('en-GB'); // 18/11/2025
      if (!ordersByDate[key]) ordersByDate[key] = { count: 0, revenue: 0 };
      ordersByDate[key].count += 1;
      ordersByDate[key].revenue += o.amount;
    });

    /* ---------------------------
        TOP PRODUCTS
    ---------------------------- */
    const prodMap = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!i.product) return;
        const key = i.product._id.toString();

        if (!prodMap[key]) {
          prodMap[key] = { name: i.product.name, quantity: 0 };
        }
        prodMap[key].quantity += i.quantity;
      });
    });

    const topProducts = Object.values(prodMap).sort(
      (a, b) => b.quantity - a.quantity
    );

    /* ---------------------------
        PAYMENT METHODS
    ---------------------------- */
    const paymentMethods = {};
    orders.forEach(o => {
      const payment = o.paymentType || "COD";
      paymentMethods[payment] = (paymentMethods[payment] || 0) + 1;
    });

    /* ---------------------------
        SALES BY CATEGORY (Pie Chart)
    ---------------------------- */
    const salesByCategory = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!i.product) return;
        const cat = i.product.category || "Other";
        salesByCategory[cat] = (salesByCategory[cat] || 0) + i.quantity;
      });
    });

    /* ---------------------------
        NEW METRICS (4 CHART MỚI)
    ---------------------------- */

    // 1. Revenue by Category
    const revenueByCategory = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!i.product) return;
        const cat = i.product.category || "Other";
        const amount = i.quantity * (i.product.offerPrice ?? i.product.price);
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + amount;
      });
    });

    // 2. Quantity by Brand
    const quantityByBrand = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!i.product) return;
        const brand = i.product.brand || "Unknown";
        quantityByBrand[brand] = (quantityByBrand[brand] || 0) + i.quantity;
      });
    });

    // 3. Revenue by Brand
    const revenueByBrand = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!i.product) return;
        const brand = i.product.brand || "Unknown";
        const amount = i.quantity * (i.product.offerPrice ?? i.product.price);
        revenueByBrand[brand] = (revenueByBrand[brand] || 0) + amount;
      });
    });

    // 4. Order Count by Payment Method
    const orderCountByPayment = {};
    Object.keys(paymentMethods).forEach(key => {
      orderCountByPayment[key] = paymentMethods[key];
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalSales,
        totalOrders,
        totalItemsSold,
        avgOrderValue,
        avgItemsPerOrder,
        ordersByDate,
        topProducts,
        paymentMethods,
        salesByCategory,
        revenueByCategory,
        quantityByBrand,
        revenueByBrand,
        orderCountByPayment
      }
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
