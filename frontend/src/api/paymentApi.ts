import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";


export const getPendingPayments = async()=>{
    try {
        const response =  await axiosInstance.get('/payments/pending')
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
    }
}

export const updatePaymentStatus = async(paymentId:string)=>{
    try {
        const response = await axiosInstance.put(`payments/${paymentId}`);
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error)
        
    }
}