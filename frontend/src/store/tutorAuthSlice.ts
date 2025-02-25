import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


interface Tutor {
    _id:string,
    name:string,
    email:string,
    password:string,
    title:string,
    bio:string,
    role:string
}

interface AuthState {
    token:string | null,
    tutor:Tutor | null,
    isAuthenticated:boolean
}

const initialState: AuthState= {
    token:Cookies.get('tutorAuthToken') || null,
    tutor:null,
    isAuthenticated:false
}

const tutorAuthSlice = createSlice({
    name:'tutorAuth',
    initialState,
    reducers:{
        tutorLoginSuccess:(state,action:PayloadAction<{token:string,tutor:Tutor | null, isAuthenticated:boolean}>)=>{
            state.token = action.payload.token,
            state.tutor = action.payload.tutor,
            state.isAuthenticated = true
            Cookies.set('tutorAuthToken',action.payload.token,{expires:2/1440})
        },
        tutorLogout:(state)=>{
            state.token = null
            state.tutor = null
            state.isAuthenticated =false
            Cookies.remove('tutorAuthToken')
        }
    }

})
export const{tutorLoginSuccess,tutorLogout} = tutorAuthSlice.actions;
export default tutorAuthSlice.reducer