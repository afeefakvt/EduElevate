import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";


export const editProfile = async(studentId:string,name: string )=>{
    try {
        console.log("dgvsjsa");
        
        const response = await axiosInstance.put(`/editProfile/${studentId}`,{name})
        console.log("reposnseee",response);
        
        return response.data
        
    } catch (error) {
            console.log('error is', error);
            throw handleAxiosError(error)
        }
        
    }

    export const changePassword = async(studentId:string,currentPassword:string,newPassword:string) =>{
        try {
            const response= await axiosInstance.put(`/updatePassword/${studentId}`,{currentPassword,newPassword});
            return response.data
        } catch (error:any) {
            console.error('Error changing password:', error.response?.data?.message);
            throw new Error(error.response?.data?.message || 'Failed to change password');
            
        }
    }
    