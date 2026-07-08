import React from 'react'

function CategoryCard({ name ,image }) {
  return (
    <div className='w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg cursor-pointer flex flex-col relative group'>
      <div className='flex-1 overflow-hidden'>
        <img src={image} alt={name} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' />
      </div>
      <div className='absolute bottom-0 w-full left-0 bg-[#ffffff96] bg-opacity-95 px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur'>
        {name}
      </div>
    </div>
  )
}

export default CategoryCard