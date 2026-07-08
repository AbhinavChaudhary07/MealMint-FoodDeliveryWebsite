import React from "react";

function CategoryCard({ name, image }) {
  return (
    <div className="group w-[130px] md:w-[170px] shrink-0 cursor-pointer">

      {/* Card */}
      <div className="relative overflow-hidden rounded-[30px] bg-white border border-orange-100 shadow-md hover:shadow-2xl hover:shadow-orange-200/40 hover:-translate-y-2 transition-all duration-500">

        {/* Image */}
        <div className="relative h-[150px] md:h-[190px] overflow-hidden">

          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Orange Glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#ff4d2d]/30 blur-3xl group-hover:bg-[#ff4d2d]/50 transition-all duration-500"></div>

          {/* Category Name */}
          <div className="absolute bottom-4 left-4 right-4">

            <h2 className="text-white font-bold text-lg leading-tight truncate drop-shadow-md">
              {name}
            </h2>

            <div className="mt-2 w-8 h-1 rounded-full bg-[#ff4d2d] group-hover:w-16 transition-all duration-500"></div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CategoryCard;