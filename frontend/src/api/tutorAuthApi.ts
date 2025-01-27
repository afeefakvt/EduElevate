import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { tutorLoginSuccess } from "../store/tutorAuthSlice";


export const signUp = async(name:string,email:string,password:string,title:string,bio:string)=>{
    try {
        const repsonse = await axiosInstance.post('/tutor/register',{name,email,password,title,bio})
        return repsonse.data
    } catch (error) {
          
        if(error instanceof AxiosError){
            const errMessage = error.response?.data.message || ' something went wrong'
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message)
        
    }
}

export const verifyOtp  =  async (email:string,otp:string)=>{
    try {
        const reposne = await axiosInstance.post('/tutor/verifyOtp',{email,otp})
        return reposne.data
        
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'otp verification failed';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}

export const login = async(email:string,password:string)=>{
    try {
        const reponse = await axiosInstance.post('/tutor/login',{email,password})

        const {token}= reponse.data 
        if(token){
            store.dispatch(tutorLoginSuccess({
                token,
                tutor:reponse.data.tutor
            }))
            Cookies.set('authtoken',token,{expires:1/24})

        }
        return reponse.data

    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message); 
        
    }
}