import { axiosInstance } from "./axiosInstance";


interface CourseData {
    title: string;
    categoryId: string;
    description: string;
    price: string;
    language: string;
    duration: string;
    level: string;
    date: string;
    thumbnail: File | null;
  }

export const addCourse =async(courseData:CourseData)=>{
    try {
        const formData = new FormData();

        for(const key in courseData){
            if(courseData[key as keyof CourseData]){
                formData.append(key, courseData[key as keyof CourseData ] as string);
            } 
        }
        if(courseData.thumbnail){
            formData.append("thumbnail",courseData.thumbnail);
        }

        const response = await axiosInstance.post('tutor/addCourse',formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
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