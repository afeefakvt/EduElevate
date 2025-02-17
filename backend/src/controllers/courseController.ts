import { Request,Response } from "express";
import { ICourseService } from "../interfaces/course/ICourseService";
import mongoose from "mongoose";



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
            res.status(400).json({ error: (error as Error).message });
        }
    }
    async getCourses(req:Request,res:Response):Promise<void>{
        try {
            const courses = await this.courseService.getCourses()
            res.status(200).json({success:true,courses})
        } catch (error) {
            console.error('error')
            res.status(500).json({success:false,message:"internal server error",error:error instanceof Error ? error.message : error,})

            
        }
    }
    async getCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params
            const course = await this.courseService.getCourseDetails(courseId)
            if(course){
                res.status(200).json({success:true,course:course})
            }else{
                res.status(404).json({sucess:false,message:"no course found"})

            }
        } catch (error:any) {
            res.status(404).json({ success: false, message: error.message });     

            
        }
    }

    async listUnlistCourse(req:Request,res:Response):Promise<void>{
        try {
            console.log("delte courseasc");
            
            const {courseId} = req.params;
            const {isListed} = req.body
            const deletedCourse = await this.courseService.listUnlistCourse(courseId,{isListed})

            if (!deletedCourse) {
                 res.status(404).json({ message: "Course not found" });
                 return;
              }

              res.status(200).json({ deletedCourse });
          
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ message: "Internal server error" });
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
            res.status(200).json({message:"Edit course details submitted successfully for admin review",course:updatedCourse})
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ message: "Internal server error" });
            
        }
    }

}