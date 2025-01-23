import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { AxiosInstance } from "axios";
import { axiosInstance } from "./axiosInstance";


export const signUp = async(name:string,email:string,password:string,confirmPassword:string)=>{
    try {
        const response =await axiosInstance.post('/register',{name,email,password,confirmPassword})
        return response.data

    } catch (error) {
        
        if(error instanceof AxiosError){
            const errMessage = error.response?.data.message || ' something went wrong'
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message)
    }
}

export const verifyOtp = async(email:string,otp:string)=>{
    try {
        const response = await axiosInstance.post('/verifyOtp',{email,otp})
        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'otp verification failed';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);   
    }
}

export const login =  async(email:string,password:string)=>{
    try {
        const response =  await axiosInstance.post('/login',{email,password})
        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);  
        
    }
}