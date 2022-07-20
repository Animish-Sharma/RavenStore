import { createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast'
const initialState = []

export const alertSlice = createSlice({
    name:"alert",
    initialState,
    reducers:{
        setAlert:(state,action)=>{
            let data = action.payload
            let message = data.message
            let type = data.type
            let toastId;

            switch(type){
                case "success":
                    toastId = toast.success(message.toString(),{
                        "duration":5000
                    })
                    break;
                case "error":
                    toastId = toast.error(message.toString())
                    break;
                case "message":
                    toastId = toast(message.toString())
                    break;
                default:
                    toastId = toast(message.toString())
            }
            state.push(alert)
            setTimeout(() => {
                toast.dismiss(toastId)
            }, 5000);
        }
    }
})

export const { setAlert } = alertSlice.actions 
export default alertSlice.reducer