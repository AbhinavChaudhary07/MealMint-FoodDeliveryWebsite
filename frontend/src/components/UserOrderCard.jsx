import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});
  const shopOrders = Array.isArray(data?.shopOrders) ? data.shopOrders : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true },
      );
      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">
            Order #{data?._id?.slice(-6) || "pending"}
          </p>
          <p className="text-sm text-gray-500">
            Date:{" "}
            {data?.createdAt ? formatDate(data.createdAt) : "Not available"}
          </p>
        </div>
        <div className="text-right">
          {data?.paymentMethod == "cod" ? (
            <p className="text-sm text-gray-500">
              {data.paymentMethod?.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              Payment: {data?.payment ? "true" : "false"}
            </p>
          )}
          <p className="font-medium text-blue-600">
            {shopOrders[0]?.status || "pending"}
          </p>
        </div>
      </div>

      {shopOrders.map((shopOrder, index) => (
        <div
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          key={shopOrder._id || index}
        >
          <p>{shopOrder.shop?.name || "Shop"}</p>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItems?.map((item, itemIndex) => {
              const itemId = item.item?._id || item.item;
              const itemImage = item.item?.image || item.image;

              return (
                <div
                  key={item._id || itemIndex}
                  className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                >
                  {itemImage && (
                    <img
                      src={itemImage}
                      alt={item.name || "Food item"}
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                  <p className="text-sm font-semibold mt-1">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} x Rs {item.price}
                  </p>

                  {shopOrder.status == "delivered" && itemId && (
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`text-lg ${selectedRating[itemId] >= star ? "text-yellow-400" : "text-gray-400"}`}
                          onClick={() => handleRating(itemId, star)}
                        >
                          *
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">
              Subtotal: Rs {shopOrder.subtotal || 0}
            </p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder.status || "pending"}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total: Rs {data?.totalAmount || 0}</p>
        <button
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          onClick={() => navigate(`/track-order/${data._id}`)}
          disabled={!data?._id}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
