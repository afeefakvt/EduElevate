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