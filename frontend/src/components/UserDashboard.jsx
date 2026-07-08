import React, { useRef } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { useSelector } from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity";
import FoodCard from "./FoodCard";

function UserDashboard() {
  useGetShopByCity();
  const { city, shopInMyCity, itemsInMyCity } = useSelector((state) => state.user);

  const catScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // converts two-finger vertical trackpad scroll into horizontal scroll
  const handleWheel = (ref, e) => {
    if (ref.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        ref.current.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7]">
      <Nav />

      {/* ===== Hero banner ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2a1210] via-[#3d1712] to-[#ff4d2d] rounded-b-[30px] shadow-xl">
  {/* Background Effects */}
  <div className="absolute inset-0">
    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#ff7a4d]/20 blur-3xl" />
    <div className="absolute -bottom-24 right-0 w-80 h-80 rounded-full bg-[#ffb200]/15 blur-3xl" />
    <div className="absolute top-8 right-14 w-24 h-24 rounded-full border border-white/10" />
    <div className="absolute bottom-10 left-16 w-16 h-16 rounded-full border border-white/10" />
  </div>

  <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-12">
    <div className="grid lg:grid-cols-2 gap-8 items-center">

      {/* Left Content */}
      <div className="space-y-5">

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-100 text-xs font-semibold tracking-widest uppercase">
          📍 Delivering in {city || "Your City"}
        </span>

        <div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
            Craving
            <span className="block text-[#ffb200]">
              Something Delicious?
            </span>
          </h1>

          <p className="mt-4 text-white/70 text-base max-w-lg leading-7">
            Order from your favourite restaurants, discover new dishes,
            and enjoy lightning fast delivery right to your doorstep.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 pt-2">

          <div>
            <h2 className="text-2xl font-bold text-white">
              {shopInMyCity?.length || 0}+
            </h2>
            <p className="text-white/60 text-sm">
              Restaurants
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {itemsInMyCity?.length || 0}+
            </h2>
            <p className="text-white/60 text-sm">
              Food Items
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              30 min
            </h2>
            <p className="text-white/60 text-sm">
              Avg Delivery
            </p>
          </div>

        </div>

      </div>

      {/* Right Illustration */}
      <div className="relative flex justify-center">

        <div className="absolute w-[340px] h-[340px] rounded-full bg-orange-400/20 blur-3xl"></div>

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-5 rotate-2 shadow-2xl">

          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
            alt="Food"
            className="w-[280px] md:w-[320px] h-[280px] md:h-[320px] object-cover rounded-[22px]"
          />

          <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500">
              Today's Special
            </p>
            <h3 className="font-bold text-gray-800 text-sm">
              Cheese Burst Pizza 🍕
            </h3>
          </div>

          <div className="absolute -top-5 -right-5 bg-white rounded-xl shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500">
              Delivery
            </p>
            <h3 className="font-bold text-green-600 text-sm">
              ⚡ 25–30 mins
            </h3>
          </div>

        </div>

      </div>

    </div>
  </div>
</div>

      {/* ===== Categories ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 px-[10px] pt-10">
        <div className="flex items-center gap-3 px-1">
          <span className="w-1.5 h-6 rounded-full bg-[#ff4d2d]" />
          <h2 className="text-gray-900 text-xl sm:text-2xl font-bold tracking-tight">
            Explore Categories
          </h2>
        </div>

        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-10 sm:w-20 bg-gradient-to-r from-[#fffaf7] to-transparent z-[5]" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 sm:w-20 bg-gradient-to-l from-[#fffaf7] to-transparent z-[5]" />

          <button
            onClick={() => scroll(catScrollRef, "left")}
            aria-label="Scroll categories left"
            className="flex items-center justify-center absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg shadow-orange-200/50 border border-orange-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 text-lg sm:text-xl font-bold transition hover:bg-[#ff4d2d] hover:text-white hover:scale-105 hover:border-transparent active:scale-95"
          >
            ‹
          </button>

          <div
            ref={catScrollRef}
            onWheel={(e) => handleWheel(catScrollRef, e)}
            className="overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex gap-4 pb-3 px-6 w-max">
              {categories.map((cate, index) => (
                <div
                  key={index}
                  className="rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-200/60"
                >
                  <CategoryCard name={cate.category} image={cate.image} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll(catScrollRef, "right")}
            aria-label="Scroll categories right"
            className="flex items-center justify-center absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg shadow-orange-200/50 border border-orange-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 text-lg sm:text-xl font-bold transition hover:bg-[#ff4d2d] hover:text-white hover:scale-105 hover:border-transparent active:scale-95"
          >
            ›
          </button>
        </div>
      </div>

      {/* ===== Best shops ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 px-[10px] pt-12">
        <div className="flex items-center gap-3 px-1">
          <span className="w-1.5 h-6 rounded-full bg-[#ff4d2d]" />
          <h2 className="text-gray-900 text-xl sm:text-2xl font-bold tracking-tight">
            Best Shops In <span className="text-[#ff4d2d]">{city}</span>
          </h2>
        </div>

        {shopInMyCity?.length === 0 ? (
          <div className="w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 py-10 px-6 text-center">
            <p className="text-gray-500 text-sm">
              No shops found near {city} yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-10 sm:w-20 bg-gradient-to-r from-[#fffaf7] to-transparent z-[5]" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 sm:w-20 bg-gradient-to-l from-[#fffaf7] to-transparent z-[5]" />

            <button
              onClick={() => scroll(shopScrollRef, "left")}
              aria-label="Scroll shops left"
              className="flex items-center justify-center absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg shadow-orange-200/50 border border-orange-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 text-lg sm:text-xl font-bold transition hover:bg-[#ff4d2d] hover:text-white hover:scale-105 hover:border-transparent active:scale-95"
            >
              ‹
            </button>

            <div
              ref={shopScrollRef}
              onWheel={(e) => handleWheel(shopScrollRef, e)}
              className="overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex gap-4 pb-3 px-6 w-max">
                {shopInMyCity?.map((shop, index) => (
                  <div
                    key={index}
                    className="rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-200/60"
                  >
                    <CategoryCard name={shop.name} image={shop.image} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scroll(shopScrollRef, "right")}
              aria-label="Scroll shops right"
              className="flex items-center justify-center absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg shadow-orange-200/50 border border-orange-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 text-lg sm:text-xl font-bold transition hover:bg-[#ff4d2d] hover:text-white hover:scale-105 hover:border-transparent active:scale-95"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* ===== Suggested food items ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 px-[10px] pt-12 pb-16">
        <div className="flex items-center gap-3 px-1">
          <span className="w-1.5 h-6 rounded-full bg-[#ff4d2d]" />
          <h2 className="text-gray-900 text-xl sm:text-2xl font-bold tracking-tight">
            Suggested Food Items
          </h2>
        </div>

        {itemsInMyCity?.length === 0 ? (
          <div className="w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 py-10 px-6 text-center">
            <p className="text-gray-500 text-sm">
              Nothing suggested yet — explore a shop to see popular dishes here.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
            {itemsInMyCity?.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-200/60 w-full"
              >
                <FoodCard data={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
