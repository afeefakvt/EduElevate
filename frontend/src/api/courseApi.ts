import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";



export const getCategories = async()=>{
    try {
        console.log("vjhvuj");
        
        const response = await axiosInstance.get('/categories');
        console.log(response.data.categories,"mgujfhvhgnvhg ");
        
        return response.data.categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw handleAxiosError(error);   
        
    }
}
export const getCourses = async()=>{
    try {
        const response = await axiosInstance.get('/courses')
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
        console.log("pppppppppppppppppppppp");
        
        const response = await axiosInstance.get('/bestSelling')
        return response.data 
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
    }
}


