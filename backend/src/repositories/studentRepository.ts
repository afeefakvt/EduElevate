import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import bcrypt from 'bcryptjs'

export class StudentRepository implements IStudentRepository {
    async createStudent(studentData:IStudent):Promise<IStudent>{
        const student = new Student(studentData)
        return await student.save()
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return await Student.findOne({email})
    }
    
    async updatePassword(studentId: string, newPassword: string): Promise<IStudent | null> {
        const hashedPassword = await bcrypt.hash(newPassword,10)
        return await Student.findByIdAndUpdate(studentId,{password:hashedPassword},{new:true});
    }
}