import React, { useState } from 'react'
import OwnerNav from '../components/OwnerNav.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { FiCamera, FiMapPin, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { MdOutlineStorefront, MdLocationCity } from 'react-icons/md'
import { TbMap2 } from 'react-icons/tb'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { setMyShopData } from '../redux/ownerSlice.js'
import { useNavigate } from 'react-router-dom'

function EditShop() {
  const { myShopData } = useSelector(state => state.owner)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: myShopData?.name || '',
    city: myShopData?.city || '',
    state: myShopData?.state || '',
    address: myShopData?.address || '',
    image: null,
    preview: myShopData?.image || null
  })

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
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("city", form.city)
      formData.append("state", form.state)
      formData.append("address", form.address)
      if (form.image) formData.append("image", form.image)
      const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true })
      dispatch(setMyShopData(result.data))
      navigate('/owner-dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-[#fff9f6] relative overflow-hidden'>
      <OwnerNav onAddFood={() => {}} />

      {/* ambient background accents */}
      <div className='pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#ffdccb] opacity-50 blur-3xl' />
      <div className='pointer-events-none absolute top-1/3 -left-28 w-72 h-72 rounded-full bg-[#ffe8de] opacity-60 blur-3xl' />

      <div className='relative flex justify-center items-center min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10'>
        <div className='w-full max-w-lg'>

          {/* Header */}
          <div className='flex flex-col items-center mb-6 text-center'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff4d2d] to-[#ff8452] shadow-lg shadow-orange-200 flex items-center justify-center mb-4'>
              <MdOutlineStorefront className='text-white text-[28px]' />
            </div>
            <h2 className='text-[22px] sm:text-[27px] font-extrabold text-gray-900 tracking-tight'>Edit your shop</h2>
            <p className='text-[13px] text-gray-400 mt-1'>Update your restaurant details</p>
          </div>

          {/* Card */}
          <div className='bg-white rounded-3xl shadow-xl shadow-orange-100/60 border border-[#fde4d8] p-5 sm:p-7 flex flex-col gap-5'>

            {/* Image upload */}
            <label className='cursor-pointer group'>
              <div className='relative w-full h-[150px] sm:h-[170px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#fff3ee] to-[#ffe4d8] border-2 border-dashed border-[#ffc7b0] flex flex-col items-center justify-center gap-2 group-hover:border-[#ff4d2d] transition-colors duration-200'>
                {form.preview
                  ? <img src={form.preview} alt='shop' className='w-full h-full object-cover' />
                  : <>
                      <div className='w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center'>
                        <FiCamera className='text-[#ff4d2d] text-[20px]' />
                      </div>
                      <span className='text-[13px] text-[#ff4d2d] font-semibold'>Upload shop photo</span>
                      <span className='text-[11px] text-gray-400'>JPG, PNG up to 5MB</span>
                    </>
                }
                {form.preview && (
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <div className='flex flex-col items-center gap-1.5'>
                      <FiCamera className='text-white text-[24px]' />
                      <span className='text-white text-[12px] font-medium'>Change photo</span>
                    </div>
                  </div>
                )}
              </div>
              <input type='file' accept='image/*' className='hidden' onChange={handleImage} />
            </label>

            {/* Shop Name */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-[11px] font-bold text-gray-500 uppercase tracking-wider'>Shop Name</label>
              <div className='flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70'>
                <MdOutlineStorefront className='text-[#ff4d2d] text-[17px] shrink-0' />
                <input name='name' value={form.name} onChange={handleChange} placeholder='e.g. Your Shop Name' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800' />
              </div>
            </div>

            {/* City & State */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-1.5 flex-1'>
                <label className='text-[11px] font-bold text-gray-500 uppercase tracking-wider'>City</label>
                <div className='flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70'>
                  <MdLocationCity className='text-[#ff4d2d] text-[17px] shrink-0' />
                  <input name='city' value={form.city} onChange={handleChange} placeholder='e.g. Muzaffarnagar' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800' />
                </div>
              </div>
              <div className='flex flex-col gap-1.5 flex-1'>
                <label className='text-[11px] font-bold text-gray-500 uppercase tracking-wider'>State</label>
                <div className='flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70'>
                  <TbMap2 className='text-[#ff4d2d] text-[17px] shrink-0' />
                  <input name='state' value={form.state} onChange={handleChange} placeholder='e.g. Uttar Pradesh' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800' />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-[11px] font-bold text-gray-500 uppercase tracking-wider'>Address</label>
              <div className='flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-[#ff4d2d] focus-within:ring-4 focus-within:ring-orange-50 transition-all bg-gray-50/70'>
                <FiMapPin className='text-[#ff4d2d] text-[17px] shrink-0' />
                <input name='address' value={form.address} onChange={handleChange} placeholder='e.g. Your Shop Address' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300 text-gray-800' />
              </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-3 mt-1'>
              <button
                onClick={() => navigate('/owner-dashboard')}
                className='flex items-center justify-center gap-1.5 h-[48px] px-4 border border-gray-200 text-gray-600 text-[14px] font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors'
              >
                <FiChevronLeft className='text-[16px]' />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className='flex-1 flex items-center justify-center gap-1.5 h-[48px] bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] hover:from-[#e63d1e] hover:to-[#ff5a2a] text-white text-[14px] font-semibold rounded-xl shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98] group'
              >
                Save Changes
                <FiChevronRight className='text-[16px] transition-transform group-hover:translate-x-0.5' />
              </button>
            </div>
          </div>

          <p className='text-center text-[12px] text-gray-400 mt-5'>Changes will reflect immediately on your dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default EditShop
