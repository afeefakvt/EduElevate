import { axiosInstance } from "./axiosInstance";

export const addCourse =async(formData:FormData)=>{
    try {
        // console.log("courseee");        

        const response = await axiosInstance.post('tutor/addCourse',formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        // console.log("ress gottt",response)
        return response.data;

    } catch (error) {
        console.error("Error adding course:", error);
        throw error;
        
    }
}

export const getCategories = async()=>{
    try {
        const response = await axiosInstance.get('/categories');
        return response.data.categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
        
    }
}