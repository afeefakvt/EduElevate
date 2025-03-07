import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";


export const getStudentMessages = async(senderId:string,recipientId:string)=>{
    try {
        const response = await axiosInstance.get(`/messages/${senderId}/${recipientId}`)
        return response.data;
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }

}
export const uploadStudentMessageFile = async(formData:FormData,fileType:"image"| "video")=>{
    try {
        const endPoint = fileType==="image"? "/uploadImage" :"/uploadVideo"
        const response = await axiosInstance.post(endPoint,formData)
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}