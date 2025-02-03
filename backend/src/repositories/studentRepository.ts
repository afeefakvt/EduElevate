import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";

export class StudentRepository extends BaseRepository<IStudent> implements IStudentRepository {
    constructor(){
        super(Student)
    }
    
    async createStudent(studentData:IStudent):Promise<IStudent>{
        return await this.create(studentData)
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return await this.findOne({email})
    }
    
    async updatePassword(studentId: string, newPassword: string): Promise<IStudent | null> {
        const hashedPassword = await bcrypt.hash(newPassword,10)
        return await this.findByIdAndUpdate(studentId,{password:hashedPassword});
    }
}