import { Request,Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { TutorRepository } from "../repositories/tutorRepository";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { sendEmail } from "../utils/mail";
import { TutorService } from "../services/tutorService";
import { send } from "process";
import mongoose from "mongoose";


export class AdminController {
    constructor(
        private adminService:IAdminService,        
    ){}

    async getStudents(req:Request,res:Response):Promise<void>{
        try {
            const students = await this.adminService.getStudents()
            
            if (students) {
                res.status(200).json({ success: true, students: students });
            } else {
                res.status(404).json({ success: false, message: "No students found" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : error });

        }
    }

    async updateStudent(req:Request,res:Response):Promise<void>{
        const {studentId} = req.params;
        const {isBlocked} = req.body;
        
        try {
            const updatedStudent = await this.adminService.updateStudent(studentId,{isBlocked})
            if(!updatedStudent){
                res.status(404).json({message:"student not found"})
                return;
            }
            res.status(200).json(updatedStudent)
            return;

        } catch (error) {
            res.status(500).json({success:false,message:'internal server error',error: error instanceof Error ? error.message : error,})
            
        }
    }

    async getTutors(req:Request,res:Response):Promise<void>{
        try {
            const tutors = await this.adminService.getTutors()
            if(tutors){
                res.status(200).json({success:true,tutors:tutors})
            }else{
                res.status(404).json({ success: false, message: "No tutors found" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : error });

            
        }

    }


    async getTutorDetails(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.getTutorDetails(tutorId)
            
            if(tutor){
                res.status(200).json({ success: true, tutor:tutor });

            }
            else{
                res.status(404).json({ success: false, message: "No tutor found" });
            }

        } catch (error:any) {
            res.status(404).json({ success: false, message: error.message });
           
        }
    }
    async approveTutor(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminService.findTutorById(tutorId)

            if (!tutor) {
                 res.status(404).json({ message: "Tutor not found" });
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

              res.status(200).json({ message: "Tutor approved successfully" });


        } catch (error) {
            res.status(500).json({
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
                 res.status(404).json({ message: "Tutor not found" });
                 return;
              }
              tutor.isApproved = false;
              tutor.status = "rejected";
              await tutor.save();

              await sendEmail(
                tutor.email,
                "Your Tutor Application Rejected",
                `Dear ${tutor.name},\n\nWe regret to inform you that your application to become a tutor in EduElevate has been rejected.\n\nBest regards,\nEduElevate Team`
              );
              res.status(200).json({ message: "Tutor rejected and email sent." });


        } catch (error) {
            res.status(500).json({
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
                res.status(404).json({message:"tutor not found"});
                return;
            }

            res.status(200).json(updatedTutor)
            return;
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
        }
    }
    async getCourseApplications(req:Request,res:Response):Promise<void>{
        try {
            const courses =  await this.adminService.getAllCourseApplications();
            res.status(200).json(courses)
        } catch (error) {
            res.status(500).json({success:false,message:"internal server error",error:error instanceof Error ? error.message : error,})
            
        }
    }

    async getCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const course = await this.adminService.getCourseDetails(courseId);

            if(course){
                res.status(200).json({success:true,course:course})
            }else{
                res.status(404).json({sucess:false,message:"no course found"})
            } 
        } catch (error:any) {
            res.status(404).json({ success: false, message: error.message });     
        }
    }
    async approveCourse(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params
            const course = await this.adminService.findCourseById(courseId)

            if(!course){
                res.status(404).json({message:"Course not found"})
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

            res.status(200).json({message:"Course approved successfully"})
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }
    async rejectCourse(req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const course = await this.adminService.findCourseById(courseId)

            if(!course){
                res.status(404).json({message:"Course not found"});
                return;
            }
            course.isApproved = false;
            course.status = "rejected";
            await course.save();

            const tutor = course.tutorId as { _id: mongoose.Types.ObjectId; email: string };
            await sendEmail(
                tutor.email,
                "Your course publishing request has rejected",
                `Dear ${tutor.email},\n\nWe regret to inform you that your application to publish a course in EduElevate has been rejected.\n\nBest regards,\nEduElevate Team`    

            )
            res.status(200).json({message:"Course application rejected"})
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }
}

