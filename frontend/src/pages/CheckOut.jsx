import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount } from '../redux/userSlice';
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null

}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
    const { cartItems ,totalAmount,userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee=totalAmount>500?0:40
  const AmountWithDeliveryFee=totalAmount+deliveryFee






  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }
  const getCurrentLocation = () => {
      const latitude=userData.location.coordinates[1]
      const longitude=userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
   

  }

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder=async () => {
    try {
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount:AmountWithDeliveryFee,
        cartItems
      },{withCredentials:true})

      if(paymentMethod=="cod"){
      dispatch(addMyOrder(result.data))
      navigate("/order-placed")
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
          openRazorpayWindow(orderId,razorOrder)
       }
    
    } catch (error) {
      console.log(error)
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: razorOrder.amount,
    currency: 'INR',
    name: "MealMint",
    description: "Food Delivery",
    order_id: razorOrder.id,
    prefill: {
      name: userData?.fullName || "",
      email: userData?.email || "",
      contact: userData?.mobile || "",
      method: "upi",
      vpa: "success@razorpay"
    },
    theme: { color: "#ff4d2d" },
 handler:async function (response) {
  try {
    const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
      razorpay_payment_id:response.razorpay_payment_id,
      orderId
    },{withCredentials:true})
        dispatch(addMyOrder(result.data))
      navigate("/order-placed")
  } catch (error) {
    console.log(error)
  }
 }
  }

  const rzp=new window.Razorpay(options)
  rzp.open()


}


  useEffect(() => {
    setAddressInput(address)
  }, [address])
  return (
    <div className='min-h-screen bg-[#fafafa]'>

      {/* Top bar */}
      <div className='sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3'>
          <button
            onClick={() => navigate("/")}
            className='w-9 h-9 rounded-full flex items-center justify-center text-[#ff4d2d] hover:bg-orange-50 transition-colors duration-150 cursor-pointer shrink-0'
          >
            <IoIosArrowRoundBack size={26} />
          </button>
          <h1 className='text-[18px] font-extrabold text-gray-900 tracking-tight'>Checkout</h1>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start'>

          {/* Left column: location + payment */}
          <div className='flex flex-col gap-6 min-w-0'>

            {/* Delivery location */}
            <section className='bg-white rounded-2xl border border-gray-200 p-5 sm:p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='w-8 h-8 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[15px] shrink-0'>
                  <IoLocationSharp />
                </span>
                <h2 className='text-[15px] font-bold text-gray-900 tracking-tight'>Delivery Location</h2>
              </div>

              <div className='flex flex-col sm:flex-row gap-2 mb-4'>
                <input
                  type="text"
                  className='flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#ff4d2d] transition-colors duration-150 bg-gray-50/60'
                  placeholder='Enter your delivery address..'
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
                <div className='flex gap-2 shrink-0'>
                  <button
                    className='flex-1 sm:flex-initial bg-[#ff4d2d] hover:bg-[#e64526] active:scale-[0.97] text-white px-3.5 py-2.5 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer'
                    onClick={getLatLngByAddress}
                    title='Search address'
                  >
                    <IoSearchOutline size={17} />
                  </button>
                  <button
                    className='flex-1 sm:flex-initial bg-gray-900 hover:bg-gray-800 active:scale-[0.97] text-white px-3.5 py-2.5 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer'
                    onClick={getCurrentLocation}
                    title='Use current location'
                  >
                    <TbCurrentLocation size={17} />
                  </button>
                </div>
              </div>

              <div className='rounded-xl border border-gray-200 overflow-hidden'>
                <div className='h-64 sm:h-72 w-full flex items-center justify-center'>
                  <MapContainer
                    className={"w-full h-full"}
                    center={[location?.lat, location?.lon]}
                    zoom={16}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap location={location} />
                    <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />


                  </MapContainer>
                </div>
              </div>
              <p className='text-[11px] text-gray-400 mt-2.5'>Drag the pin on the map to fine-tune your exact delivery spot.</p>
            </section>

            {/* Payment method */}
            <section className='bg-white rounded-2xl border border-gray-200 p-5 sm:p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='w-8 h-8 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[15px] shrink-0'>
                  <FaCreditCard className='text-[13px]' />
                </span>
                <h2 className='text-[15px] font-bold text-gray-900 tracking-tight'>Payment Method</h2>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div
                  className={`relative flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition-all duration-150 ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50/60 ring-1 ring-[#ff4d2d]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0'>
                    <MdDeliveryDining className='text-green-600 text-xl' />
                  </span>
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900 text-[14px]'>Cash On Delivery</p>
                    <p className='text-[12px] text-gray-500'>Pay when your food arrives</p>
                  </div>
                  {paymentMethod === "cod" && (
                    <span className='absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#ff4d2d]' />
                  )}
                </div>

                <div
                  className={`relative flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition-all duration-150 ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50/60 ring-1 ring-[#ff4d2d]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setPaymentMethod("online")}
                >
                  <div className='flex -space-x-2 shrink-0'>
                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 ring-2 ring-white'>
                      <FaMobileScreenButton className='text-purple-700 text-base' />
                    </span>
                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 ring-2 ring-white'>
                      <FaCreditCard className='text-blue-700 text-base' />
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900 text-[14px]'>UPI / Credit / Debit Card</p>
                    <p className='text-[12px] text-gray-500'>Pay securely online</p>
                  </div>
                  {paymentMethod === "online" && (
                    <span className='absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#ff4d2d]' />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right column: sticky order summary */}
          <div className='lg:sticky lg:top-24 flex flex-col gap-4'>
            <section className='bg-white rounded-2xl border border-gray-200 p-5 sm:p-6'>
              <h2 className='text-[15px] font-bold text-gray-900 tracking-tight mb-4'>Order Summary</h2>

              <div className='flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1'>
                {cartItems.map((item, index) => (
                  <div key={index} className='flex justify-between items-start gap-3 text-[13px]'>
                    <span className='text-gray-600'>
                      <span className='font-semibold text-gray-800'>{item.quantity}x</span> {item.name}
                    </span>
                    <span className='text-gray-700 font-medium shrink-0'>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className='border-t border-dashed border-gray-200 mt-4 pt-4 flex flex-col gap-2'>
                <div className='flex justify-between text-[13px] text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-medium text-gray-800'>₹{totalAmount}</span>
                </div>
                <div className='flex justify-between text-[13px] text-gray-600'>
                  <span>Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-800"}`}>
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className='flex justify-between items-center border-t border-gray-100 mt-1 pt-3'>
                  <span className='text-[14px] font-bold text-gray-900'>Total</span>
                  <span className='text-[20px] font-extrabold text-[#ff4d2d]'>₹{AmountWithDeliveryFee}</span>
                </div>
              </div>
            </section>

            <button
              className='w-full bg-[#ff4d2d] hover:bg-[#e64526] active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold text-[14px] shadow-sm shadow-orange-200 transition-all duration-150 cursor-pointer'
              onClick={handlePlaceOrder}
            >
              {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
            </button>
            <p className='text-center text-[11px] text-gray-400'>By placing this order you agree to our terms of service</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckOut
