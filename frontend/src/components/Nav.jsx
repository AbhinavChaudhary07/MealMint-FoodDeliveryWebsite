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
      <div className='w-full fixed top-0 z-[9999] bg-[#fff9f6] border-b border-[#fde4d8]'>
        <div className='flex items-center h-[64px] px-4 sm:px-6 gap-3'>

          {/* Logo */}
          <h1 className='text-[20px] sm:text-[22px] font-bold text-[#ff4d2d] shrink-0'>MealMint</h1>

          {/* Spacer for owner role */}
          {isRestaurant && <div className='flex-1' />}

          {/* Search bar — hidden for restaurant role */}
          {!isRestaurant && (
            <div className='flex-1 flex items-center h-[42px] bg-white border border-gray-200 rounded-xl overflow-hidden min-w-0'>

              {/* Location picker — hidden on mobile */}
              <div className='hidden sm:flex items-center gap-[6px] px-[10px] h-full border-r border-gray-200 shrink-0 cursor-pointer hover:bg-gray-50 max-w-[130px]'>
                <ImLocation2 className='text-[#ff4d2d] text-[15px] shrink-0' />
                <span className='text-[13px] font-medium truncate'>{city}</span>
                <FiChevronDown className='text-gray-400 text-[13px] shrink-0' />
              </div>

              {/* Input */}
              <div className='flex items-center flex-1 px-[10px] gap-2 min-w-0'>
                <FiSearch className='text-gray-400 text-[15px] shrink-0' />
                <input
                  type='text'
                  placeholder='Search restaurants or dishes…'
                  className='flex-1 text-[13px] sm:text-[14px] bg-transparent outline-none placeholder-gray-400 min-w-0'
                />
              </div>

              {/* Search button */}
              <button className='bg-[#ff4d2d] hover:bg-[#e63d1e] h-[42px] w-[42px] flex items-center justify-center shrink-0'>
                <FiSearch className='text-white text-[17px]' />
              </button>
            </div>
          )}

          {/* Nav actions */}
          <div className='flex items-center gap-2 shrink-0'>

            {/* Account avatar — all devices */}
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
                    <button className='text-left text-[13px] text-[#ff4d2d] font-semibold hover:opacity-75' onClick={() => navigate("/my-orders")}>
                      My Orders
                    </button>
                    <button className='text-left text-[13px] text-[#ff4d2d] font-semibold hover:opacity-75 cursor-pointer' onClick={handleLogOut}>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* My Orders — hidden on mobile */}
            <button className='hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border border-gray-200 rounded-lg hover:bg-gray-50' onClick={() => navigate("/my-orders")}>
              <FiPackage className='text-[15px]' />
              <span className='hidden lg:inline'>My Orders</span>
            </button>

            {/* Cart — hidden for owner role */}
            {!isRestaurant && (
              <button className='relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium bg-[#ff4d2d] hover:bg-[#e63d1e] text-white rounded-lg'onClick={()=>navigate("/cart")}>
                <FiShoppingCart className='text-[15px]' />
                <span className='hidden sm:inline'>Cart</span>
                <span className='absolute -top-2 -right-2 flex items-center justify-center w-[18px] h-[18px] bg-white text-[#ff4d2d] text-[10px] font-bold rounded-full border border-[#ff4d2d]'>
                  {cartItems.length}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 z-[9999] h-[56px] bg-[#fff9f6] border-t border-[#fde4d8] flex items-center justify-around px-4'>
        <button className='flex flex-col items-center gap-0.5 text-[#ff4d2d]'>
          <FiHome className='text-[22px]' />
          <span className='text-[11px] font-medium'>Home</span>
        </button>
        <button className='flex flex-col items-center gap-0.5 text-gray-500'>
          <FiSearch className='text-[22px]' />
          <span className='text-[11px] font-medium'>Search</span>
        </button>
        
        <button className='flex flex-col items-center gap-0.5 text-gray-500'>
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
