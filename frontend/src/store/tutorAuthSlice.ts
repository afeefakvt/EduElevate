import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


interface Tutor {
    id:string,
    name:string,
    email:string,
    password:string,
    title:string,
    bio:string
}

interface AuthState {
    token:string | null,
    tutor:Tutor | null
}

const initialState: AuthState= {
    token:Cookies.get('authToken') || null,
    tutor:null
}

const tutorAuthSlice = createSlice({
    name:'tutorAuth',
    initialState,
    reducers:{
        tutorLoginSuccess:(state,action:PayloadAction<{token:string,tutor:Tutor}>)=>{
            state.token = action.payload.token,
            state.tutor = action.payload.tutor
            Cookies.set('authToken',action.payload.token,{expires:7})
        }
    }

})
export const{tutorLoginSuccess} = tutorAuthSlice.actions;
export default tutorAuthSlice.reducer