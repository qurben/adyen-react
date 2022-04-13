import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import paymentReducer from "./paymentSlice";

const store = configureStore({
  reducer: {
    payment: paymentReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
