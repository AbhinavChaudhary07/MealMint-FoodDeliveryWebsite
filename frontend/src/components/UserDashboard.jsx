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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2a1210] via-[#3d1712] to-[#ff4d2d] rounded-b-[36px] sm:rounded-b-[48px] shadow-xl">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#ff7a4d] opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-[#ffb200] opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/10" />

        <div className="relative w-full max-w-6xl mx-auto px-6 pt-14 pb-10 flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#ffd8c2] text-xs font-semibold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border border-white/10">
            🍽 Delivering to {city || "your city"}
          </span>
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            Ready for Your <span className="text-[#ffb200]">Next Meal?</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-md">
            Fresh picks, fast delivery, and the best kitchens near you — all in one place.
          </p>
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
