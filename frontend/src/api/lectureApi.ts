import { axiosInstance } from "./axiosInstance";
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