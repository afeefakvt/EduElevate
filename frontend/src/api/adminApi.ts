import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { loginSuccess } from "../store/authSlice";


export const loginAdmin =  async(email:string,password:string)=>{
    try {
        const response =  await axiosInstance.post('/admin/login',{email,password})

        console.log(response.data);
        
        const {token} = response.data
        if(token){
            store.dispatch(loginSuccess({
                token,
                student:response.data.student
            }))
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

export const studentBlockUnblock = async(studentId:string,isCurrentlyBlocked:boolean)=>{
    try {
        const response = await axiosInstance.patch(`/admin/students/${studentId}/update`,{
            isBlocked:!isCurrentlyBlocked
        })

        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}

export const getTutors = async()=>{
    try {
        const response = await axiosInstance.get('/admin/tutors')

        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message); 
        
    }
}

export const tutorBlockUnblock = async(tutorId:string,isCurrentlyBlocked:boolean)=>{
    try {
        const response = await axiosInstance.patch(`/admin/tutors/${tutorId}/update`,{
            isBlocked:!isCurrentlyBlocked
        })

        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}

export const getTutorDetails = async(tutorId:string)=>{
    try {
        const response = await axiosInstance.get(`/admin/tutors/${tutorId}`)
        return response.data
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}

export const approveTutor = async(tutorId:string)=>{
    try {
        await axiosInstance.patch(`/admin/tutors/${tutorId}/approve`)
        return {status:"approved"}          
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}
export const rejectTutor = async(tutorId:string)=>{
    try {
        await axiosInstance.patch(`/admin/tutors/${tutorId}/reject`)
        return {status:"rejected"}
    } catch (error) {
        if( error instanceof AxiosError){
            const errMessage = error.response?.data.message || 'something went wrong';
            throw new Error(errMessage)
            
        }
        throw new Error((error as Error).message);
        
    }
}


// export const getCategories = async()=>{
//     try {
//         const response = await axiosInstance.get('/admin/category')

//         return response.data
//     } catch (error) {
//         if( error instanceof AxiosError){
//             const errMessage = error.response?.data.message || 'something went wrong';
//             throw new Error(errMessage)
            
//         }
//         throw new Error((error as Error).message); 
        
//     }
// }

// export const listUnlistCategory = async(id:string,isListed:boolean)=>{
//     try {
//         const response = await axiosInstance.patch(`/admin/category/${id}/listUnlistCategory`, { isListed: !isListed })
//         return response.data
//     } catch (error) {
//         if( error instanceof AxiosError){
//             const errMessage = error.response?.data.message || 'something went wrong';
//             throw new Error(errMessage)
            
//         }
//         throw new Error((error as Error).message); 
        
//     }
// }