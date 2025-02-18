import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { Request,Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { HTTP_STATUS } from "../constants/httpStatusCode";


export class EnrollmentController {
    constructor(
        private enrollmentService:IEnrollmentService
    ){}


    async getEnrolledCoursesByStudent(req:Request,res:Response):Promise<void>{
        try {

            // console.log("requestttt for enrolllllled");
            
            const { student } = req as AuthenticatedRequest; // Type assertion here

            // const id =req.student?.id
            if(!student.id){
                res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Student ID is required"});
                return;
            }

            const enrolledCourses = await this.enrollmentService.getEnrolledCoursesByStudent(student.id);
            if(!enrolledCourses || enrolledCourses.length===0){
                res.status(HTTP_STATUS.NOT_FOUND).json("No courses enrolled")
            }

            // console.log("enroleeeeeeeeeedd",enrolledCourses)
            res.status(HTTP_STATUS.OK).json(enrolledCourses);
        } catch (error) {
            console.log("no course")
            
        res.status(500).json({message: "An unexpected error occured.", error: (error as Error).message,});
        }
    }
}
