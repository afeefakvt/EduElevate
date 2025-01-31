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
            const validationErrors = error.response?.data.errors; 
            if (validationErrors) {
                const errorMessage = validationErrors.map((err: any) => err.msg).join(', ');
                throw new Error(errorMessage); 
            }
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
export const resendOtp = async (email:string):Promise<void>=>{
    const response = await axiosInstance.post('/tutor/resendOtp', { email });
    return response.data;
}

export const login = async(email:string,password:string)=>{
    try {
        const response = await axiosInstance.post('/tutor/login',{email,password})
        console.log(response.data,"resssssssssssssss");

        const {token}= response.data 
        if(token){
            store.dispatch(tutorLoginSuccess({
                token,
                tutor:response.data.tutor
            }))
            console.log('tutorrrr', response.data?.tutor);
            Cookies.set('authtoken',token,{expires:1/24})

        }else{
            console.log('not logged in');
            
        }
        return response.data

    } catch (error) {
        if( error instanceof AxiosError){
            const validationErrors = error.response?.data.errors; // Extract validation errors
            if (validationErrors) {
                const errorMessage = validationErrors.map((err: any) => err.msg).join(', ');
                throw new Error(errorMessage); // Join all validation messages into a single string
            }
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message); 
        
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
    const {token,tutor} = data;
    Cookies.set('authToken',token,{expires:7})
    store.dispatch(tutorLoginSuccess({token,tutor}))

    return data;
}