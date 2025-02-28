import { Request,Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { sendEmail } from "../utils/mail";
import { TutorService } from "../services/tutorService";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../constants/httpStatusCode";


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
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "No students found" });
            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : error });

        }
    }

    async updateStudent(req:Request,res:Response):Promise<void>{
        const {studentId} = req.params;
        const {isBlocked} = req.body;
        
        try {
            const updatedStudent = await this.adminService.updateStudent(studentId,{isBlocked})
            if(!updatedStudent){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"student not found"})
                return;
            }
            res.status(HTTP_STATUS.OK).json(updatedStudent)
            return;

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:'internal server error',error: error instanceof Error ? error.message : error,})
            
        }
    }

    async getTutors(req:Request,res:Response):Promise<void>{
        try {
            const tutors = await this.adminService.getTutors()
            if(tutors){
                res.status(HTTP_STATUS.OK).json({success:true,tutors:tutors})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "No tutors found" });
            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : error });

            
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
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "tutor not found" });
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
                 res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Tutor not found" });
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

              res.status(HTTP_STATUS.OK).json({ message: "Tutor approved successfully" });


        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }
    async rejectTutor(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.findTutorById(tutorId)
            if (!tutor) {
                 res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Tutor not found" });
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
              res.status(HTTP_STATUS.OK).json({ message: "Tutor rejected and email sent." });


        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
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
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"tutor not found"});
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
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"internal server error",error:error instanceof Error ? error.message : error,})
            
        }
    }

    async getCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const course = await this.adminService.getCourseDetails(courseId);

            if(course){
                res.status(HTTP_STATUS.OK).json({success:true,course:course})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({sucess:false,message:"no course found"})
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
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Course not found"})
                return;
            }
            course.isApproved = true;
            course.status  = "approved"
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
                message: "Internal server error",
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
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Course not found"});
                return;
            }
            course.isApproved = false;
            course.status = "rejected";
            course.rejectReason = rejectReason;

            await course.save();

            const tutor = course.tutorId as { _id: mongoose.Types.ObjectId; email: string };
            await sendEmail(
                tutor.email,
                "Your course publishing request has rejected",
                `Dear ${tutor.email},\n\nWe regret to inform you that your application to publish a course in EduElevate has been rejected.
                The reason for rejection is ${course.rejectReason}.\n\nThank you,\nEduElevate Team`    

            )
            res.status(HTTP_STATUS.OK).json({message:"Course application rejected",status: "rejected", rejectReason})
            return;
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
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

