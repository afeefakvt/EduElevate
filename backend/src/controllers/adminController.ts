import { Request,Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { TutorRepository } from "../repositories/tutorRepository";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { sendEmail } from "../utils/mail";


export class AdminController {
    constructor(
        private adminService:IAdminService,
        private adminRepository:IAdminRepository
        
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
    async approveTutor(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params
            const tutor = await this.adminRepository.findTutorById(tutorId)

            if (!tutor) {
                 res.status(404).json({ message: "Tutor not found" });
                 return;  
              }

              tutor.isApproved = true;
              tutor.status = 'approved'
              await tutor.save()

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
            const tutor = await this.adminRepository.findTutorById(tutorId)
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
}

