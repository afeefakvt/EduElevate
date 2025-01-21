import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";

export class StudentRepository implements IStudentRepository {
    async createStudent(studentData:IStudent):Promise<IStudent>{
        const student = new Student(studentData)
        return await student.save()
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return await Student.findOne({email})
    }
}