'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openUpdateModal = (product) => {
    setEditingProduct(product);
    setUpdatedFields({
      name: product.name,
      brand: product.brand || "",
      category: product.category,
      price: product.price,
      offerPrice: product.offerPrice
    });
    setNewImages([]);
    setPreviewImages([]);
    setShowModal(true);
  };

  const handleFieldChange = (field, value) => {
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleUpdate = async () => {
    try {
      if (!updatedFields.offerPrice || Number(updatedFields.offerPrice) >= Number(updatedFields.price)) {
        toast.error('Offer price must be a valid number and lower than price');
        return;
      }

      const token = await getToken();
      const formData = new FormData();
      formData.append("productId", editingProduct._id);
      formData.append("name", updatedFields.name);
      formData.append("brand", updatedFields.brand);
      formData.append("category", updatedFields.category);
      formData.append("price", updatedFields.price);
      formData.append("offerPrice", updatedFields.offerPrice);

      newImages.forEach((img) => formData.append("images", img));

      const { data } = await axios.put('/api/product/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (data.success) {
        toast.success('Product updated');
        setShowModal(false);
        setUpdatedFields({});
        setEditingProduct(null);
        fetchSellerProduct();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Do you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const token = await getToken();
      const res = await axios.delete(`/api/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = res.data;

      if (json.success) {
        toast.success('Product has been deleted successfully');
        fetchSellerProduct();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error when deleting product');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-black text-white">
      {loading ? <Loading /> : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>

          {/* Mobile-friendly table container */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border border-gray-700 rounded-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left max-sm:hidden">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left max-sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 text-gray-300">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="flex items-center gap-3 p-3">
                      <Image
                        src={product.image?.[0] || "/placeholder.png"}
                        alt="product"
                        className="w-12 h-12 object-cover rounded"
                        width={48}
                        height={48}
                      />
                      <span className="truncate">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice || product.price}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUpdateModal(product)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showModal && editingProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white text-black p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Update Product</h2>

            {["name", "brand", "category", "price", "offerPrice"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium capitalize">{field}</label>
                <input
                  type={field.includes("price") ? "number" : "text"}
                  className="px-3 py-2 border border-gray-300 rounded"
                  value={updatedFields[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-1"
                onChange={handleImageChange}
              />
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {(previewImages.length > 0 ? previewImages : editingProduct.image)?.map((img, i) => (
                  <Image
                    key={i}
                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
