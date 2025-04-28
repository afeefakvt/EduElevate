import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { RequestWithUser } from "../middlewares/authToken";
import { MESSAGES } from "../constants/message";


export class EnrollmentController {
    constructor(
        private enrollmentService: IEnrollmentService
    ) { }


    async getEnrolledCoursesByStudent(req: RequestWithUser, res: Response): Promise<void> {
        try {            
            if (!req.student || !req.student._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED_STUDENT });
                return;
            }
            
            const enrolledCourses = await this.enrollmentService.getEnrolledCoursesByStudent(req.student._id.toString());
            if (!enrolledCourses || enrolledCourses.length === 0) {
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.NO_COURSES_ENROLLED})
            }
            res.status(HTTP_STATUS.OK).json(enrolledCourses);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message:  MESSAGES.INTERNAL_SERVER_ERROR, error: (error as Error).message, });
        }
    }

    async getTotalEnrolledCount(req: RequestWithUser, res: Response): Promise<void> {
        try {
            if (!req.tutor || !req.tutor._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED_TUTOR });
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
            if (!req.tutor || !req.tutor._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED_TUTOR});
                return;
            }
            const tutorId = req.tutor._id.toString()
            const enrolledStudents = await this.enrollmentService.getEnrolledStudents(tutorId)
            if(!enrolledStudents || enrolledStudents.length===0){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.NO_ENROLLED_STUDENTS})
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
            
            res.status(HTTP_STATUS.OK).json(reportData)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
            
        }
    }

    async getTotalRevenue(req:Request,res:Response){
        try {
            const total = await this.enrollmentService.getTotalRevenue()
            if(!total){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.TOTAL_REVENUE_NOT_FOUND})
                return
            }            
            res.status(HTTP_STATUS.OK).json(total)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });            
        }
    }


}
