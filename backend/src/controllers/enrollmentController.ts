import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { RequestWithUser } from "../middlewares/authToken";


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
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occured.", error: (error as Error).message, });
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
            // console.log(count,"ccooooooooooooo");
            
            res.status(HTTP_STATUS.OK).json({ count })

        } catch (error) {
            console.error("Error fetching enrollment count:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

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
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            
        }

    }


}
