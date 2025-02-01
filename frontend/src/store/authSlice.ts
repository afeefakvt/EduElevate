import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface Student {
    id:string,
    name:string,
    email:string,
    password:string,
    role:string
}

interface AuthState {
    token: string | null
    student:Student | null
}

const initialState :AuthState = {
    token : Cookies.get('authToken') || null,
    student:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<{token:string,student:Student}>)=>{
            state.token = action.payload.token
            state.student = action.payload.student
            Cookies.set('authToken',action.payload.token,{expires:7})
        },
        logout:(state)=>{
            state.token = null
            state.student = null
            Cookies.remove('authToken')
        }
    }

})

export const{loginSuccess,logout} = authSlice.actions
export default authSlice.reducer