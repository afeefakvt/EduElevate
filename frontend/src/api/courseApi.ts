import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";



export const getCategories = async()=>{
    try {
        const response = await axiosInstance.get('/categories');  
        console.log(response.data);
              
        return response.data.categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw handleAxiosError(error);   
        
    }
}
export const getCourses = async(queryParams:string)=>{
    try {
        const response = await axiosInstance.get(`/courses/?${queryParams}`)
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error);   
    }
}

export const getCourseDetails = async(courseId:string)=>{
    try {
        const response = await axiosInstance.get(`/courses/${courseId}`)
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error); 
        
    }
}
export const bestSellingCourses = async()=>{
    try {
        
        const response = await axiosInstance.get('/bestSelling')
        return response.data 
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
    }
}


