import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface Student {
    _id?:string 
    id:string,
    name:string,
    email:string,
    password:string,
    role:string
}

interface AuthState {
    token: string | null
    student:Student | null
    isAuthenticated:boolean
}

const initialState :AuthState = {
    token : Cookies.get('authToken') || null,
    student:null ,
    isAuthenticated:false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<{token:string; student:Student | null; isAuthenticated: boolean}>)=>{
            state.token = action.payload.token
            state.student = action.payload.student
            state.isAuthenticated =true
            Cookies.set('authToken',action.payload.token,{expires:30/1440})
        },
        logout:(state)=>{
            state.token = null
            state.student = null
            state.isAuthenticated = false
            Cookies.remove('authToken')
        }
    }

})

export const{loginSuccess,logout} = authSlice.actions
export default authSlice.reducer