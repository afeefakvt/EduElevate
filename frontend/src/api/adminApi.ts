import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";
import {store} from '../store/store'
import { loginSuccess } from "../store/authSlice";
import { handleAxiosError } from "@/utils/errorHandler";


export const loginAdmin =  async(email:string,password:string)=>{
    try {
        const response =  await axiosInstance.post('/admin/login',{email,password})
        
        const {token} = response.data
        if(token){
            if(response.data?.student?.role==="admin"){
                store.dispatch(loginSuccess({
                    token,
                    student:response.data.student,
                    isAuthenticated:true
                }))
                Cookies.set('authToken', token, {expires: 30/1440})

            }else{
                console.log("this is not admin");    
            }  
        } else{
            console.log(' not logged in ');

        }
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)  
        
    }
}

export const logoutAdmin = async()=>{
    try {
        const response = await axiosInstance.post('/admin/logout')
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error); 
        
    }
}

export const getStudents = async()=>{
    try {
        const response = await axiosInstance.get('/admin/students')

        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const studentBlockUnblock = async(studentId:string,isCurrentlyBlocked:boolean)=>{
    try {
        const response = await axiosInstance.patch(`/admin/students/${studentId}/update`,{
            isBlocked:!isCurrentlyBlocked
        })

        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
    }
}

export const getTutors = async()=>{
    try {
        const response = await axiosInstance.get('/admin/tutors')

        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const tutorBlockUnblock = async(tutorId:string,isCurrentlyBlocked:boolean)=>{
    try {
        const response = await axiosInstance.patch(`/admin/tutors/${tutorId}/update`,{
            isBlocked:!isCurrentlyBlocked
        })

        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
    }
}

export const getTutorDetails = async(tutorId:string)=>{
    try {
        const response = await axiosInstance.get(`/admin/tutors/${tutorId}`)
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
    }
}

export const approveTutor = async(tutorId:string)=>{
    try {
        await axiosInstance.patch(`/admin/tutors/${tutorId}/approve`)
        return {status:"approved"}          
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
    }
}
export const rejectTutor = async(tutorId:string)=>{
    try {
        await axiosInstance.patch(`/admin/tutors/${tutorId}/reject`)
        return {status:"rejected"}
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}


export const getCourseApplications = async()=>{
    try {
        const response  = await axiosInstance.get('/admin/courseApplications')
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
        
    }
}

export const getCourseDetails = async (courseId:string)=>{
    try {
        const response = await axiosInstance.get(`/admin/courseApplications/${courseId}`)
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const approveCourse = async(courseId:string)=>{
    try {
        await axiosInstance.patch(`/admin/courseApplications/${courseId}/approve`)
        return {status:"approved"}
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const rejectCourse = async(courseId:string,rejectReason:string)=>{
    try {
        const  response =await axiosInstance.patch(`/admin/courseApplications/${courseId}/reject`,{rejectReason});
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

// export const getCourses = async()=>{
//     try {
//        const response =  await axiosInstance.get('/admin/courses')
//        return response.data
//     } catch (error) {
//         console.log("error is", error);
//         throw handleAxiosError(error)
//     }
// }

export const fetchDashboardCounts = async()=>{
    try {
        const response = await axiosInstance.get('/dashboardCount')
        return  response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const fetchMostRatedCourse = async()=>{
    try {        
        const response = await axiosInstance.get('/mostRated');
        
        return response.data
    } catch (error) {
        console.log("error is", error);
        throw handleAxiosError(error)
        
    }
}

export const featuredCourses = async()=>{
    try {        
        const response = await axiosInstance.get('/featured')
        return response.data 
        
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
    }
}

export const fetchCourseStatusCounts = async()=>{
    try {
        const response = await axiosInstance.get('/courses/status')
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
        
    }
}

export const fetchTotalRevenue = async()=>{
    try {        
        const response = await axiosInstance.get('/enrollments/revenue')
        return response.data
    } catch (error) {
        console.log('error is', error);
        throw handleAxiosError(error);
        
    }
}

