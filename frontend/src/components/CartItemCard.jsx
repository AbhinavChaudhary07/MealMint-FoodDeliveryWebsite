import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { removeCartItems, updateQuantity } from '../redux/userSlice';

function CartItemCard({data}) {
  const dispatch =useDispatch()
  const handleIncrease=(id,currentQty)=>{
    dispatch(updateQuantity({id,quantity:currentQty+1}))
  }
  const handleDecrease=(id,currentQty)=>{
    if(currentQty>1){
    dispatch(updateQuantity({id,quantity:currentQty-1}))
    }  
  }
  return (
    <div className='flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'>
      <div className='flex items-center gap-5'>
        <img
          src={data.image}
          alt={data.name}
          className='w-20 h-20 object-cover  rounded-xl border border-gray-100'
        />
        <div>
          <h1 className='font-semibold text-gray-900 text-base leading-snug'>{data.name}</h1>
          <p className='text-sm text-gray-500 mt-1'>
            ₹{data.price} <span className='text-gray-400'>×</span> {data.quantity}
          </p>
          <p className='font-bold text-gray-900 mt-1 text-lg'>
            ₹{data.price*data.quantity}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-200'>
          <button
            className='p-2 bg-white cursor-pointer rounded-full shadow-sm hover:bg-gray-100 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed'
            onClick={()=>handleDecrease(data.id,data.quantity)}
            disabled={data.quantity<=1}
          >
            <FaMinus size={12} className='text-gray-600'/>
          </button>

          <span className='w-6 text-center font-medium text-gray-800'>{data.quantity}</span>

          <button
            className='p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 active:scale-95 transition-all duration-150 cursor-pointer'
            onClick={()=>handleIncrease(data.id,data.quantity)}
          >
            <FaPlus size={12} className='text-gray-600'/>
          </button>
        </div>

        <button
          className='p-2.5 bg-red-50 rounded-full hover:bg-red-100 active:scale-95 transition-all duration-150 cursor-pointer'
          onClick={()=>dispatch(removeCartItems(data.id))}
        >
          <FaTrash size={16} className='text-red-500'/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard