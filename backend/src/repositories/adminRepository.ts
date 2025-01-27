import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IStudent, Student } from "../models/studentModel";
import Tutor, { ITutor } from "../models/tutorModel";

export class AdminRepository implements IAdminRepository{

    async getAllStudents():Promise<IStudent[]>{
        return await Student.find({role:"student"})
    } 
    async getAllTutors():Promise<ITutor[]>{
        return await Tutor.find()
    }
    async findTutorById(id: String): Promise<ITutor | null> {
        return await Tutor.findById(id)
    }

}