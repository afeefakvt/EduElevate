import { Model } from "mongoose";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IStudent, Student } from "../models/studentModel";
import Tutor, { ITutor } from "../models/tutorModel";
import { TutorRepository } from "./tutorRepository";
import { BaseRepository } from "./baseRepository";

export class AdminRepository extends BaseRepository<IStudent> implements IAdminRepository{

    private tutorRepository:BaseRepository<ITutor>
    constructor(){
        super(Student)
        this.tutorRepository =new  BaseRepository<ITutor>(Tutor) //injecting baserepository for tutors
    }
    

    async getAllStudents():Promise<IStudent[]>{
        return await this.find({role:"student"})
    } 
    async getAllTutors():Promise<ITutor[]>{
        return await this.tutorRepository.find({})
    }
    async findTutorById(id: string): Promise<ITutor | null> {
        return await this.tutorRepository.findById(id)
    }
    async updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor |null >{
        return await this.tutorRepository.findByIdAndUpdate(tutorId,tutorData);
    }
    async updateStudent(studentId: string, studentData: Partial<IStudent>): Promise<IStudent | null> {
        return await this.findByIdAndUpdate(studentId,studentData)
    }

}