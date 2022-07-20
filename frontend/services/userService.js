import toast from 'react-hot-toast'
import API from './api'

const removeNotification = (txt) =>{
    toast.success(txt,{icon:"🚮",style:{background:"#f94144",color:"#fff",fontWeight:"900"}})
}

const UserService = {
    fetchAddress: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const res = await API.get("address/user/")
            return res.data
        }
        catch(err){console.log(err);throw err;}
    },
    changePassword: async (token, old_password,password)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
            const body = JSON.stringify({ old_password,password})
            const res = await API.post("password/user/",body)
            return res.data;
        } catch (error) {console.log(error); throw error;}
    },
    createAddress: async(token,street_address,apartment_address,city,pincode,phone_no,state,country) =>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
          const body = JSON.stringify({ street_address,apartment_address,city,pincode,phone:phone_no,state,country })
          const res = await API.post("address/",body)
          return res.data 
        } catch (error) {console.log(error); throw error;}
    },
    updateAddress: async(token,street_address,apartment_address,city,pincode,phone_no,state,country) =>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
          const body = JSON.stringify({ street_address,apartment_address,city,pincode,phone:phone_no,state,country })
          const res = await API.post("address/update/",body)
          return res.data 
        } catch (error) {console.log(error); throw error;}
    },
    deleteAddress: async(token) =>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
          const res = await API.delete("address/delete/")
          removeNotification("Address Deleted")
          return res.data 
        } catch (error) {console.log(error); throw error;}
    },
    changeDeliveryMode: async(token,delivery)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
          const body = JSON.stringify({ delivery })
          const res = await API.post("address/delivery/",body)
          toast.success("Delivery Mode Changed")
          return res.data 
        } catch (error) {console.log(error); throw error;}
    },
    fetchFav:async(token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try {
            const res = await API.get("favorites/")
            return res.data 
        } catch (error) {console.log(error); throw error;}
    },
    addToFav: async (slug,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body= JSON.stringify({ slug })
            const res = await API.post("favorites/add/",body)
            toast.success("Added to Favorites")
            return res.data;
        }catch(err){throw err;}
    },
    removeFromFav: async (slug,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body= JSON.stringify({ slug })
            const res = await API.post("favorites/remove/",body)
            removeNotification("Removed From Favorites")
            return res.data;
        }catch(err){throw err;}
    },
    clearFav: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const res = await API.delete("favorites/all/")
            return res.data;
        }catch(err){throw err;}
    },
    fetchOrders: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const res = await API.get("orders/")
            return res.data;
        }catch(err){throw err;}
    },
    getOrders: async (token,id)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const res = await API.get(`orders/${id}/`)
            return res.data;
        }catch(err){throw err;}
    }
}

export default UserService