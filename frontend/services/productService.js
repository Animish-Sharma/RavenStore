import toast from "react-hot-toast";
import API from "./api";

const removeNotification = (txt) =>{
    toast.success(txt,{icon:"🚮",style:{background:"#f94144",color:"#fff",fontWeight:"900"}})
}

const ProductService = {
    fetchProductPaths:async ()=>{
        try{
            const res = await API.get("products/")
            const paths = res.data.results.map((product)=>({
                params: {slug : product.slug}
            }))
            return paths
        }catch(err){
            console.log(err);
            throw err;
        }
    },
    searchProduct:async (field)=>{
        try{
            const body = JSON.stringify({field})
            const res = await API.post(`search/`,body)
            return res.data
        }catch(err){throw err;}
    },
    fetchProduct:async (slug)=>{
        try{
            const res = await API.get(`product/${slug}/`)
            const response = await API.get(`reviews/${slug}/`)
            return { product:res.data,reviews:response.data }
        }catch(err){throw err;}
    },
    getCategoryProduct: async (category)=>{
        try{
            const body = JSON.stringify({ category })
            const res = await API.post('category/',body)
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    createReview: async (token,title,description,rating,slug)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ title,description,rating,slug })
            const res = await API.post('reviews/create/',body)
            toast.success("Review added Successfully")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    editReview: async (token,title,description,rating,slug)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ title,description,rating,slug })
            const res = await API.post('reviews/edit/',body)
            toast.success("Review updated Successfully")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    likeReview: async (review_id,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ id:review_id })
            const res = await API.post('reviews/liked/',body)
            toast("Review Liked",{icon:"👍"})
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    disLikeReview: async (review_id,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ id:review_id })
            const res = await API.post('reviews/disliked/',body)
            toast("Review Disliked",{icon:"👎"})
            return res.data
        }catch(err){console.log(err);throw err;}
    },
    deleteReview: async (review_id,token)=>{
        API.defaults.headers["Authorization"] = `Bearer ${token}`
        try{
            const body = JSON.stringify({ review_id })
            const res = await API.post('reviews/delete/',body)
            removeNotification("Review Deleted")
            return res.data
        }catch(err){console.log(err);throw err;}
    },
}

export default ProductService