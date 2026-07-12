import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { FiArrowLeft, FiSearch, FiMapPin, FiGrid, FiShoppingCart } from 'react-icons/fi'
import { FaLeaf, FaDrumstickBite } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const FILTERS = ['All', 'Veg', 'Non-Veg']

function Shop() {
  const { shopId } = useParams()
  const [items, setItems] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFoodType, setActiveFoodType] = useState('All')
  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.user)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
        setShop(result.data.shop)
        setItems(result.data.items)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchShop()
  }, [shopId])

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))]

  const filtered = items.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || item.category === activeCategory
    const matchFoodType = activeFoodType === 'All' ||
      (activeFoodType === 'Veg' ? item.foodType === 'veg' : item.foodType === 'nonveg')
    return matchSearch && matchCategory && matchFoodType
  })

  if (loading) return (
    <div className='min-h-screen bg-[#fffaf7] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-500 text-sm'>Loading menu…</p>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#fffaf7]'>

      {/* Hero */}
      <div className='relative w-full h-64 md:h-80 overflow-hidden'>
        {shop?.image
          ? <img src={shop.image} alt={shop.name} className='w-full h-full object-cover' />
          : <div className='w-full h-full bg-gradient-to-br from-[#2a1210] to-[#ff4d2d]' />
        }
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10' />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className='absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-2 rounded-full text-sm font-semibold transition-all border border-white/20'
        >
          <FiArrowLeft /> Back
        </button>

        {/* Shop info */}
        <div className='absolute bottom-0 left-0 right-0 px-6 pb-6'>
          <h1 className='text-3xl md:text-4xl font-black text-white drop-shadow-lg'>{shop?.name}</h1>
          {shop?.address && (
            <p className='flex items-center gap-1.5 text-white/80 text-sm mt-1'>
              <FiMapPin className='shrink-0' /> {shop.address}
            </p>
          )}
          <div className='flex items-center gap-3 mt-3'>
            <span className='bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full'>
              {items.length} items
            </span>
            {shop?.city && (
              <span className='bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full'>
                📍 {shop.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sticky filters bar */}
      <div className='sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'>
        <div className='max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3'>

          {/* Search */}
          <div className='flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#ff4d2d] focus-within:bg-white transition-all'>
            <FiSearch className='text-gray-400 shrink-0' />
            <input
              type='text'
              placeholder='Search dishes…'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400'
            />
            {search && (
              <button onClick={() => setSearch('')} className='text-gray-400 hover:text-gray-600 text-lg leading-none'>×</button>
            )}
          </div>

          {/* Category + foodtype filters */}
          <div className='flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5'>
            {/* Veg / Non-Veg toggle */}
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFoodType(f)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeFoodType === f
                    ? 'bg-[#ff4d2d] text-white border-[#ff4d2d]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4d2d] hover:text-[#ff4d2d]'
                }`}
              >
                {f === 'Veg' && <FaLeaf className='text-green-500' />}
                {f === 'Non-Veg' && <FaDrumstickBite className='text-red-500' />}
                {f === 'All' && <FiGrid />}
                {f}
              </button>
            ))}

            <div className='w-px h-5 bg-gray-200 shrink-0 mx-1' />

            {/* Category pills */}
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {filtered.length > 0 ? (
          <>
            <p className='text-sm text-gray-400 mb-5'>
              Showing <span className='font-semibold text-gray-700'>{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && <> in <span className='font-semibold text-gray-700'>{activeCategory}</span></>}
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center'>
              {filtered.map((item, index) => (
                <div key={item._id || index} className='w-full'>
                  <FoodCard data={item} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center py-24 gap-4'>
            <div className='w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center'>
              <FiSearch className='text-[#ff4d2d] text-2xl' />
            </div>
            <p className='font-semibold text-gray-700'>No items found</p>
            <p className='text-sm text-gray-400'>Try a different search or filter</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveFoodType('All') }}
              className='mt-1 px-4 py-2 bg-[#ff4d2d] text-white text-sm font-semibold rounded-xl hover:bg-[#e63d1e] transition-colors'
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {/* Floating cart button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className='fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e63d1e] text-white px-5 py-3 rounded-2xl shadow-xl shadow-orange-300/50 font-bold text-sm transition-all active:scale-95'
        >
          <FiShoppingCart size={18} />
          View Cart
          <span className='bg-white text-[#ff4d2d] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center'>
            {cartItems.length}
          </span>
        </button>
      )}
    </div>
  )
}

export default Shop
