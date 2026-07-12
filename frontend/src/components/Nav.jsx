import React, { useState } from 'react'
import { ImLocation2 } from 'react-icons/im'
import { FiSearch, FiChevronDown, FiShoppingCart, FiPackage, FiUser, FiHome, FiLogOut } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setCity, setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Nav({ search = "", setSearch = () => {} }) {
  const { userData, city, cartItems } = useSelector(state => state.user)
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

  const isRestaurant = userData?.role === 'owner'

  return (
    <>
      {/* Main navbar */}
      <div className='w-full fixed top-0 z-[9999] bg-white border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)]'>
        <div className='flex items-center h-[68px] px-4 sm:px-6 gap-4 max-w-[1400px] mx-auto'>

          {/* Logo */}
          <h1
            className='text-[24px] sm:text-[26px] font-black tracking-tight shrink-0 cursor-pointer select-none'
            onClick={() => navigate('/')}
          >
            <span className='bg-gradient-to-r from-[#ff4d2d] to-[#ff8a5c] bg-clip-text text-transparent'>Meal</span>
            <span className='text-gray-800'>Mint</span>
          </h1>

          {/* Search bar — hidden for restaurant role */}
          {!isRestaurant ? (
            <div className='flex-1 flex items-center h-[44px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden min-w-0 transition-all duration-200 focus-within:border-[#ff4d2d] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(255,77,45,0.08)] hover:border-gray-300'>

              {/* Location picker — hidden on mobile */}
              <div className='hidden sm:flex items-center gap-1.5 px-3 h-full border-r border-gray-200 shrink-0 cursor-pointer hover:bg-orange-50 transition-colors duration-150 max-w-[130px]'>
                <ImLocation2 className='text-[#ff4d2d] text-[14px] shrink-0' />
                <span className='text-[13px] font-semibold truncate text-gray-700'>{city}</span>
                <FiChevronDown className='text-gray-400 text-[12px] shrink-0' />
              </div>

              {/* Input */}
              <div className='flex items-center flex-1 px-3 gap-2 min-w-0'>
                <FiSearch className='text-gray-400 text-[15px] shrink-0' />
                <input
                  type='text'
                  placeholder='Search restaurants or dishes…'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className='flex-1 text-[13px] sm:text-[14px] bg-transparent outline-none placeholder-gray-400 min-w-0 text-gray-800'
                />
              </div>

              {/* Search button */}
              <button onClick={() => setSearch("")} className='bg-[#ff4d2d] hover:bg-[#e63d1e] active:bg-[#d43a1c] transition-colors duration-150 h-full w-[44px] flex items-center justify-center shrink-0 cursor-pointer'>
                {search ? <span className='text-white text-[18px] font-bold leading-none'>×</span> : <FiSearch className='text-white text-[16px]' />}
              </button>
            </div>
          ) : (
            <div className='flex-1' />
          )}

          {/* Nav actions */}
          <div className='flex items-center gap-2 shrink-0'>

            {/* My Orders — hidden on mobile, hidden for owner */}
            {!isRestaurant && (
              <button
                className='hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] hover:border-orange-200 transition-colors duration-150 cursor-pointer'
                onClick={() => navigate('/my-orders')}
              >
                <FiPackage className='text-[15px] text-[#ff4d2d]' />
                <span className='hidden lg:inline'>My Orders</span>
              </button>
            )}

            {/* Cart — hidden for owner role */}
            {!isRestaurant && (
              <button
                className='relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold bg-[#ff4d2d] hover:bg-[#e63d1e] active:scale-95 transition-all duration-150 text-white rounded-xl shadow-[0_2px_8px_rgba(255,77,45,0.3)] cursor-pointer'
                onClick={() => navigate('/cart')}
              >
                <FiShoppingCart className='text-[15px]' />
                <span className='hidden sm:inline'>Cart</span>
                {cartItems.length > 0 && (
                  <span className='absolute -top-2 -right-2 flex items-center justify-center w-[18px] h-[18px] bg-white text-[#ff4d2d] text-[10px] font-bold rounded-full border-2 border-[#ff4d2d]'>
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {/* Avatar + dropdown */}
            <div className='relative'>
              <div
                className='flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#ff4d2d] to-[#e63d1e] text-white text-[15px] font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-150 shadow-[0_2px_8px_rgba(255,77,45,0.3)]'
                onClick={() => setShowInfo(prev => !prev)}
              >
                {userData?.fullName?.slice(0, 1)}
              </div>

              {showInfo && (
                <>
                  <div className='fixed inset-0 z-[9998]' onClick={() => setShowInfo(false)} />
                  <div className='absolute top-[46px] right-0 w-[200px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-gray-100 rounded-2xl p-3 flex flex-col gap-0.5 z-[9999]'>
                    <div className='flex items-center gap-2 pb-2.5 mb-1 border-b border-gray-100'>
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#ff4d2d] to-[#e63d1e] text-white text-[13px] font-bold flex items-center justify-center shrink-0'>
                        {userData?.fullName?.slice(0, 1)}
                      </div>
                      <span className='text-[13px] font-bold truncate text-gray-800'>{userData?.fullName}</span>
                    </div>
                    {!isRestaurant && (
                      <button
                        className='flex items-center gap-2 text-left text-[13px] text-gray-600 font-medium hover:bg-orange-50 hover:text-[#ff4d2d] rounded-lg px-2 py-2 transition-colors duration-150 cursor-pointer'
                        onClick={() => { navigate('/my-orders'); setShowInfo(false) }}
                      >
                        <FiPackage className='text-[14px]' />
                        My Orders
                      </button>
                    )}
                    <button
                      className='flex items-center gap-2 text-left text-[13px] text-gray-600 font-medium hover:bg-orange-50 hover:text-[#ff4d2d] rounded-lg px-2 py-2 transition-colors duration-150 cursor-pointer'
                      onClick={handleLogOut}
                    >
                      <FiLogOut className='text-[14px]' />
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
      <div className='sm:hidden fixed bottom-0 left-0 right-0 z-[9999] h-[60px] bg-white border-t border-gray-100 flex items-center justify-around px-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]'>
        <button
          className='flex flex-col items-center gap-1 text-[#ff4d2d] cursor-pointer'
          onClick={() => navigate('/')}
        >
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-orange-50'>
            <FiHome className='text-[18px]' />
          </div>
          <span className='text-[11px] font-semibold'>Home</span>
        </button>

        <button className='flex flex-col items-center gap-1 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-150 cursor-pointer'>
          <FiSearch className='text-[21px]' />
          <span className='text-[11px] font-medium'>Search</span>
        </button>

        {!isRestaurant && (
          <button
            className='flex flex-col items-center gap-1 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-150 cursor-pointer'
            onClick={() => navigate('/my-orders')}
          >
            <FiPackage className='text-[21px]' />
            <span className='text-[11px] font-medium'>Orders</span>
          </button>
        )}

        <button
          className='flex flex-col items-center gap-1 text-gray-400 hover:text-[#ff4d2d] transition-colors duration-150 cursor-pointer'
          onClick={() => setShowInfo(prev => !prev)}
        >
          <FiUser className='text-[21px]' />
          <span className='text-[11px] font-medium'>Account</span>
        </button>
      </div>

      <div />
    </>
  )
}

export default Nav
