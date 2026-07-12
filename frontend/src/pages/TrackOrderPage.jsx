import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from 'react-icons/io'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
import { FiMessageCircle } from 'react-icons/fi'

function TrackOrderPage() {
  const { orderId } = useParams()
  const [currentOrder, setCurrentOrder] = useState(null)
  const navigate = useNavigate()
  const { socket } = useSelector(state => state.user)
  const [liveLocations, setLiveLocations] = useState({})

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!socket) return
    const handler = ({ deliveryBoyId, latitude, longitude }) => {
      setLiveLocations(prev => ({ ...prev, [deliveryBoyId]: { lat: latitude, lon: longitude } }))
    }
    socket.on('updateDeliveryLocation', handler)
    return () => socket.off('updateDeliveryLocation', handler)
  }, [socket])

  useEffect(() => {
    handleGetOrder()
  }, [orderId])

  return (
    <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
      <div className='flex items-center gap-4 mt-5 mb-2 cursor-pointer' onClick={() => navigate('/')}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
        <h1 className='text-2xl font-bold'>Track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div className='bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4' key={index}>
          <div>
            <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop?.name}</p>
            <p className='font-semibold'>Items: {shopOrder.shopOrderItems?.map(i => i.name).join(', ')}</p>
            <p><span className='font-semibold'>Subtotal:</span> Rs {shopOrder.subtotal}</p>
            <p className='mt-4'><span className='font-semibold'>Delivery address:</span> {currentOrder.deliveryAddress?.text}</p>
          </div>

          {shopOrder.status !== 'delivered' ? (
            shopOrder.assignedDeliveryBoy ? (
              <div className='text-sm text-gray-700 space-y-1'>
                <p className='font-semibold'>Delivery Boy: {shopOrder.assignedDeliveryBoy.fullName}</p>
                <p className='font-semibold'>Contact: {shopOrder.assignedDeliveryBoy.mobile}</p>
                <button
                  onClick={() => navigate(`/chat/${currentOrder._id}/${shopOrder._id}`)}
                  className='flex items-center gap-2 mt-2 px-4 py-2 bg-[#ff4d2d] hover:bg-[#e63d1e] text-white text-sm font-semibold rounded-xl transition-colors'
                >
                  <FiMessageCircle size={15} />
                  Chat with Delivery Boy
                </button>
              </div>
            ) : (
              <p className='font-semibold text-gray-500'>Delivery boy not assigned yet.</p>
            )
          ) : (
            <p className='text-green-600 font-semibold text-lg'>Delivered ✓</p>
          )}

          {shopOrder.assignedDeliveryBoy && shopOrder.status !== 'delivered' && (() => {
            const livePos = liveLocations[shopOrder.assignedDeliveryBoy._id]
            const coords = shopOrder.assignedDeliveryBoy.location?.coordinates
            const deliveryBoyLocation = livePos || (coords ? { lat: coords[1], lon: coords[0] } : null)

            if (!deliveryBoyLocation) return (
              <p className='text-sm text-gray-400'>Waiting for delivery boy location…</p>
            )

            return (
              <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md'>
                <DeliveryBoyTracking data={{
                  deliveryBoyLocation,
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude
                  }
                }} />
              </div>
            )
          })()}
        </div>
      ))}
    </div>
  )
}

export default TrackOrderPage
