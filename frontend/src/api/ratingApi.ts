import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";

export const addRatings = async(courseId: string | undefined, rating: number | null, review: string)=>{
    try {
        const response = await axiosInstance.post("/rating/addRating",{courseId,rating,review});
        return response.data
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}

export const getCourseRatings  = async(courseId:string)=>{
    try {
        const response = await axiosInstance.get(`/rating/${courseId}`)
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
    }
}

export const getAverageCourseRatings = async(courseId:string)=>{
    try {
        const reponse = await axiosInstance.get(`/rating/${courseId}/average`)
        return reponse.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}