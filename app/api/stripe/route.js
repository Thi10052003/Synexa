import connectDB from "@/config/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    await connectDB();

    // ✅ HANDLE payment_intent.succeeded chính xác
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Tìm checkout session theo payment_intent
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      const session = sessions.data[0];
      const orderId = session?.metadata?.orderId;
      const userId = session?.metadata?.userId;

      if (!orderId || !userId) {
        console.error("❌ Missing metadata");
        return NextResponse.json({ message: "Metadata missing" }, { status: 400 });
      }

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true }); // fallback cho các loại event khác
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const config = {
  api: { bodyParser: false },
};
