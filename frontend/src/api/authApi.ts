import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { loginSuccess } from "../store/authSlice";
import { handleAxiosError } from "@/utils/errorHandler";

export const signUp = async(name:string,email:string,password:string,confirmPassword:string)=>{
    try {
        const response =await axiosInstance.post('/register',{name,email,password,confirmPassword})
        return response.data

    } catch (error) {
        throw handleAxiosError(error);

    }
}

export const verifyOtp = async(email:string,otp:string)=>{
    try {
        const response = await axiosInstance.post('/verifyOtp',{email,otp})
        return response.data
    } catch (error) {
        throw handleAxiosError(error);
   
    }
}
export const resendOtp = async (email:string):Promise<void>=>{
    const response = await axiosInstance.post('/resendOtp', { email });
    return response.data;
}

export const login =  async(email:string,password:string)=>{
    try {
        const response =  await axiosInstance.post('/login',{email,password})
        
        const {token} = response.data
        
        if(token){
            store.dispatch(loginSuccess({
                token,
                student:response.data.student,
                isAuthenticated:true
            }))
            Cookies.set('authToken', token, {expires: 15/1440})
        } else{
            console.log(' not logged in ');

        }
        return response.data
    } catch (error) {
        throw handleAxiosError(error);        
    }
}



export const googleSignIn = async(idToken:string)=>{
        const response = await fetch('http://localhost:3000/auth/google',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({idToken}),
        });
        if(!response.ok){
            throw new Error("google sign-in failed")
        }
        const data = await response.json();
        const {token,student} = data;
        Cookies.set('authToken',token,{expires:1/24})
        store.dispatch(loginSuccess({token,student,isAuthenticated:true}))

        return data;
}


export const resetPassword = async(token:string | undefined,newPassword:string,confirmPassword:string)=>{
    await axiosInstance.post('/resetPassword',{token,newPassword,confirmPassword})

}

export const getCategories = async()=>{
    try {
        const response = await axiosInstance.get('/categories')
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error);   
    }
}


export const logoutStudent = async()=>{
    try {
        const response = await axiosInstance.post('/logout')

        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error);  
        
    }
}