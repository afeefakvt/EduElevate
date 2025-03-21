import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { RequestWithUser } from "../middlewares/authToken";
import { MESSAGES } from "../constants/message";


export class EnrollmentController {
    constructor(
        private enrollmentService: IEnrollmentService
    ) { }


    async getEnrolledCoursesByStudent(req: RequestWithUser, res: Response): Promise<void> {
        try {            
            // console.log(req.url);

            if (!req.student || !req.student._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied. Not a student." });
                return;
            }

            // const id =req.student?.id
            // if(!student.id){
            //     res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Student ID is required"});
            //     return;
            // }
            
            const enrolledCourses = await this.enrollmentService.getEnrolledCoursesByStudent(req.student._id.toString());
            if (!enrolledCourses || enrolledCourses.length === 0) {
                res.status(HTTP_STATUS.NOT_FOUND).json("No courses enrolled")
            }
            res.status(HTTP_STATUS.OK).json(enrolledCourses);
        } catch (error) {
            console.log("no course")
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message:  MESSAGES.INTERNAL_SERVER_ERROR, error: (error as Error).message, });
        }
    }

    async getTotalEnrolledCount(req: RequestWithUser, res: Response): Promise<void> {
        try {
            if (!req.tutor || !req.tutor._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied. Not a tutor." });
                return;
            }
            const tutorId = req.tutor._id.toString()
            const enrollments = await this.enrollmentService.getTutorEnrollmentStats(tutorId)
            res.status(HTTP_STATUS.OK).json({ enrollments })

        } catch (error: any) {

            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });


        }
    }
    async getEnrolledCountPerCourse(req: Request, res: Response): Promise<void> {
        try {
            // console.log("count");
            
            const { courseId } = req.params;
            const count = await this.enrollmentService.getEnrolledCountPerCourse(courseId)            
            res.status(HTTP_STATUS.OK).json({ count })

        } catch (error) {
            console.error("Error fetching enrollment count:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });

        }
    }

    async getMyStudents(req:RequestWithUser,res:Response):Promise<void>{
        try {
            // console.log("llllllllllll");
            
            if (!req.tutor || !req.tutor._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied. Not a tutor." });
                return;
            }
            const tutorId = req.tutor._id.toString()
            const enrolledStudents = await this.enrollmentService.getEnrolledStudents(tutorId)
            if(!enrolledStudents || enrolledStudents.length===0){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"no enrolled students"})
            }
            res.status(HTTP_STATUS.OK).json(enrolledStudents    )
            
        
        } catch (error) {
            console.error("Error fetching students:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
        }

    }
    
    async getFeaturedCourse(req:Request,res:Response):Promise<void>{
        try {
            const courses = await this.enrollmentService.getFeaturedCourse()
            res.status(HTTP_STATUS.OK).json({courses:courses})
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.FAILED_FETCH_BESTSELLING });
            
        }

    }
    async getSalesReport(req:Request,res:Response):Promise<void>{
        try {
            const { timeRange, startDate, endDate } = req.query;
            const reportData = await this.enrollmentService.getSalesReport(timeRange as string,startDate as string,endDate as string)

            // console.log(reportData);
            
            res.status(HTTP_STATUS.OK).json(reportData)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
            
        }
    }

    async getTotalRevenue(req:Request,res:Response){
        try {
            const total = await this.enrollmentService.getTotalRevenue()
            if(!total){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Total Revenue not found"})
                return
            }            
            res.status(HTTP_STATUS.OK).json(total)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });            
        }
    }


}
