import { axiosInstance } from "./axiosInstance"

export const resetPassword = async(token:string | undefined,newPassword:string,confirmPassword:string)=>{
    await axiosInstance.post('/tutor/resetPassword',{token,newPassword,confirmPassword})

}