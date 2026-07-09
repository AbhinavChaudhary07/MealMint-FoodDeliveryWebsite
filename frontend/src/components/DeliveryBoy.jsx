import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { FiMapPin, FiNavigation, FiPackage, FiPhone, FiUser } from 'react-icons/fi'

function DeliveryBoy() {
  const { userData, myOrders } = useSelector(state => state.user)
  const [locationStatus, setLocationStatus] = useState("Checking location...")
  const [isOnline, setIsOnline] = useState(true)

  const deliveryAssignments = useMemo(() => {
    return (myOrders || []).flatMap((order) => {
      const shopOrders = Array.isArray(order?.shopOrders) ? order.shopOrders : []

      return shopOrders.map((shopOrder) => ({
        order,
        shopOrder
      }))
    })
  }, [myOrders])

  useEffect(() => {
    if (!navigator.geolocation) { 
      setLocationStatus("Location is not supported in this browser") 
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        setLocationStatus("Location sharing is active")
        try {
          await axios.post(`${serverUrl}/api/user/update-location`, {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }, { withCredentials: true })
        } catch (error) {
          console.log(error)
        }
      },
      () => setLocationStatus("Allow location permission to receive nearby delivery updates"), 
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return (
    <div className='min-h-screen bg-[#fafafa] pb-20'>

      {/* Sticky top strip: identity + online toggle */}
      <div className='sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100'>
        <div className='w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-11 h-11 rounded-full bg-[#ff4d2d] text-white font-bold flex items-center justify-center text-[16px] shrink-0'>
              {(userData?.fullName || "D").slice(0, 1)}
            </div>
            <div className='min-w-0'>
              <p className='font-bold text-gray-900 truncate leading-tight'>{userData?.fullName || "Delivery Partner"}</p>
              <p className='text-[12px] text-gray-400 truncate'>{locationStatus}</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnline(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition-colors duration-150 shrink-0 ${
              isOnline
                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>
      </div>

      <main className='w-full max-w-5xl mx-auto px-4 pt-6 flex flex-col gap-6'>

        {/* Intro line */}
        <div>
          <h1 className='text-[22px] sm:text-[26px] font-extrabold text-gray-900 tracking-tight'>
            {isOnline ? "Ready for deliveries" : "You're offline"}
          </h1>
          <p className='text-[13px] text-gray-500 mt-1'>
            Keep your status online and location enabled so restaurants can assign orders to you.
          </p>
        </div>

        {/* Compact horizontal info strip instead of 3 boxy cards */}
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
            <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
              <FiUser />
            </span>
            <span className='text-[13px] font-semibold text-gray-700'>{userData?.fullName || "Not available"}</span>
          </div>
          <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
            <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
              <FiPhone />
            </span>
            <span className='text-[13px] font-semibold text-gray-700'>{userData?.mobile || "Not available"}</span>
          </div>
          <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
            <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
              <FiMapPin />
            </span>
            <span className='text-[13px] font-semibold text-gray-700'>{locationStatus}</span>
          </div>
        </div>

        {/* Orders as a left-rail timeline instead of boxed cards */}
        <div>
          <div className='flex items-center gap-2 mb-4'>
            <FiPackage className='text-[#ff4d2d] text-[18px]' />
            <h2 className='text-[15px] font-bold text-gray-900 tracking-tight'>Assigned Orders</h2>
            {deliveryAssignments.length > 0 && (
              <span className='text-[11px] font-bold text-[#ff4d2d] bg-orange-50 rounded-full px-2 py-0.5'>
                {deliveryAssignments.length}
              </span>
            )}
          </div>

          {deliveryAssignments.length > 0 ? (
            <div className='flex flex-col'>
              {deliveryAssignments.map(({ order, shopOrder }, index) => (
                <div className='relative pl-6 pb-6 border-l-2 border-orange-100 last:border-transparent' key={shopOrder._id || index}>
                  {/* Timeline dot */}
                  <span className='absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#ff4d2d] ring-4 ring-orange-50' />

                  <div className='bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all duration-150'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <p className='text-[11px] text-gray-400 font-semibold'>#{order?._id?.slice(-6) || "pending"}</p>
                        <h3 className='font-bold text-gray-900 truncate'>{shopOrder.shop?.name || "Shop"}</h3>
                      </div>
                      <span className='shrink-0 rounded-full bg-orange-100 text-[#ff4d2d] px-2.5 py-1 text-[11px] font-bold capitalize'>
                        {shopOrder.status}
                      </span>
                    </div>

                    <p className='text-[13px] text-gray-500 mt-2 flex items-start gap-1.5'>
                      <FiMapPin className='text-gray-400 text-[13px] shrink-0 mt-0.5' />
                      {order?.deliveryAddress?.text}
                    </p>

                    <div className='flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 pt-3 border-t border-gray-100 text-[12px] text-gray-500'>
                      <span><span className='text-gray-400'>Customer:</span> <span className='font-semibold text-gray-700'>{order?.user?.fullName || "Customer"}</span></span>
                      <span><span className='text-gray-400'>Call:</span> <span className='font-semibold text-gray-700'>{order?.user?.mobile || "N/A"}</span></span>
                      <span><span className='text-gray-400'>Pay:</span> <span className='font-semibold text-gray-700'>{order?.paymentMethod?.toUpperCase() || "N/A"}</span></span>
                      <span className='ml-auto font-bold text-gray-900'>Rs {shopOrder.subtotal || 0}</span>
                    </div>

                    {shopOrder.shopOrderItems?.length > 0 && (
                      <div className='flex flex-wrap gap-1.5 mt-3'>
                        {shopOrder.shopOrderItems.map((item, itemIndex) => (
                          <span
                            key={item._id || itemIndex}
                            className='inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-2.5 py-1 text-[11px] font-medium text-gray-600'
                          >
                            {(item.item?.image || item.image) && (
                              <img
                                src={item.item?.image || item.image}
                                alt={item.name || "Food item"}
                                className='w-5 h-5 rounded-full object-cover'
                              />
                            )}
                            {item.name} <span className='text-gray-400'>x{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='border border-gray-200 rounded-xl p-10 text-center bg-white'>
              <div className='w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3'>
                <FiNavigation className='text-[#ff4d2d] text-2xl' />
              </div>
              <p className='font-semibold text-gray-800'>No active delivery yet</p>
              <p className='text-[13px] text-gray-500 mt-1'>
                You are ready to receive delivery requests.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DeliveryBoy
