import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IStudent, Student } from "../models/studentModel";

export class AdminRepository implements IAdminRepository{
    async getAllStudents():Promise<IStudent[]>{
        return await Student.find({role:"student"})
    }   
}