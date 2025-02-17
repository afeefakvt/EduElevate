import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";

export const addCourse =async(formData:FormData)=>{
    try {
        // console.log("courseee");        

        const response = await axiosInstance.post('tutor/addCourse',formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        // console.log("ress gottt",response)
        return response.data;

    } catch (error) {
        console.error("Error adding course:", error);
        throw handleAxiosError(error);   
        
    }
}

export const getCategories = async()=>{
    try {
        const response = await axiosInstance.get('/categories');
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
export const listUnlistCourse = async(courseId:string,isCurrentlyListed:Boolean)=>{
    try {
        console.log("delete courseee");
        
        const response = await axiosInstance.patch(`/courses/deleteCourse/${courseId}`,{isListed:!isCurrentlyListed});
        return response.data
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}

export const editCourse = async(courseId:string,formData:FormData)=>{
    try {
        const response = await axiosInstance.put(`/tutor/editCourse/${courseId}`,formData);
        return response.data.course
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}