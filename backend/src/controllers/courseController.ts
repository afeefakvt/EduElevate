import { Request,Response } from "express";
import { ICourseService } from "../interfaces/course/ICourseService";
import { HTTP_STATUS } from "../constants/httpStatusCode";



interface CourseQuery {
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    limit?: string;
}

export class CourseController{
    constructor(
        private courseService:ICourseService
    ){}

    async addCourse(req:Request,res:Response):Promise<void>{
        try {            
            // console.log(" Request Received:", req.body);
            // console.log(" Uploaded File:", req.file);
            const courseData = req.body;
            if(req.file){
                courseData.thumbnail = req.file.path
            }

            const newCourse = await this.courseService.addCourse(courseData,req.file)
            // console.log(" Course Saved:", newCourse);

            res.status(201).json({newCourse,message:" course added successfully"})
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ error: (error as Error).message });
        }
    }
    async getCourses(req:Request,res:Response):Promise<void>{
        try {
            // console.log(req.url);
            const{search='',category="all",sort="default",page=1,limit=4} = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const {courses,total} = await this.courseService.getCourses(search as string,category as string,sort as string,pageNumber,limitNumber)
            res.status(HTTP_STATUS.OK).json({success:true,courses,total})
        } catch (error) {
            console.error('error')
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"internal server error",error:error instanceof Error ? error.message : error,})

            
        }
    }
    async getCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params
            const course = await this.courseService.getCourseDetails(courseId)
            if(course){
                res.status(HTTP_STATUS.OK).json({success:true,course:course})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({sucess:false,message:"no course found"})

            }
        } catch (error:any) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: error.message });     

            
        }
    }

    async listUnlistCourse(req:Request,res:Response):Promise<void>{
        try {
            // console.log("delte courseasc");
            
            const {courseId} = req.params;
            const {isListed} = req.body
            const deletedCourse = await this.courseService.listUnlistCourse(courseId,{isListed})

            if (!deletedCourse) {
                 res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Course not found" });
                 return;
              }

              res.status(HTTP_STATUS.OK).json({ deletedCourse });
          
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
    
    async editCourse (req:Request,res:Response):Promise<void>{
        try {
            const {courseId} =req.params;
            const updatedData = req.body;

            if(req.file){
                updatedData.thumbnail = req.file.path
            }

            const updatedCourse = await this.courseService.editCourse(courseId,updatedData,req.file);
            res.status(HTTP_STATUS.OK).json({message:"Edit course details submitted successfully for admin review",course:updatedCourse})
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            
        }
    }

    async bestSellingCourses(req:Request,res:Response):Promise<void>{
        try {
            // console.log("cvas djchmndcdscas");
            
            const courses = await this.courseService.getBestSellingCourses()
            res.status(HTTP_STATUS.OK).json({courses:courses})
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch bestselling courses" });
            
        }

    }
    async fetchStatusCounts(req:Request,res:Response):Promise<void>{
        try {
            const result  = await this.courseService.fetchStatusCounts()
            console.log(result,"resss");
            
            res.status(HTTP_STATUS.OK).json({result})

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch bestselling courses" });

            
        }
    }

}