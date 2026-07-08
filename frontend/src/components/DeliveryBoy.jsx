import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Nav from './Nav'
import { FiMapPin, FiNavigation, FiPackage, FiPhone, FiUser } from 'react-icons/fi'

function DeliveryBoy() {
  const { userData } = useSelector(state => state.user)
  const [locationStatus, setLocationStatus] = useState("Checking location...")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      () => setLocationStatus("Location sharing is active"),
      () => setLocationStatus("Allow location permission to receive nearby delivery updates"),
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return (
    <div className='min-h-screen bg-[#fff9f6] pb-20'>
      <Nav />

      <main className='w-full max-w-5xl mx-auto px-4 pt-6 flex flex-col gap-6'>
        <section className='bg-white border border-orange-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold text-[#ff4d2d]'>Delivery Dashboard</p>
              <h1 className='text-2xl font-bold text-gray-900 mt-1'>
                Welcome, {userData?.fullName || "Delivery Partner"}
              </h1>
              <p className='text-sm text-gray-500 mt-2'>
                Keep your status online and location enabled so restaurants can assign orders to you.
              </p>
            </div>

            <button
              className={`px-5 py-2.5 rounded-full text-sm font-semibold text-white transition ${isOnline ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}`}
              onClick={() => setIsOnline(prev => !prev)}
            >
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </section>

        <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white border border-orange-100 rounded-2xl p-4 shadow-sm'>
            <div className='flex items-center gap-3 text-gray-800'>
              <span className='w-10 h-10 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center'>
                <FiUser />
              </span>
              <div>
                <p className='text-xs text-gray-500'>Partner</p>
                <p className='font-semibold'>{userData?.fullName || "Not available"}</p>
              </div>
            </div>
          </div>

          <div className='bg-white border border-orange-100 rounded-2xl p-4 shadow-sm'>
            <div className='flex items-center gap-3 text-gray-800'>
              <span className='w-10 h-10 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center'>
                <FiPhone />
              </span>
              <div>
                <p className='text-xs text-gray-500'>Mobile</p>
                <p className='font-semibold'>{userData?.mobile || "Not available"}</p>
              </div>
            </div>
          </div>

          <div className='bg-white border border-orange-100 rounded-2xl p-4 shadow-sm'>
            <div className='flex items-center gap-3 text-gray-800'>
              <span className='w-10 h-10 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center'>
                <FiMapPin />
              </span>
              <div>
                <p className='text-xs text-gray-500'>Location</p>
                <p className='font-semibold'>{locationStatus}</p>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-white border border-orange-100 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='w-10 h-10 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center'>
              <FiPackage />
            </span>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>Assigned Orders</h2>
              <p className='text-sm text-gray-500'>Delivery assignments will appear here when a restaurant sends one.</p>
            </div>
          </div>

          <div className='border border-dashed border-orange-200 rounded-xl p-8 text-center bg-orange-50/40'>
            <FiNavigation className='mx-auto text-[#ff4d2d] text-3xl mb-3' />
            <p className='font-semibold text-gray-800'>No active delivery yet</p>
            <p className='text-sm text-gray-500 mt-1'>
              You are ready to receive delivery requests.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DeliveryBoy
