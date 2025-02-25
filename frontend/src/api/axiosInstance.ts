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
        // console.log('Student token:', token) // Check if the token exists

        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        // console.log('Request headers:', config.headers) // Log the full headers

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
    
);

axiosInstance.interceptors.response.use(
    (response) => {
      return response; 
    },
  
    async (error) => {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
  
        if (status === 401) {
          store.dispatch(logout());
          Cookies.remove("authToken");
          window.location.href = "/login";
          return Promise.reject(error); // Ensure flow stops here
        }
  
        if (status === 403) {
          if (message === "User is blocked") {
            console.error("User is blocked.");
            store.dispatch(logout());
            Cookies.remove("authToken");
            alert("Your account has been blocked. Please contact support.");
            window.location.href = "/login";
            return Promise.reject(error); // EXIT immediately, no token refresh
          }
  
          if (!error.config._retry) {
            error.config._retry = true;
  
            try {
              console.log("403 error — Trying to refresh token...");
  
              const refreshResponse = await axiosInstance.post('/refreshToken');
              if (!refreshResponse?.data?.token) {
                throw new Error("No new access token received");
              }
  
              console.log("New access token received:", refreshResponse.data.token);
  
              store.dispatch(loginSuccess({
                token: refreshResponse.data.token,
                student: store.getState().auth.student,
                isAuthenticated: true
              }));
  
              // Retry the original request with new token
              error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
              return axiosInstance(error.config);
            } catch (refreshError) {
              console.error("Refresh token invalid or expired", refreshError);
              store.dispatch(logout());
              Cookies.remove("authToken");
              window.location.href = "/login";
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
//         // console.log("✅ Response received:", response);
//         return response
//     },

//     async(error)=>{
//         // console.log(" Error caught by interceptor:", error); 
//         // console.log("Error status:", error.response?.status);


//         if(error.response && error.response.status===401){
//             store.dispatch(logout())
//             Cookies.remove("authToken")
//             return;
//         }

//          if(error.response && error.response.status===403){


//             if (error.response.data.message === "User is blocked") {
//                 console.error("User is blocked.");
//                 store.dispatch(logout());
//                 Cookies.remove("authToken");
//                 alert("Your account has been blocked. Please contact support.");
//                 window.location.href = '/login';
//                 return Promise.reject(error);
//               }
//             console.log("403 error — Trying to refresh token...");

//             if(error.config._retry){
//                 console.error("Token refresh failed again .Logging out...");
//                 store.dispatch(logout());
//                 Cookies.remove("authToken")
//                 window.location.href='/login';
//                 return Promise.reject(error)
                
//             }
//             error.config._retry = true;
            
//             try {
//                 console.log("Sending request to /refreshToken");

//                 const refreshResponse = await axiosInstance.post('/refreshToken');
//                 if(!refreshResponse?.data?.token){
//                     throw new Error("No new access token recieved")
//                 }

//                 console.log("new access token recieved",refreshResponse.data);

//                 store.dispatch(loginSuccess({
//                     token:refreshResponse.data.token,
//                     student:store.getState().auth.student,
//                     isAuthenticated:true
//                 }))
//                 error.config.headers[
//                     "Authorization"
//                 ]= `Bearer ${refreshResponse.data.token}`
//                 return axiosInstance(error.config)
                
//             } catch (error) {
//                 console.error("Refresh token invalid or expired", error);
//                 store.dispatch(logout());
//                 Cookies.remove("authToken");
//                 return Promise.reject(error);
                
//             }
//         }
//         return Promise.reject(error);

        
//     }
   
// )