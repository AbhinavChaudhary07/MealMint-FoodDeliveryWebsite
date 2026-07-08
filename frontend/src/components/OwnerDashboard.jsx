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
    <div className='min-h-screen bg-[#fff9f6]'>
      <OwnerNav />

      {/* Create Shop Form */}
      {!myShopData &&
        <div className='flex justify-center items-center min-h-[calc(100vh-64px)] px-4 sm:px-6- '>
          <div className='w-full max-w-lg'>

            {/* Header */}
            <div className='flex flex-col items-center mb-4 text-center'>
              <div className='w-16 h-16 rounded-2xl bg-[#fff0ed] border-2 border-dashed border-[#ff4d2d] flex items-center justify-center mb-4'>
                <MdOutlineStorefront className='text-[#ff4d2d] text-[30px]' />
              </div>
              <h2 className='text-[22px] sm:text-[26px] font-bold text-gray-800'>Set up your shop</h2>
              <p className='text-[13px] text-gray-400 mt-1'>Add your restaurant details to get started</p>
            </div>

            {/* Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-[#fde4d8] p-5 sm:p-6 flex flex-col gap-4'>

              {/* Image upload */}
              <label className='cursor-pointer group'>
                <div className='relative w-full h-[140px] sm:h-[160px] rounded-xl overflow-hidden bg-[#fff0ed] border-2 border-dashed border-[#ffd4c8] flex flex-col items-center justify-center gap-2 group-hover:border-[#ff4d2d] transition-colors'>
                  {form.preview
                    ? <img src={form.preview} alt='shop' className='w-full h-full object-cover' />
                    : <>
                        <FiCamera className='text-[#ff4d2d] text-[28px]' />
                        <span className='text-[13px] text-[#ff4d2d] font-medium'>Upload shop photo</span>
                        <span className='text-[11px] text-gray-400'>JPG, PNG up to 5MB</span>
                      </>
                  }
                  {form.preview && (
                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      <FiCamera className='text-white text-[28px]' />
                    </div>
                  )}
                </div>
                <input type='file' accept='image/*' className='hidden' onChange={handleImage} />
              </label>

              {/* Shop Name */}
              <div className='flex flex-col gap-1'>
                <label className='text-[12px] font-semibold text-gray-500 uppercase tracking-wide'>Shop Name</label>
                <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#ff4d2d] transition-colors bg-gray-50'>
                  <MdOutlineStorefront className='text-gray-400 text-[16px] shrink-0' />
                  <input name='name' value={form.name} onChange={handleChange} placeholder='e.g. Your Shop Name' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                </div>
              </div>

              {/* City & State */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-1 flex-1'>
                  <label className='text-[12px] font-semibold text-gray-500 uppercase tracking-wide'>City</label>
                  <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#ff4d2d] transition-colors bg-gray-50'>
                    <MdLocationCity className='text-gray-400 text-[16px] shrink-0' />
                    <input name='city' value={form.city} onChange={handleChange} placeholder='e.g. Muzaffarnagar' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                  </div>
                </div>
                <div className='flex flex-col gap-1 flex-1'>
                  <label className='text-[12px] font-semibold text-gray-500 uppercase tracking-wide'>State</label>
                  <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#ff4d2d] transition-colors bg-gray-50'>
                    <TbMap2 className='text-gray-400 text-[16px] shrink-0' />
                    <input name='state' value={form.state} onChange={handleChange} placeholder='e.g. Uttar Pradesh' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className='flex flex-col gap-1'>
                <label className='text-[12px] font-semibold text-gray-500 uppercase tracking-wide'>Address</label>
                <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#ff4d2d] transition-colors bg-gray-50'>
                  <FiMapPin className='text-gray-400 text-[16px] shrink-0' />
                  <input name='address' value={form.address} onChange={handleChange} placeholder='e.g. Your Shop Address' className='flex-1 text-[14px] bg-transparent outline-none placeholder-gray-300' />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='mt-2 w-full flex items-center justify-center gap-2 h-[46px] bg-[#ff4d2d] hover:bg-[#e63d1e] disabled:opacity-60 text-white text-[14px] font-semibold rounded-xl transition-colors'
              >
                {loading ? 'Creating...Please Wait' : 'Create Shop'}
                {!loading && <FiChevronRight className='text-[16px]' />}
              </button>
            </div>

            <p className='text-center text-[12px] text-gray-400 mt-4'>You can update these details anytime from your dashboard</p>
          </div>
        </div>
      }

      {/* Shop Dashboard */}
      {myShopData &&
        <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 py-8'>

          {/* Shop banner */}
          <div className='relative w-full h-[180px] sm:h-[240px] rounded-2xl overflow-hidden bg-[#fff0ed] mb-6'>
            {myShopData.image
              ? <img src={myShopData.image} alt={myShopData.name} className='w-full h-full object-cover' />
              : <div className='w-full h-full flex items-center justify-center'>
                  <MdOutlineStorefront className='text-[#ff4d2d] text-[60px] opacity-30' />
                </div>
            }
            {/* Edit button */}
            <button className='absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#ff4d2d] border border-[#ff4d2d] rounded-full text-[12px] font-semibold hover:bg-[#fff0ed] transition-colors cursor-pointer' onClick={() => navigate('/edit-shop')}>
              <FiEdit2 className='text-[13px]' />
              Edit Shop
            </button>
          </div>

          {/* Shop info card */}
          <div className='bg-white rounded-2xl border border-[#fde4d8] p-5 sm:p-6 flex flex-col gap-4'>
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-[22px] sm:text-[26px] font-bold text-gray-900'>{myShopData.name}</h1>
                <div className='flex items-center gap-1.5 mt-1'>
                  <FiMapPin className='text-[#ff4d2d] text-[13px] shrink-0' />
                  <span className='text-[13px] text-gray-500'>{myShopData.address}, {myShopData.city}, {myShopData.state}</span>
                </div>
              </div>
              <span className='px-3 py-1 bg-green-50 text-green-600 text-[12px] font-semibold rounded-full border border-green-200'>Active</span>
            </div>

            <div className='border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>City</span>
                <span className='text-[14px] font-medium text-gray-700'>{myShopData.city}</span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text[11px] font-semibold text-gray-400 uppercase tracking-wide'>State</span>
                <span className='text-[14px] font-medium text-gray-700'>{myShopData.state}</span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>Total Items</span>
                <span className='text-[14px] font-medium text-gray-700'>{myShopData.items?.length || 0} items</span>
              </div>
            </div>
          
          </div>
           {myShopData.items.length>0 && <div className='flex flex-col items-center gap-4 w-full max-w-3xl mt-6'>
              {myShopData.items.map((item,index)=>(
                <OwnerItemCart data={item} key={index}/>
              ))}
              </div>}
        </div>
        
      }
      
    </div>
  )
}

export default OwnerDashboard
