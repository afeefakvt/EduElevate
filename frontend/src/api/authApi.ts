import { AxiosError } from "axios";
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
            const errResponse = error.response?.data;
            if (errResponse?.errors) {
                const validationErrors = errResponse.errors.map((err: any) => err.msg).join(", ");
                throw new Error(validationErrors);
            }
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
export const resendOtp = async (email:string):Promise<void>=>{
    const response = await axiosInstance.post('/resendOtp', { email });
    return response.data;
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


export const loginAdmin =  async(email:string,password:string)=>{
    try {
        const response =  await axiosInstance.post('/admin/login',{email,password})

        console.log(response.data,"resssssssssssssss");
        
        const {token} = response.data
        if(token){
            store.dispatch(loginSuccess({
                token,
                student:response.data.student
            }))
            console.log('studenttttt', response.data?.student);
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

export const getStudents = async()=>{
    try {
        const response = await axiosInstance.get('/admin/students')

        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message); 
        
    }
}
