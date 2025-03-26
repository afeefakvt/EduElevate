import { axiosInstance } from "./tutorAxiosInstance";
import { handleAxiosError } from "../utils/errorHandler";

export const addLecture = async(courseId:string,formData:FormData)=>{
    try {
        // console.log("addddddddddd");       
        const response = await axiosInstance.post(`/tutor/addLecture/${courseId}`,formData);
        // console.log("responseeeeeeeee got");
        
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)

        
    }
}

export const getLecturesByCourse = async(courseId:string)=>{
    try {
        const repsonse = await axiosInstance.get(`/tutor/${courseId}/lectures`);
        return repsonse.data
        } catch (error) {
            console.log('error is', error);
            throw handleAxiosError(error)
    
        
    }
}

export const updateLecture = async(lectureId:string,updatedData:object)=>{
    try {        
        const response = await axiosInstance.put(`/tutor/editLecture/${lectureId}`,updatedData)
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}

