import connectDB from '@/config/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();
    const { orderId } = await request.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' });
    }

    order.deliveryStatus = 'Delivered';

    if (order.paymentType === 'COD') {
      order.isPaid = true;
    }

    await order.save();

    return NextResponse.json({ success: true, message: 'Order marked as delivered' });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
