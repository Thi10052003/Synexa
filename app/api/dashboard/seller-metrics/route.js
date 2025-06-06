import connectDB from '@/config/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const monthParam = url.searchParams.get('month');
    const yearParam = url.searchParams.get('year');


    let orders = await Order.find({ isPaid: true }).populate('items.product');

 
    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10);
      const year = parseInt(yearParam, 10);
      orders = orders.filter(o => {
        const d = new Date(o.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
    }


    orders = orders.filter(order =>
      order.items.some(item => item.product)
    );

   
    const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);

    const totalOrders = orders.length;

    const totalItemsSold = orders.reduce((sum, o) =>
      sum + o.items.reduce((cnt, i) => cnt + (i.product ? i.quantity : 0), 0)
    , 0);

   
    const ordersByDate = {};
    orders.forEach(o => {
      const key = new Date(o.date).toLocaleDateString('en-GB');
      if (!ordersByDate[key]) ordersByDate[key] = { count: 0, revenue: 0 };
      ordersByDate[key].count += 1;
      ordersByDate[key].revenue += o.amount;
    });

    
    const prodMap = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        const prod = i.product;
        if (!prod) return;
        const name = prod.name;
        const key = prod._id.toString();
        if (!prodMap[key]) prodMap[key] = { name, quantity: 0 };
        prodMap[key].quantity += i.quantity;
      });
    });

    const topProducts = Object.values(prodMap).sort((a, b) => b.quantity - a.quantity);


    const paymentMethods = {};
    orders.forEach(o => {
      const m = o.paymentType || 'COD';
      paymentMethods[m] = (paymentMethods[m] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalSales,
        totalOrders,
        totalItemsSold,
        ordersByDate,
        topProducts,
        paymentMethods
      }
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
