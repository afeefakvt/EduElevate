import { Request,Response } from "express";
import { ICourseService } from "../interfaces/course/ICourseService";



export class CourseController{
    constructor(
        private courseService:ICourseService
    ){}

    async addCourse(req:Request,res:Response):Promise<void>{
        try {
            const courseData = req.body;
            if(req.file){
                courseData.thumbnail = req.file.path
            }

            const newCourse = await this.courseService.addCourse(courseData,req.file)
            res.status(201).json({newCourse,message:"new course created successfully"})
        } catch (error) {
            
        }
    }
    

}