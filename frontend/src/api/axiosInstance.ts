import axios from 'axios'
import cookies from 'js-cookie'

export const axiosInstance = axios.create({
    baseURL:"http://localhost:3000/",
    headers:{
        'Content-Type':'application/json'
    }

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