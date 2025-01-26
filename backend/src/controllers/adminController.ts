import { Request,Response } from "express";
import { IAdminService } from "../interfaces/admin/IAdminService";


export class AdminController {
    constructor(
        private adminService:IAdminService
        
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
        
    }
}

