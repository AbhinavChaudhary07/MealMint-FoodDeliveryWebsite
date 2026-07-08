import React, { useState } from 'react'
import { ImLocation2 } from "react-icons/im"
import { FiSearch, FiChevronDown, FiShoppingCart, FiPackage, FiUser, FiHome } from "react-icons/fi"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setCity, setUserData} from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const { userData,city ,cartItems} = useSelector(state =>state.user)
  const [showInfo, setShowInfo] = useState(false)
  const dispatch =useDispatch()
  const navigate =useNavigate()
  const handleLogOut =async ()=>{
    try {
        const result =await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
        dispatch(setUserData(null))
    } catch (error) {
       console.log(error) 
    }
  }

  const isRestaurant = userData?.role === 'owner'

  return (
    <>
      {/* Main navbar */}
      <div className='w-full fixed top-0 z-[9999] bg-white border-b border-[#fde4d8] shadow-[0_2px_10px_rgba(255,77,45,0.08)]'>
        <div className='flex items-center h-[68px] px-4 sm:px-6 gap-4 max-w-[1400px] mx-auto'>

          {/* Logo */}
          <h1 className='text-[24px] sm:text-[26px] font-black tracking-tight shrink-0 cursor-pointer select-none' onClick={() => navigate("/")}>
            <span className='bg-gradient-to-r from-[#ff4d2d] to-[#ff8a5c] bg-clip-text text-transparent'>Meal</span>
            <span className='text-gray-800'>Mint</span>
          </h1>

          {/* Spacer for owner role */}
          {isRestaurant && <div className='flex-1' />}

          {/* Search bar — hidden for restaurant role */}
          {!isRestaurant && (
            <div className='flex-1 flex items-center h-[46px] bg-[#fff9f6] border-2 border-[#fde4d8] rounded-2xl overflow-hidden min-w-0 transition-all duration-200 focus-within:border-[#ff4d2d] focus-within:bg-white focus-within:shadow-md hover:border-[#ffcbb8]'>

              {/* Location picker — hidden on mobile */}
              <div className='hidden sm:flex items-center gap-[6px] px-[14px] h-full border-r-2 border-[#fde4d8] shrink-0 cursor-pointer hover:bg-[#ffe9de] transition-colors duration-150 max-w-[130px]'>
                <ImLocation2 className='text-[#ff4d2d] text-[16px] shrink-0' />
                <span className='text-[13px] font-semibold truncate text-gray-700'>{city}</span>
                <FiChevronDown className='text-gray-400 text-[13px] shrink-0' />
              </div>

              {/* Input */}
              <div className='flex items-center flex-1 px-[14px] gap-2 min-w-0'>
                <FiSearch className='text-gray-400 text-[16px] shrink-0' />
                <input
                  type='text'
                  placeholder='Search restaurants or dishes…'
                  className='flex-1 text-[13px] sm:text-[14px] bg-transparent outline-none placeholder-gray-400 min-w-0 text-gray-800'
                />
              </div>

              {/* Search button */}
              <button className='bg-[#ff4d2d] hover:bg-[#e63d1e] active:bg-[#d43a1c] transition-colors duration-150 h-full w-[48px] flex items-center justify-center shrink-0 cursor-pointer'>
                <FiSearch className='text-white text-[18px]' />
              </button>
            </div>
          )}

          {/* Nav actions */}
          <div className='flex items-center gap-2 shrink-0'>

            {/* Account avatar — all devices */}
            <div className='relative'>
              <div
                className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#ff4d2d] to-[#e63d1e] text-white text-[16px] font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-150 shadow-[0_2px_8px_rgba(255,77,45,0.35)]'
                onClick={() => setShowInfo(prev => !prev)}
              >
                {userData?.fullName?.slice(0, 1)}
              </div>

              {/* Dropdown */}
              {showInfo && (
                <>
                  <div className='fixed inset-0 z-[9998]' onClick={() => setShowInfo(false)} />
                  <div className='absolute top-[50px] right-0 w-[200px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[#fde4d8] rounded-2xl p-4 flex flex-col gap-1 z-[9999]'>
                    <div className='text-[14px] font-bold truncate border-b border-gray-100 pb-3 mb-1 text-gray-800'>
                      {userData?.fullName}
                    </div>
                    <button className='text-left text-[13px] text-gray-700 font-medium hover:bg-[#fff3ee] hover:text-[#ff4d2d] rounded-lg px-2 py-2 transition-colors duration-150 cursor-pointer' onClick={() => navigate("/my-orders")}>
                      My Orders
                    </button>
                    <button className='text-left text-[13px] text-gray-700 font-medium hover:bg-[#fff3ee] hover:text-[#ff4d2d] rounded-lg px-2 py-2 transition-colors duration-150 cursor-pointer' onClick={handleLogOut}>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* My Orders — hidden on mobile */}
            <button className='hidden sm:flex items-center gap-1.5 px-4 py-[10px] text-[13px] font-semibold border-2 border-[#fde4d8] rounded-xl hover:bg-[#fff3ee] hover:border-[#ffcbb8] transition-colors duration-150 cursor-pointer text-gray-700' onClick={() => navigate("/my-orders")}>
              <FiPackage className='text-[16px] text-[#ff4d2d]' />
              <span className='hidden lg:inline'>My Orders</span>
            </button>

            {/* Cart — hidden for owner role */}
            {!isRestaurant && (
              <button className='relative flex items-center gap-1.5 px-4 py-[10px] text-[13px] font-semibold bg-gradient-to-br from-[#ff4d2d] to-[#e63d1e] hover:brightness-110 active:scale-95 transition-all duration-150 text-white rounded-xl shadow-[0_2px_8px_rgba(255,77,45,0.35)] cursor-pointer' onClick={()=>navigate("/cart")}>
                <FiShoppingCart className='text-[16px]' />
                <span className='hidden sm:inline'>Cart</span>
                <span className='absolute -top-2 -right-2 flex items-center justify-center w-[19px] h-[19px] bg-white text-[#ff4d2d] text-[10px] font-bold rounded-full border-2 border-[#ff4d2d] shadow-sm'>
                  {cartItems.length}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 z-[9999] h-[60px] bg-white border-t border-[#fde4d8] flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(255,77,45,0.08)]'>
        <button className='flex flex-col items-center gap-1 text-[#ff4d2d] cursor-pointer' onClick={() => navigate("/")}>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#fff3ee]'>
            <FiHome className='text-[19px]' />
          </div>
          <span className='text-[11px] font-semibold'>Home</span>
        </button>
        <button className='flex flex-col items-center gap-1 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-150 cursor-pointer'>
          <FiSearch className='text-[22px]' />
          <span className='text-[11px] font-medium'>Search</span>
        </button>

        <button className='flex flex-col items-center gap-1 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-150 cursor-pointer'>
          <FiUser className='text-[22px]' />
          <span className='text-[11px] font-medium'>Account</span>
        </button>
      </div>

      {/* Body padding */}
      <div/>
    </>
  )
}

export default Nav
