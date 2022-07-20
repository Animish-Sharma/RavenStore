import { configureStore,combineReducers } from "@reduxjs/toolkit"
import  authSlice from "./reducers/auth"
import { createWrapper } from "next-redux-wrapper"
import alertSlice from "./reducers/alert";



export const store = configureStore({
  reducer: {
    auth:authSlice,
    alert:alertSlice
  }
})

const makeStore = () => store;

export const wrapper = createWrapper(makeStore)