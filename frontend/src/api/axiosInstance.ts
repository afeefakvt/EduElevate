import axios from 'axios'
import Cookies from 'js-cookie'
import { store } from "../store/store";
import { loginSuccess,logout } from '@/store/authSlice';



export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials:true

})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = Cookies.get('authToken')
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

    async(error)=>{
        if(error.response && error.response.statu===401){
            store.dispatch(logout())
            Cookies.remove("authToken")
            return;
        }
        else if(error.response && error.response.status===403){
            console.log("awaiting to refresh access token");

            if(error.config._retry){
                console.error("Token rfersh failed again .Logging out...");
                store.dispatch(logout());
                Cookies.remove("authToken")
                window.location.href='/login';
                return Promise.reject(error)
                
            }
            error.config._retry = true;
            
            try {
                const refreshResponse = await axiosInstance.post('/refreshToken');
                if(!refreshResponse?.data?.token){
                    throw new Error("No new access token recieved")
                }

                console.log("new access token recieved",refreshResponse.data);

                store.dispatch(loginSuccess({
                    token:refreshResponse.data.token,
                    student:store.getState().auth.student,
                    isAuthenticated:true
                }))
                error.config.headers[
                    "Authorization"
                ]= `Bearer ${refreshResponse.data.token}`
                return axiosInstance(error.config)
                
            } catch (error) {
                console.error("Refresh token invalid or expired", error);
                store.dispatch(logout());
                Cookies.remove("authToken");
                return Promise.reject(error);
                
            }
        }
        return Promise.reject(error);

        
    }
   
)