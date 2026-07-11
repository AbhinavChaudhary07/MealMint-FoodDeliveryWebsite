import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch=useDispatch()
  const handleSignIn = async () => {
    setLoading(true)
    setErr("")
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (error) {
      setErr(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: result.user.displayName,
        email: result.user.email,
      }, { withCredentials: true })
      dispatch(setUserData(data))
    } catch (error) {
      setErr(error?.response?.data?.message || "Google sign-in failed")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 overflow-auto"
      style={{ backgroundColor: "#FFF5F2" }}>
      <div className="bg-white w-full max-w-md rounded-2xl p-10"
        style={{ border: "1px solid #FFD5CB" }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#FF4D2D" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight" style={{ color: "#FF4D2D" }}>MealMint</span>
        </div>

        <p className="text-sm text-gray-400 mb-7 leading-relaxed">
          Sign in to your account to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="yourmail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none transition-colors"
            style={{ border: "1.5px solid #EAEAEA" }}
            onFocus={e => e.target.style.borderColor = "#FF4D2D"}
            onBlur={e => e.target.style.borderColor = "#EAEAEA"}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm text-gray-800 bg-gray-50 outline-none transition-colors"
              style={{ border: "1.5px solid #EAEAEA" }}
              onFocus={e => e.target.style.borderColor = "#FF4D2D"}
              onBlur={e => e.target.style.borderColor = "#EAEAEA"}
              required
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev)}
              type="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <IoMdEyeOff size={17} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <span
            className="text-xs font-semibold cursor-pointer"
            style={{ color: "#FF4D2D" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: loading ? "#ffb3a3" : "#FF4D2D", cursor: loading ? "not-allowed" : "pointer" }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#E64323" }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#FF4D2D" }}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {loading ? "Logging in..." : "Log in"}
        </button>

        {err && <p className="text-red-500 text-center text-xs mt-2">{err}</p>}

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-50"
          style={{ border: "1.5px solid #EAEAEA" }}
        >
          <FcGoogle size={18} />
          Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            className="font-semibold cursor-pointer"
            style={{ color: "#FF4D2D" }}
            onClick={() => navigate("/Signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignIn
