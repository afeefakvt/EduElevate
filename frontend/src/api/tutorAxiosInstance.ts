import axios from "axios";
import Cookies from "js-cookie";
import {store} from '../store/store'
import { tutorLoginSuccess,tutorLogout } from "@/store/tutorAuthSlice";


export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials:true

})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = Cookies.get('tutorAuthToken')
        if(token){
            config.headers['Authorization'] =`Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        if(error.response && error.response.status===401){
            store.dispatch(tutorLogout())
            Cookies.remove("tutorAuthToken")
            return;
        }
        else if(error.response && error.response.status===403){
            console.log("awaiting to refresh access token");

            if(error.config._retry){
                console.error("Token rfersh failed again .Logging out...");
                store.dispatch(tutorLogout());
                Cookies.remove("tutorAuthToken")
                window.location.href='/tutor/login';
                return Promise.reject(error)
                
            }
            error.config._retry = true;

            try {
                const refreshResponse = await axiosInstance.post('/tutor/refreshToken');
                if(!refreshResponse?.data?.token){
                    throw new Error("No new access token recieved")
                }

                console.log("new access token recieved",refreshResponse.data);

                store.dispatch(tutorLoginSuccess({
                    token:refreshResponse.data.token,
                    tutor:store.getState().tutorAuth.tutor,
                    isAuthenticated:true
                }))
                error.config.headers[
                    "Authorization"
                ]= `Bearer ${refreshResponse.data.token}`
                return axiosInstance(error.config)
                
            } catch (error) {
                console.error("Refresh token invalid or expired", error);
                store.dispatch(tutorLogout());
                Cookies.remove("tutorAuthToken");
                return Promise.reject(error);
                
            }


        }
        return Promise.reject(error);

    }
)