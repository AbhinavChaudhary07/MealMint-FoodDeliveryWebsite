import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { FiTruck, FiLogOut, FiUser } from 'react-icons/fi'

function DeliveryNav() {
  const { userData } = useSelector(state => state.user)
  const [showDropdown, setShowDropdown] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full fixed top-0 z-[9999] bg-white border-b border-[#fde4d8] shadow-[0_2px_10px_rgba(255,77,45,0.08)]'>
      <div className='flex items-center h-[68px] px-4 sm:px-6 gap-4 max-w-[1400px] mx-auto'>

        {/* Logo */}
        <h1 className='text-[24px] sm:text-[26px] font-black tracking-tight shrink-0 select-none'>
          <span className='bg-gradient-to-r from-[#ff4d2d] to-[#ff8a5c] bg-clip-text text-transparent'>Meal</span>
          <span className='text-gray-800'>Mint</span>
        </h1>

        {/* Badge */}
        <div className='flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full'>
          <FiTruck className='text-[#ff4d2d] text-[14px]' />
          <span className='text-xs font-semibold text-[#ff4d2d]'>Delivery Partner</span>
        </div>

        <div className='flex-1' />

        {/* Avatar + dropdown */}
        <div className='relative'>
          <div
            className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#ff4d2d] to-[#e63d1e] text-white text-[16px] font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-150 shadow-[0_2px_8px_rgba(255,77,45,0.35)]'
            onClick={() => setShowDropdown(prev => !prev)}
          >
            {userData?.fullName?.slice(0, 1)}
          </div>

          {showDropdown && (
            <>
              <div className='fixed inset-0 z-[9998]' onClick={() => setShowDropdown(false)} />
              <div className='absolute top-[50px] right-0 w-[200px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[#fde4d8] rounded-2xl p-4 flex flex-col gap-1 z-[9999]'>
                <div className='flex items-center gap-2 border-b border-gray-100 pb-3 mb-1'>
                  <FiUser className='text-[#ff4d2d] shrink-0' />
                  <span className='text-[14px] font-bold truncate text-gray-800'>{userData?.fullName}</span>
                </div>
                <button
                  className='flex items-center gap-2 text-left text-[13px] text-gray-700 font-medium hover:bg-[#fff3ee] hover:text-[#ff4d2d] rounded-lg px-2 py-2 transition-colors duration-150 cursor-pointer'
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
  )
}

export default DeliveryNav
