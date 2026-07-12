import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { FiSend } from 'react-icons/fi'

function Chat() {
  const { orderId, shopOrderId } = useParams()
  const { socket, userData, myOrders } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const roomId = `chat_${orderId}_${shopOrderId}`

  // Find the other person's name for the header
  const order = myOrders?.find(o => o._id === orderId)
  const shopOrder = order?.shopOrders?.find(s => s._id === shopOrderId)
  const otherName = userData?.role === 'user'
    ? shopOrder?.assignedDeliveryBoy?.fullName || 'Delivery Boy'
    : order?.user?.fullName || 'Customer'

  useEffect(() => {
    if (!socket) return
    socket.emit('joinChat', { roomId })

    const handler = ({ message, senderId, senderName, timestamp }) => {
      setMessages(prev => [...prev, { message, senderId, senderName, timestamp }])
    }
    socket.on('receiveMessage', handler)
    return () => socket.off('receiveMessage', handler)
  }, [socket, roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !socket) return
    const payload = {
      roomId,
      message: input.trim(),
      senderId: userData._id,
      senderName: userData.fullName,
      timestamp: new Date().toISOString()
    }
    socket.emit('sendMessage', payload)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className='min-h-screen bg-[#fffaf7] flex flex-col'>

      {/* Header */}
      <div className='sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm'>
        <div className='max-w-2xl mx-auto px-4 h-16 flex items-center gap-3'>
          <button
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-full flex items-center justify-center text-[#ff4d2d] hover:bg-orange-50 transition-colors shrink-0'
          >
            <IoIosArrowRoundBack size={26} />
          </button>
          <div className='flex items-center gap-2.5 min-w-0'>
            <div className='w-9 h-9 rounded-full bg-[#ff4d2d] text-white font-bold flex items-center justify-center text-sm shrink-0'>
              {otherName.slice(0, 1)}
            </div>
            <div className='min-w-0'>
              <p className='font-bold text-gray-900 text-sm truncate'>{otherName}</p>
              <p className='text-xs text-green-500 font-medium'>Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-4 py-4 max-w-2xl w-full mx-auto flex flex-col gap-2'>
        {messages.length === 0 && (
          <div className='flex-1 flex flex-col items-center justify-center gap-2 text-center py-20'>
            <div className='w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-2xl'>💬</div>
            <p className='font-semibold text-gray-700'>No messages yet</p>
            <p className='text-sm text-gray-400'>Start the conversation with {otherName}</p>
          </div>
        )}
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userData._id
          return (
            <div key={index} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
              {!isMe && (
                <p className='text-[11px] text-gray-400 px-1'>{msg.senderName}</p>
              )}
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                isMe
                  ? 'bg-[#ff4d2d] text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                {msg.message}
              </div>
              <p className='text-[10px] text-gray-400 px-1'>{formatTime(msg.timestamp)}</p>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3'>
        <div className='max-w-2xl mx-auto flex items-center gap-2'>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type a message…'
            className='flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#ff4d2d] focus:bg-white transition-all'
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className='w-10 h-10 rounded-xl bg-[#ff4d2d] hover:bg-[#e63d1e] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0'
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
