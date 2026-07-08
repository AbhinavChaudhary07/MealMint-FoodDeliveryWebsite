import React, { useState } from 'react'
import { FiUser, FiHome, FiPlusSquare, FiPackage } from "react-icons/fi"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { TbReceiptDollar } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function OwnerNav({ onAddFood }) {
  const { userData } = useSelector(state => state.user)
  const [showInfo, setShowInfo] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* Main navbar */}
      <div className='w-full fixed top-0 z-[9999] bg-[#fff9f6] border-b border-[#fde4d8] '>
        <div className='flex items-center h-[64px] px-4 sm:px-6 gap-2 sm:gap-3'>

          {/* Logo */}
          <h1 className='text-[20px] sm:text-[22px] font-bold text-[#ff4d2d] shrink-0'>MealMint</h1>

          {/* Spacer */}
          <div className='flex-1' />

          {/* Nav actions */}
          <div className='flex items-center gap-2 shrink-0'>

            {/* Add Food Item button */}
            <button
              onClick={() => navigate('/add-item')}
              className='flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#fff0ed] text-[#ff4d2d] border border-[#ff4d2d] rounded-full cursor-pointer hover:bg-[#ffe0d9] transition-colors'
            >
              <FiPlusSquare className='text-[16px] shrink-0' />
              <span className='hidden sm:inline text-[13px] font-semibold'>Add Food Item</span>
            </button>


            {/* Pending Orders button */}
            <button
              onClick={() => navigate('/my-orders')}
              className='relative flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#fff0ed] text-[#ff4d2d] border border-[#ff4d2d] rounded-full cursor-pointer hover:bg-[#ffe0d9] transition-colors'
            >
              <TbReceiptDollar className='text-[16px] shrink-0' />
              <span className='hidden sm:inline text-[13px] font-semibold'>Pending Orders</span>
              <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>0</span>
            </button>

            {/* Account avatar */}
            <div className='relative'>
              <div
                className='flex items-center justify-center w-9 h-9 rounded-full bg-[#ff4d2d] text-white text-[15px] font-medium cursor-pointer hover:bg-[#e63d1e]'
                onClick={() => setShowInfo(prev => !prev)}
              >
                {userData?.fullName?.slice(0, 1)}
              </div>

              {/* Dropdown */}
              {showInfo && (
                <>
                  <div className='fixed inset-0 z-[9998]' onClick={() => setShowInfo(false)} />
                  <div className='absolute top-[46px] right-0 w-[190px] bg-white shadow-2xl rounded-xl p-4 flex flex-col gap-3 z-[9999]'>
                    <div className='text-[14px] font-semibold truncate border-b border-gray-100 pb-2'>
                      {userData?.fullName}
                    </div>
                    <button
                      className='text-left text-[13px] text-[#ff4d2d] font-semibold hover:opacity-75 cursor-pointer'
                      onClick={handleLogOut}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 z-[9999] h-[56px] bg-[#fff9f6] border-t border-[#fde4d8] flex items-center justify-around px-2'>
        <button className='flex flex-col items-center gap-0.5 text-[#ff4d2d]'>
          <FiHome className='text-[22px]' />
          <span className='text-[10px] font-medium'>Home</span>
        </button>
        <button
          className='flex flex-col items-center gap-0.5 text-gray-500'
          onClick={() => navigate('/add-item')}
        >
          <FiPlusSquare className='text-[22px]' />
          <span className='text-[10px] font-medium'>Add Food</span>
        </button>
        <button
          className='flex flex-col items-center gap-0.5 text-gray-500'
          onClick={() => navigate('/my-orders')}
        >
          <FiPackage className='text-[22px]' />
          <span className='text-[10px] font-medium'>My Orders</span>
        </button>
        <button
          className='relative flex flex-col items-center gap-0.5 text-gray-500'
          onClick={() => navigate('/my-orders')}
        >
          <TbReceiptDollar className='text-[22px]' />
          <span className='text-[10px] font-medium'>Pending</span>
          <span className='absolute -right-1 -top-1 text-[9px] font-bold text-white bg-[#ff4d2d] rounded-full px-[5px] py-[1px]'>0</span>
        </button>
        <button className='flex flex-col items-center gap-0.5 text-gray-500'>
          <FiUser className='text-[22px]' />
          <span className='text-[10px] font-medium'>Account</span>
        </button>
      </div>

      {/* Body padding */}
      <div className='pt-[64px] sm:pb-0 pb-[56px]' />
    </>
  )
}

export default OwnerNav
