import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { loginSuccess } from "../store/authSlice";


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

        console.log(response.data,"resssssssssssssss");
        
        const {token} = response.data
        if(token){
            store.dispatch(loginSuccess({
                token,
                student:response.data.student
            }))
            console.log('studenttttttt', response.data?.student);
            Cookies.set('authToken', token, {expires: 1/24})
        } else{
            console.log(' not logged in ');

        }
        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);  
        
    }
}
