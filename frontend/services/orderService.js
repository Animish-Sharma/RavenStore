import API from './api'
import toast from "react-hot-toast"
import axios from 'axios'

const removeNotification = (txt) =>{
    toast.success(txt,{icon:"🚮",style:{background:"#f94144",color:"#fff",fontWeight:"900"}})
}
const OrderService = {
    fetchCart: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const res = await API.get("cart/")
            return res.data || {}
        }
        catch(err){
            console.log(err)
            throw err;
        }
    },
    addToCart: async (slug,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body= JSON.stringify({ slug })
            const res = await API.post("cart/add/",body)
            toast.success("Added to Cart")
            return res.data;
        }catch(err){throw err;}
    },
    removeFromCart: async (slug,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body= JSON.stringify({ slug })
            const res = await API.post("cart/remove/",body)
            removeNotification("Removed from Cart")
            return res.data;
        }catch(err){throw err;}
    },
    addCoupon: async (coupon,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ coupon })
            const res = await API.post("cart/coupon/",body)
            toast.success("Coupon Added")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    removeCoupon: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            await API.post("cart/coupon/remove/")
            removeNotification("Coupon Removed")
            return 0
        }catch(err){console.log(err);throw err;}
    },
    clearCart: async (token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            let res = await API.delete("cart/delete/")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    deleteItem: async (token,slug)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            const body = JSON.stringify({ slug })
            let res = await API.post("cart/item/delete/",body)
            removeNotification("Item Deleted")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    createIntent: async(token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            let res = await API.post("payment/")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    paymentSucess: async(token,payment_intent)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            const body = JSON.stringify({ payment_intent })
            let res = await API.post("payment/success/",body)
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    requestRefund: async(token,refund_id,reason,email)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            const body = JSON.stringify({ refund_id,reason,email })
            let res = await API.post("payment/refund/",body)
            toast.success("Refund Asked")
            return res.data.success ? true : false; 
        }catch(err){console.log(err);throw err;}
    },
    buyNow:async(token,slug)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`;
        try{
            const body = JSON.stringify({ slug })
            let res = await API.post("cart/buynow/",body)
            return res.data.success ? true : false; 
        }catch(err){console.log(err);throw err;}
    }
}

export default OrderService