import React, { useState } from 'react'
import OwnerNav from './OwnerNav.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { FiCamera, FiMapPin, FiChevronRight, FiEdit2 } from 'react-icons/fi'
import { MdOutlineStorefront, MdLocationCity } from 'react-icons/md'
import { TbMap2 } from 'react-icons/tb'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'
import { useNavigate } from 'react-router-dom'
import OwnerItemCart from './OwnerItemCart.jsx'

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', state: '', address: '', image: null, preview: null })

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(prev => ({ ...prev, image: file, preview: URL.createObjectURL(file) }))
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("city", form.city)
      formData.append("state", form.state)
      formData.append("address", form.address)
      if (form.image) formData.append("image", form.image)
      const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true })
      dispatch(setMyShopData(result.data))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#fafafa]'>
      <OwnerNav />

      {/* Create Shop Form */}
      {!myShopData &&
        <div className='flex justify-center items-center min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10'>
          <div className='w-full max-w-lg'>

            {/* Header */}
            <div className='flex flex-col items-center mb-6 text-center'>
              <div className='w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4'>
                <MdOutlineStorefront className='text-[#ff4d2d] text-[24px]' />
              </div>
              <h2 className='text-[22px] sm:text-[26px] font-extrabold text-gray-900 tracking-tight'>Set up your shop</h2>
              <p className='text-[13px] text-gray-500 mt-1.5'>Add your restaurant details to get started</p>
            </div>

            {/* Card */}
            <div className='bg-white rounded-xl border border-gray-200 p-5 sm:p-7 flex flex-col gap-5'>

              {/* Image upload */}
              <label className='cursor-pointer group'>
                <div className='relative w-full h-[150px] sm:h-[170px] rounded-xl overflow-hidden bg-orange-50/40 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 group-hover:border-[#ff4d2d] transition-colors duration-150'>
                  {form.preview
                    ? <img src={form.preview} alt='shop' className='w-full h-full object-cover' />
                    : <>
                        <div className='w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center'>
                          <FiCamera className='text-[#ff4d2d] text-[18px]' />
                        </div>
                        <span className='text-[13px] text-gray-700 font-semibold'>Upload shop photo</span>
                        <span className='text-[11px] text-gray-400'>JPG, PNG up to 5MB</span>
                      </>
                  }
                  {form.preview && (
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
                      <div className='flex flex-col items-center gap-1.5'>
                        <FiCamera className='text-white text-[22px]' />
                        <span className='text-white text-[12px] font-medium'>Change photo</span>
                      </div>
                    </div>
                  )}
                </div>
                <input type='file' accept='image/*' className='hidden' onChange={handleImage} />
              </label>

              {/* Shop Name */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Shop Name</label>
                <div className='flex items-center gap-2.5 border border-gray-200 rounded-lg px-3.5 py-2.5 focus-within:border-[#ff4d2d] transition-colors duration-150'>
                  <MdOutlineStorefront className='text-gray-400 text-[16px] shrink-0' />
                  <input name='name' value={form.name} onChange={handleChange} placeholder='e.g. Your Shop Name' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                </div>
              </div>

              {/* City & State */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-1.5 flex-1'>
                  <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider'>City</label>
                  <div className='flex items-center gap-2.5 border border-gray-200 rounded-lg px-3.5 py-2.5 focus-within:border-[#ff4d2d] transition-colors duration-150'>
                    <MdLocationCity className='text-gray-400 text-[16px] shrink-0' />
                    <input name='city' value={form.city} onChange={handleChange} placeholder='e.g. Muzaffarnagar' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                  </div>
                </div>
                <div className='flex flex-col gap-1.5 flex-1'>
                  <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider'>State</label>
                  <div className='flex items-center gap-2.5 border border-gray-200 rounded-lg px-3.5 py-2.5 focus-within:border-[#ff4d2d] transition-colors duration-150'>
                    <TbMap2 className='text-gray-400 text-[16px] shrink-0' />
                    <input name='state' value={form.state} onChange={handleChange} placeholder='e.g. Uttar Pradesh' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Address</label>
                <div className='flex items-center gap-2.5 border border-gray-200 rounded-lg px-3.5 py-2.5 focus-within:border-[#ff4d2d] transition-colors duration-150'>
                  <FiMapPin className='text-gray-400 text-[16px] shrink-0' />
                  <input name='address' value={form.address} onChange={handleChange} placeholder='e.g. Your Shop Address' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='mt-1 w-full flex items-center justify-center gap-2 h-[46px] bg-[#ff4d2d] hover:bg-[#e63d1e] active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100 text-white text-[14px] font-semibold rounded-lg transition-all duration-150 cursor-pointer'
              >
                {loading ? 'Creating...Please Wait' : 'Create Shop'}
                {!loading && <FiChevronRight className='text-[16px]' />}
              </button>
            </div>

            <p className='text-center text-[12px] text-gray-400 mt-5'>You can update these details anytime from your dashboard</p>
          </div>
        </div>
      }

      {/* Shop Dashboard */}
      {myShopData &&
        <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 py-8'>

          {/* Shop banner */}
          <div className='relative w-full h-[180px] sm:h-[240px] rounded-xl overflow-hidden bg-orange-50 mb-5'>
            {myShopData.image
              ? <img src={myShopData.image} alt={myShopData.name} className='w-full h-full object-cover' />
              : <div className='w-full h-full flex items-center justify-center'>
                  <MdOutlineStorefront className='text-[#ff4d2d] text-[52px] opacity-30' />
                </div>
            }
            <div className='absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none' />

            {/* Edit button */}
            <button className='absolute top-3 right-3 flex items-center gap-1.5 px-3.5 py-2 bg-white/95 backdrop-blur text-gray-700 border border-white rounded-full text-[12px] font-semibold shadow-sm hover:bg-white transition-colors duration-150 cursor-pointer' onClick={() => navigate('/edit-shop')}>
              <FiEdit2 className='text-[13px]' />
              Edit Shop
            </button>
          </div>

          {/* Shop identity row */}
          <div className='flex items-start justify-between gap-3 mb-4'>
            <div>
              <h1 className='text-[22px] sm:text-[26px] font-extrabold text-gray-900 tracking-tight'>{myShopData.name}</h1>
              <p className='text-[13px] text-gray-500 mt-1 flex items-center gap-1.5'>
                <FiMapPin className='text-[#ff4d2d] text-[13px] shrink-0' />
                {myShopData.address}, {myShopData.city}, {myShopData.state}
              </p>
            </div>
            <span className='shrink-0 flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[12px] font-bold rounded-full border border-green-200'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
              Active
            </span>
          </div>

          {/* Compact pill chips instead of a boxy stats card */}
          <div className='flex flex-wrap gap-3 mb-8'>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
              <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
                <MdLocationCity />
              </span>
              <span className='text-[13px] font-semibold text-gray-700'>{myShopData.city}</span>
            </div>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
              <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
                <TbMap2 />
              </span>
              <span className='text-[13px] font-semibold text-gray-700'>{myShopData.state}</span>
            </div>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-1.5'>
              <span className='w-7 h-7 rounded-full bg-orange-50 text-[#ff4d2d] flex items-center justify-center text-[13px] shrink-0'>
                <MdOutlineStorefront />
              </span>
              <span className='text-[13px] font-semibold text-gray-700'>{myShopData.items?.length || 0} items</span>
            </div>
          </div>

          {/* Menu items as a left-rail timeline, matching the DeliveryBoy list style */}
          {myShopData.items.length > 0 &&
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <h3 className='text-[15px] font-bold text-gray-900 tracking-tight'>Menu Items</h3>
                <span className='text-[11px] font-bold text-[#ff4d2d] bg-orange-50 rounded-full px-2 py-0.5'>
                  {myShopData.items.length}
                </span>
              </div>
              <div className='flex flex-col items-center gap-4 w-full max-w-3xl mx-auto'>
                {myShopData.items.map((item, index) => (
                  <OwnerItemCart data={item} key={index} />
                ))}
              </div>
            </div>}
        </div>

      }

    </div>
  )
}

export default OwnerDashboard
