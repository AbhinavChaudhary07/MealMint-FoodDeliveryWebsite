import React from 'react'
import { FaBackward } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';


function CartPage() {
  const navigate =useNavigate()
  const {cartItems,totalAmount} =useSelector(state=>state.user)
  return (
    <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
      <div className='w-full max-w-[800px]'>
        <div className='flex items-center gap-5 mb-8'>
          <div
            className='z-10 p-2 rounded-full hover:bg-white/60 transition-colors duration-150 cursor-pointer'
            onClick={()=>navigate("/")}
          >
            <FaBackward size={28} className='text-[#ff2d2d]'/>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 text-start'>Your Cart</h1>
        </div>

        {cartItems?.length==0 ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-4 bg-white/60 rounded-2xl py-16 px-6 border border-gray-100">
            <span className='text-5xl'>🛒</span>
            <h2 className="text-2xl font-semibold text-gray-600">
              Your Cart is Empty
            </h2>
            <p className='text-gray-400 text-sm -mt-2'>Looks like you haven't added anything yet.</p>

            <button
              onClick={() => navigate("/")}
              className="bg-[#ff4d2d] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e03d1f] active:scale-95 transition-all duration-150 cursor-pointer mt-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className='space-y-4'>
              {cartItems?.map((item,index)=>(
                <CartItemCard data={item} key={index}/>
              ))}
            </div>

            <div className='mt-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center'>
              <h1 className='text-lg font-semibold text-gray-800'>Total Amount</h1>
              <span className='text-2xl font-bold text-[#ff4d2d]'>₹{totalAmount}</span>
            </div>

            <div className='mt-5 flex justify-end'>
              <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64562] active:scale-95 transition-all duration-150 cursor-pointer shadow-sm' onClick={()=>navigate("/checkout")}>
                Proceed To Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage