import { Request,Response } from "express";
import { ICourseService } from "../interfaces/course/ICourseService";
import { log } from "console";



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
    

}