import React from 'react'
import { TbCurrencyRupee } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice'
import axios from 'axios'

function OwnerItemCart({ data, onDelete }) {
      const dispatch =useDispatch()
    const handleDeleteItem =async()=>{
        
        try {
          
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
            dispatch(setMyShopData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='flex bg-white rounded-xl shadow-sm overflow-hidden border border-[#fde4d8] w-full'>
      
      {/* Image */}
      <div className='w-32 h-32 flex-shrink-0 bg-[#fff0ed]'>
        {data.image
          ? <img src={data.image} alt={data.name} className='w-full h-full object-cover' />
          : <div className='w-full h-full flex items-center justify-center text-[#ff4d2d] text-[30px]'>🍽️</div>
        }
      </div>

      {/* Details */}
      <div className='flex flex-col justify-between p-4 flex-1'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='text-[15px] font-bold text-gray-800'>{data.name}</h3>
            <span className='text-[12px] text-gray-400'>{data.category}</span>
          </div>
          <div className='flex items-center gap-2'>
            {/* Veg / Non-veg indicator */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${data.foodType === 'veg' ? 'bg-green-50 border-green-400 text-green-600' : 'bg-red-50 border-red-400 text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${data.foodType === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {data.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
            </div>
            {/* Delete button */}
            <button
              onClick={handleDeleteItem}
              className='p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors'
            >
              <FiTrash2 className='text-[16px]' />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className='flex items-center text-[#ff4d2d] font-bold text-[16px]'>
          <TbCurrencyRupee />
          {data.price}
        </div>
      </div>

    </div>
  )
}

export default OwnerItemCart