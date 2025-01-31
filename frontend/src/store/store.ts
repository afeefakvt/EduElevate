import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import tutorAuthReducer from './tutorAuthSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer,persistStore } from "redux-persist";
import otpReducer from './otpSlice'

const persistConfig = {
    key:'root',
    storage
}

const persistedAuthReducer = persistReducer(persistConfig,authReducer);
const persistedTutorAuthReducer = persistReducer(persistConfig,tutorAuthReducer)
const persistedOtpReducer = persistReducer(persistConfig,otpReducer)

export const store = configureStore({
    reducer:{
        auth:persistedAuthReducer,
        tutorAuth:persistedTutorAuthReducer,
        otp:persistedOtpReducer
    }
})
export const persistor = persistStore(store)

export type RootState  = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;