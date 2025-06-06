import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    const formData = await request.formData();
    const productId = formData.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing productId" });
    }

    await connectDB();
    const product = await Product.findById(productId);

    if (!product || product.userId !== userId) {
      return NextResponse.json({ success: false, message: "Product not found or unauthorized" });
    }

    // Update fields if provided
    const fields = ["name", "description", "category", "brand", "price", "offerPrice"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) product[field] = field === "price" || field === "offerPrice" ? Number(value) : value;
    });

    // Handle new image uploads (optional)
    const files = formData.getAll("images");
    if (files && files.length > 0 && files[0].name) {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }).end(buffer);
          });
        })
      );
      product.image = uploads;
    }

    await product.save();

    return NextResponse.json({ success: true, message: "Product updated successfully", product });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
