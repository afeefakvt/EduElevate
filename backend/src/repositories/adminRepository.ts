import { Model } from "mongoose";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IStudent, Student } from "../models/studentModel";
import Tutor, { ITutor } from "../models/tutorModel";
import { TutorRepository } from "./tutorRepository";

export class AdminRepository implements IAdminRepository{

    private studentModel:Model<IStudent>
    private tutorModel:Model<ITutor>

    constructor(studentModel: Model<IStudent>, tutorModel: Model<ITutor>) {
        this.studentModel = studentModel;
        this.tutorModel = tutorModel; 
    }

    async getAllStudents():Promise<IStudent[]>{
        return await this.studentModel.find({role:"student"})
    } 
    async getAllTutors():Promise<ITutor[]>{
        return await this.tutorModel.find()
    }
    async findTutorById(id: String): Promise<ITutor | null> {
        return await this.tutorModel.findById(id)
    }
    async updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor |null >{
        return await this.tutorModel.findByIdAndUpdate(tutorId,tutorData,{new:true});
    }
    async updateStudent(studentId: string, studentData: Partial<IStudent>): Promise<IStudent | null> {
        return await this.studentModel.findByIdAndUpdate(studentId,studentData,{new:true})
    }

}