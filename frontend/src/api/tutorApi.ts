import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { tutorLoginSuccess } from "../store/tutorAuthSlice";
import { handleAxiosError } from "@/utils/errorHandler";


export const signUp = async(name:string,email:string,password:string,confirmPassword:string,title:string,bio:string)=>{
    try {
        const repsonse = await axiosInstance.post('/tutor/register',{name,email,password,confirmPassword,title,bio})
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
        const {token}= response.data 
        if(token){
            store.dispatch(tutorLoginSuccess({
                token,
                tutor:response.data.tutor
            }))
            // console.log('tutorrrr', response.data?.tutor);
            Cookies.set('tutorAuthtoken',token,{expires:1/24})

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

export const resetPassword = async(token:string | undefined,newPassword:string,confirmPassword:string)=>{
    await axiosInstance.post('/tutor/resetPassword',{token,newPassword,confirmPassword})

}

export const fetchTutorCourses = async()=>{
    try {
        const response = await axiosInstance.get('/tutor/myCourses')
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}
export const getTutorCourseDetails = async(courseId:string)=>{
    try {
        const response = await axiosInstance.get(`/tutor/myCourses/${courseId}`)
        console.log("API Response:", response.data);
        return response.data
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)   
    }
}

export const deleteTutorCourse = async(courseId:string)=>{
    try {
        console.log("delete courseee");
        
        const response = await axiosInstance.delete(`/courses/deleteCourse/${courseId}`);
        return response.data;
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}