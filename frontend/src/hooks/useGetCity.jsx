import React from 'react'
import { useEffect } from 'react'
import {serverUrl} from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCity, setUserData } from "../redux/userSlice";
import { setAddress, setLocation } from '../redux/mapSlice'


function useGetCity() {
    const dispatch=useDispatch()
    const{userData}= useSelector(state=>state.user)
    const apiKey =import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async(position)=>{
            const latitude =position.coords.latitude
            const longitude=position.coords.longitude
            dispatch(setLocation({lat:latitude,lon:longitude}))
            const result =await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
        
        
        dispatch(setCity(result?.data?.results[0]?.city))
       dispatch(setAddress(result?.data.results[0]?.address_line2
))
       console.log(result.data)

        })
    },[userData])
  
}

export default useGetCity
