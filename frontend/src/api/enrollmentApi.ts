import { axiosInstance } from "./axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";


export const fetchEnrolledCourses = async()=>{
    try {
        const response = await axiosInstance.get('/enrollment/myCourses/',{
            withCredentials:true
        })
        // console.log(response.data,"pppppp");
        
        return response.data

    } catch (error) {
        console.log("error is ",error)
        throw handleAxiosError(error)
        
    }
}

export const bestSellingCourses = async()=>{
    try {
        // console.log("pppppppppppppppppppppp");
        
        const response = await axiosInstance.get('/bestSelling')
        return response.data 
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
    }
}
export const getSalesReport = async(timeRange:"daily" | "monthly" | "yearly" | "custom",startDate:string,endDate:string)=>{    
    try {
        const params:any = {timeRange}
        if(timeRange==="custom"){
            params.startDate = startDate
            params.endDate = endDate
        }
        const response = await axiosInstance.get('salesReport',{
            params
        })
        return response.data.map((item:{_id:string;totalRevenue:number})=>({
            date:item._id,
            totalRevenue:item.totalRevenue
        }));
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
        
    }
}
