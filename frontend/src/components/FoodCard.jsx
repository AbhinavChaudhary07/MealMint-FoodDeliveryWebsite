import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaRegStar, FaMinus, FaPlus } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/userSlice';

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="text-yellow-400 text-sm" />
          : <FaRegStar key={i} className="text-yellow-400 text-sm" />
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="group w-[270px] rounded-3xl bg-white border border-orange-100 shadow-md overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 flex flex-col">

      <div className="relative w-full h-[190px] overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full p-2 shadow-lg z-10">
          {data.foodType === "veg"
            ? <FaLeaf className="text-green-600 text-lg" />
            : <FaDrumstickBite className="text-red-600 text-lg" />}
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col p-5">

        <h1 className="font-bold text-lg text-gray-900 truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-1 mt-2">
          {renderStars(data.rating?.average || 0)}
          <span className="text-sm text-gray-500 ml-1">
            ({data.rating?.count || 0})
          </span>
        </div>

      </div>

      <div className="flex items-center justify-between mt-auto px-5 pb-5 pt-2">

        <span className="font-extrabold text-2xl text-[#ff4d2d]">
          ₹{data.price}
        </span>

        <div className="flex items-center bg-gray-50 border border-orange-100 rounded-full shadow-sm overflow-hidden">

          <button
            className="px-3 py-2 hover:bg-orange-100 transition"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>

          <span className="px-3 font-semibold text-gray-800">
            {quantity}
          </span>

          <button
            className="px-3 py-2 hover:bg-orange-100 transition"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>

          <button
            className={`${cartItems.some(i => i.id == data._id)
              ? "bg-gray-800"
              : "bg-gradient-to-r from-[#ff4d2d] to-[#ff7b42]"
              } text-white px-4 py-3 hover:brightness-110 transition-all duration-300`}
            onClick={() => {
              quantity > 0
                ? dispatch(addToCart({
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    shop: data.shop,
                    quantity,
                    foodType: data.foodType
                  }))
                : null
            }}
          >
            <FiShoppingCart size={16} />
          </button>

        </div>
      </div>

    </div>
  );
}

export default FoodCard;
