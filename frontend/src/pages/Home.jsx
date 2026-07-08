import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import Nav from '../components/Nav'

function Home() {
    const{userData}=useSelector(state=>state.user)
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex-col items-center bg-[#fff9f6]'>
      {userData?.role=="user" && <UserDashboard/>}
       {userData?.role=="owner" && <OwnerDashboard/>}
       {userData?.role=="deliveryBoy" && <DeliveryBoy/>}
       {userData && !["user", "owner", "deliveryBoy"].includes(userData.role) && (
        <div className='w-full max-w-xl mx-auto bg-white border border-orange-100 rounded-2xl p-6 text-center shadow-sm'>
          <h1 className='text-xl font-bold text-gray-900'>Unknown account role</h1>
          <p className='text-sm text-gray-500 mt-2'>Role received: {userData.role}</p>
        </div>
       )}
       

    </div>
  )
}

export default Home
