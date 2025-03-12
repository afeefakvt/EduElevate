import axios from "axios";
import Cookies from "js-cookie";
import {store} from '../store/store'
import { tutorLoginSuccess,tutorLogout } from "@/store/tutorAuthSlice";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials:true

})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = Cookies.get('tutorAuthToken')
        // console.log('tutor token:', token) 

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
    (response) => {
      return response; 
    },
  
    async (error) => {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
  
        if (status === 401) {
          store.dispatch(tutorLogout());
          Cookies.remove("tutorAuthToken");
          window.location.href = "/login";
          return Promise.reject(error); // Ensure flow stops here
        }
  
        if (status === 403) {
          if (message === "User is blocked") {
            console.error("Tutor is blocked.");
            alert("Your account has been blocked. Please contact for support.");
            store.dispatch(tutorLogout());
            Cookies.remove("tutorAuthToken");

            // toast.error("Your account has been blocked. Redirecting to login...", {
            //   position: "top-center",
            //   autoClose: 3000, 
            //   onClose: () => {
               
            //   }
            // });
            
            return Promise.reject(error); // EXIT immediately, no token refresh
          }
  
          if (!error.config._retry) {
            error.config._retry = true;
  
            try {
              console.log("403 error — Trying to refresh token...");
  
              const refreshResponse = await axiosInstance.post('/tutor/refreshToken');
              if (!refreshResponse?.data?.token) {
                throw new Error("No new access token received");
              }
  
              console.log("New access token received:", refreshResponse.data.token);
  
              store.dispatch(tutorLoginSuccess({
                token: refreshResponse.data.token,
                tutor: store.getState().tutorAuth.tutor,
                isAuthenticated: true
              }));
  
              // Retry the original request with new token
              error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
              return axiosInstance(error.config);
            } catch (refreshError) {
              console.error("Refresh token invalid or expired", refreshError);
              store.dispatch(tutorLogout());
              Cookies.remove("tutorAuthToken");
              window.location.href = "/tutor/login";
              return Promise.reject(refreshError);
            }
          }
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  

// axiosInstance.interceptors.response.use(
//     (response)=>{
//         return response
//     },
//     async(error)=>{
//         if(error.response && error.response.status===401){
//             store.dispatch(tutorLogout())
//             Cookies.remove("tutorAuthToken")
//             return;
//         }
//         else if(error.response && error.response.status===403){
//             console.log("awaiting to refresh access token");

//             if(error.config._retry){
//                 console.error("Token rfersh failed again .Logging out...");
//                 store.dispatch(tutorLogout());
//                 Cookies.remove("tutorAuthToken")
//                 window.location.href='/tutor/login';
//                 return Promise.reject(error)
                
//             }
//             error.config._retry = true;

//             try {
//                 const refreshResponse = await axiosInstance.post('/tutor/refreshToken');
//                 if(!refreshResponse?.data?.token){
//                     throw new Error("No new access token recieved")
//                 }

//                 console.log("new access token recieved",refreshResponse.data);

//                 store.dispatch(tutorLoginSuccess({
//                     token:refreshResponse.data.token,
//                     tutor:store.getState().tutorAuth.tutor,
//                     isAuthenticated:true
//                 }))
//                 error.config.headers[
//                     "Authorization"
//                 ]= `Bearer ${refreshResponse.data.token}`
//                 return axiosInstance(error.config)
                
//             } catch (error) {
//                 console.error("Refresh token invalid or expired", error);
//                 store.dispatch(tutorLogout());
//                 Cookies.remove("tutorAuthToken");
//                 return Promise.reject(error);
                
//             }


//         }
//         return Promise.reject(error);

//     }
// )