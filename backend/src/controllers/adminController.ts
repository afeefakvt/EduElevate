import { Request,Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { sendEmail } from "../utils/mail";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { MESSAGES } from "../constants/message";


export class AdminController {
    constructor(
        private adminService:IAdminService,        
    ){}

    async getStudents(req:Request,res:Response):Promise<void>{
        try {
            const students = await this.adminService.getStudents()
            
            if (students) {
                res.status(HTTP_STATUS.OK).json({ success: true, students: students });
            } else {
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NO_STUDENTS_FOUND });
            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR, error: error instanceof Error ? error.message : error });

        }
    }

    async updateStudent(req:Request,res:Response):Promise<void>{
        const {studentId} = req.params;
        const {isBlocked} = req.body;
        
        try {
            const updatedStudent = await this.adminService.updateStudent(studentId,{isBlocked})
            if(!updatedStudent){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.STUDENT_NOT_FOUND})
                return;
            }
            res.status(HTTP_STATUS.OK).json(updatedStudent)
            return;

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR,error: error instanceof Error ? error.message : error,})
            
        }
    }

    async getTutors(req:Request,res:Response):Promise<void>{
        try {
            const tutors = await this.adminService.getTutors()
            if(tutors){
                res.status(HTTP_STATUS.OK).json({success:true,tutors:tutors})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.NO_TUTORS_FOUND });
            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR, error: error instanceof Error ? error.message : error });   
        }
    }

    async getTutorDetails(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.getTutorDetails(tutorId)
            
            if(tutor){
                res.status(HTTP_STATUS.OK).json({ success: true, tutor:tutor });
            }
            else{
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.TUTOR_NOT_FOUND });
            }

        } catch (error:any) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: error.message });
           
        }
    }
    async approveTutor(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.findTutorById(tutorId)

            if (!tutor) {
                 res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND });
                 return;  
              }

              tutor.isApproved = true;
              tutor.status = 'approved'
              await tutor.save()
              console.log('Tutor after approval:', tutor);

              await sendEmail(
                tutor.email,
                "Your Tutor Application Approved",
                `Dear ${tutor.name},\n\nCongratulations! Your application to become a tutor in EduElevate has been approved. You can now log in and start teaching.\n\nBest regards,\nEduElevate Team`
              );

              res.status(HTTP_STATUS.OK).json({ message: MESSAGES.TUTOR_APPROVED_SUCCESS });


        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }
    async rejectTutor(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.findTutorById(tutorId)
            if (!tutor) {
                 res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND });
                 return;
              }
              tutor.isApproved = false;
              tutor.status = "rejected";
              await tutor.save();

              await sendEmail(
                tutor.email,
                "Your Tutor Application Rejected",
                `Dear ${tutor.name},\n\nWe regret to inform you that your application to become a tutor in EduElevate has been rejected.\n\nThank you,\nEduElevate Team`
              );
              res.status(HTTP_STATUS.OK).json({ message: MESSAGES.TUTOR_REJECTED_SUCCESS });


        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }

    async updateTutor(req:Request,res:Response):Promise<void>{
        const{tutorId} =req.params
        const {isBlocked} = req.body;
        
        try {
            const updatedTutor = await this.adminService.updateTutor(tutorId,{isBlocked})

            if(!updatedTutor){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.TUTOR_NOT_FOUND});
                return;
            }

            res.status(HTTP_STATUS.OK).json(updatedTutor)
            return;
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
        }
    }
    async getCourseApplications(req:Request,res:Response):Promise<void>{
        try {
            const courses =  await this.adminService.getAllCourseApplications();
            res.status(HTTP_STATUS.OK).json(courses)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR,error:error instanceof Error ? error.message : error,})
            
        }
    }

    async getCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const course = await this.adminService.getCourseDetails(courseId);

            if(course){
                res.status(HTTP_STATUS.OK).json({success:true,course:course})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({sucess:false,message:MESSAGES.COURSE_NOT_FOUND})
            } 
        } catch (error:any) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: error.message });     
        }
    }
    async approveCourse(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params
            const course = await this.adminService.findCourseById(courseId)

            if(!course){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.COURSE_NOT_FOUND})
                return;
            }
            course.isApproved = true;
            course.status  = "approved";
            course.isRequestedToEdit=false
            await course.save()

            const tutor = course.tutorId as {_id:mongoose.Types.ObjectId; email:string;}

            await sendEmail(
                tutor.email,
                "Your Course Publishing request has approved",
                `Dear ${tutor.email},\n\nCongratulations! Your application to publish a course in EduElevate has been approved.\n\nBest regards,\nEduElevate Team`
            )

            res.status(HTTP_STATUS.OK).json({message:"Course approved successfully"})
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }
    async rejectCourse(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const { rejectReason } = req.body;

            const course = await this.adminService.findCourseById(courseId)

            if(!course){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.COURSE_NOT_FOUND});
                return;
            }
            course.isApproved = false;
            course.status = "rejected";
            course.rejectReason = rejectReason;
            course.isRequestedToEdit=false

            await course.save();

            const tutor = course.tutorId as { _id: mongoose.Types.ObjectId; email: string };
            await sendEmail(
                tutor.email,
                "Your course publishing request has rejected",
                `Dear ${tutor.email},\n\nWe regret to inform you that your application to publish a course in EduElevate has been rejected.
                The reason for rejection is ${course.rejectReason}.\n\nThank you,\nEduElevate Team`    

            )
            res.status(HTTP_STATUS.OK).json({message:MESSAGES.COURSE_REJECTED_SUCCESS,status: "rejected", rejectReason})
            return;
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
              });
        }
    }
    
    async getDashboardCounts(req:Request,res:Response):Promise<void>{
        try {
            const counts  = await this.adminService.getDashboardCounts()
            res.status(HTTP_STATUS.OK).json(counts)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error:"Failed to fetch dashboard counts"})
            
        }
    }


 }

