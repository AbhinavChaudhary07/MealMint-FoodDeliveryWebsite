import React from 'react'
import { useEffect } from 'react'
import {serverUrl} from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity, setUserData } from "../redux/userSlice";


function useGetShopByCity() {
    const dispatch=useDispatch()
    const {city} = useSelector(state=>state.user)
  useEffect(()=>{
   const fetchShop =async ()=>{
    try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`,
        {withCredentials:true})
        dispatch(setShopInMyCity(result.data))
        console.log(result.data)
    } catch (error) {
        console.log(error)
    }
    
   }
   fetchShop()
  },[city])
}

export default useGetShopByCity
