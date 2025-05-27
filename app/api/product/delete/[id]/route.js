import { getAuth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' });
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' });
    }

    if (product.userId !== userId) {
      return NextResponse.json({ success: false, message: 'You can only delete your own products' });
    }

    await product.deleteOne();

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
