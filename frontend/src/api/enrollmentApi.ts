import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";


export const fetchEnrolledCourses = async()=>{
    try {
        const response = await axiosInstance.get('/enrollment/myCourses',{
            withCredentials:true
        })
        return response.data

    } catch (error) {
        console.log("error is ",error)
        throw handleAxiosError(error)
        
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