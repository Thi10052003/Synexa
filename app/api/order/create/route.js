import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    // Save order to database
    const order = await Order.create({
      userId,
      address,
      items,
      amount,
      date: Date.now(),
      paymentType: "COD",
      isPaid: false,
    });

    // Optional: send to Inngest for analytics or processing
    await inngest.send({
      name: "order/created",
      data: {
        orderId: order._id.toString(),
        userId,
        address,
        items,
        amount,
        date: Date.now(),
        paymentType: "COD",
      },
    });

    // Clear user's cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("COD order error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
