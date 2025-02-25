import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import tutorAuthReducer from './tutorAuthSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer,persistStore } from "redux-persist";

const persistConfig = {
    key:'auth',
    storage
    
}
const tutorAuthPersistConfig = {
    key: 'tutorAuth',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig,authReducer);
const persistedTutorAuthReducer = persistReducer(tutorAuthPersistConfig,tutorAuthReducer)

export const store = configureStore({
    reducer:{
        auth:persistedAuthReducer,
        tutorAuth:persistedTutorAuthReducer,
    }
})
export const persistor = persistStore(store)

export type RootState  = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;