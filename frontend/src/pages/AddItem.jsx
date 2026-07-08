import React, { useState } from "react";
import OwnerNav from "../components/OwnerNav.jsx";
import { useDispatch } from "react-redux";
import { FiCamera, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdFastfood } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice.js";

const categories = [
  "Snacks",
  "Main Course ",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others",
];

function AddItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    foodType: "veg",
    price: "",
    image: null,
    preview: null,
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("foodType", form.foodType);
      formData.append("price", form.price);
      if (form.image) formData.append("image", form.image);
      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMyShopData(result.data));
      navigate("/");
      console.log(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] relative overflow-hidden">
      <OwnerNav onAddFood={() => {}} />

      {/* ambient background accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#ffdccb] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-28 w-72 h-72 rounded-full bg-[#ffe8de] opacity-60 blur-3xl" />

      <div className="relative flex justify-center items-center min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff4d2d] to-[#ff8452] shadow-lg shadow-orange-200 flex items-center justify-center mb-4">
              <MdFastfood className="text-white text-[28px]" />
            </div>
            <h2 className="text-[22px] sm:text-[27px] font-extrabold text-gray-900 tracking-tight">
              Add Food Item
            </h2>
            <p className="text-[13px] text-gray-400 mt-1">
              Add a new item to your menu
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/60 border border-[#fde4d8] p-5 sm:p-7 flex flex-col gap-5">
            {/* Image upload */}
            <label className="cursor-pointer group">
              <div className="relative w-full h-[150px] sm:h-[170px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#fff3ee] to-[#ffe4d8] border-2 border-dashed border-[#ffc7b0] flex flex-col items-center justify-center gap-2 group-hover:border-[#ff4d2d] transition-colors duration-200">
                {form.preview ? (
                  <img
                    src={form.preview}
                    alt="item"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <FiCamera className="text-[#ff4d2d] text-[20px]" />
                    </div>
                    <span className="text-[13px] text-[#ff4d2d] font-semibold">
                      Upload item photo
                    </span>
                    <span className="text-[11px] text-gray-400">
                      JPG, PNG up to 5MB
                    </span>
                  </>
                )}
                {form.preview && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col items-center gap-1.5">
                      <FiCamera className="text-white text-[24px]" />
                      <span className="text-white text-[12px] font-medium">
                        Change photo
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>

            {/* Item Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Item Name
              </label>
              <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70">
                <MdOutlineStorefront className="text-[#ff4d2d] text-[17px] shrink-0" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Chicken Burger"
                  className="flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800"
                />
              </div>
            </div>

            {/* Category & Price */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl px-3.5 py-3 text-[14px] bg-gray-50/70 outline-none focus:border-[#ff4d2d] focus:ring-4 focus:ring-orange-50 transition-all text-gray-700"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Price
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70">
                  <TbCurrencyRupee className="text-[#ff4d2d] text-[17px] shrink-0" />
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 199"
                    type="number"
                    className="flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Food Type */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Food Type
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setForm((prev) => ({ ...prev, foodType: "veg" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-semibold transition-all ${form.foodType === "veg" ? "bg-green-50 border-green-500 text-green-600 ring-4 ring-green-50 shadow-sm" : "border-gray-200 text-gray-400 bg-gray-50/70 hover:border-gray-300"}`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-green-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  </span>
                  Veg
                </button>
                <button
                  onClick={() =>
                    setForm((prev) => ({ ...prev, foodType: "nonveg" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-semibold transition-all ${form.foodType === "nonveg" ? "bg-red-50 border-red-500 text-red-600 ring-4 ring-red-50 shadow-sm" : "border-gray-200 text-gray-400 bg-gray-50/70 hover:border-gray-300"}`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-red-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  </span>
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => navigate("/owner-dashboard")}
                className="flex items-center justify-center gap-1.5 h-[48px] px-4 border border-gray-200 text-gray-600 text-[14px] font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <FiChevronLeft className="text-[16px]" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 h-[48px] bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] hover:from-[#e63d1e] hover:to-[#ff5a2a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98] group"
              >
                {loading ? "Adding..." : "Add Item"}
                {!loading && (
                  <FiChevronRight className="text-[16px] transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-400 mt-5">
            Item will appear on your menu immediately
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
