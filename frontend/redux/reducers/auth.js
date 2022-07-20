import { createSlice } from '@reduxjs/toolkit'
import axios from "axios"
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
const initialState = {
    user:            Cookies.get("user") || null,
    token:           Cookies.get("token") || null,
    isAuthenticated: Cookies.get("token") ? true : false,
}

const config = {
  headers:{
    "Content-Type":"application/json"
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login:async(state,action)=>{
      let data = action.payload;
      const body = JSON.stringify({ username:data.username,password:data.password });
      const res = await axios.post("http://localhost:8000/accounts/",body,config)
      if(res.data && res.data.access){
        state.token = res.data.access
        state.user = res.data.user
        Cookies.set("token",state.token)
        Cookies.set("user",JSON.stringify(state.user))
        toast.success("Login Successful",{duration:4000})
      }else{
        toast.error(res.data.error.toString())
      }
    },
    register:async (state,action)=>{
      let data = action.payload;
      const body = JSON.stringify({first_name:data.first_name,last_name:data.last_name,email:data.email,username:data.username,password:data.password})
      await axios.post("http://localhost:8000/accounts/signup/",body,config)
      const res = await axios.post("http://localhost:8000/accounts/",body,config)
      if(res.data.success){
        state.token = res.data.access
        state.user = res.data.user
        Cookies.set("token",state.token)
        Cookies.set("user",JSON.stringify(state.user))
        toast.success("Registered User Successful",{duration:5000});
      }else{
        toast.error(res.data.error.toString())
      }
    },
    logout: (state)=>{
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("token");Cookies.remove("user")
    },
    update:async (state,action)=>{
      let data = action.payload;
      const body = JSON.stringify({ first_name:data.first_name,last_name:data.last_name,email:data.email,username:data.username,password:data.old_password,new_password:data.password })
      const res = await axios.post("http://localhost:8000/accounts/update/",body,{headers:{"Content-Type": "application/json","Authorization":`Bearer ${state.token}`}})
      if(res.data.user){
        state.user = res.data.user
        Cookies.set("user",JSON.stringify(state.user))
        toast.success(res.data.success.toString(),{duration: 4000})
      } else if(res.data.error){
        toast.error(res.data.error.toString())
      } else null
    },
    deleteAcc:async(state,action) =>{
      let data = action.payload;
      const body = JSON.stringify({ password:data.password })
      const res = await axios.post("http://localhost:8000/accounts/delete/",body,{headers:{"Content-Type": "application/json","Authorization":`Bearer ${state.token}`}});
      if (res.data.success){
        Cookies.remove("user")
        Cookies.remove("token")
        state.user=null;
        state.token = null;
        toast.success("Successfully deleted user account")
      }else if(res.data.error){
        toast.error(res.data.error.toString())
      } else null
    }
  },
})

// Action creators are generated for each case reducer function
export const { register,login,logout,update,deleteAcc } =authSlice.actions 
export default authSlice.reducer