import axios from 'axios'
import cookies from 'js-cookie'
import { handleForbiddenError } from '@/utils/forbidden';

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials:true

})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = cookies.get('authToken')
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
    
);

axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.repsonse && error.response.status===403){
            handleForbiddenError(error)
        }
        return Promise.reject(error);
    }
)