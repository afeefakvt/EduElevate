import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import bcrypt from 'bcryptjs'
import { Model } from "mongoose";

export class StudentRepository implements IStudentRepository {

    private studentModel:Model<IStudent> //abstraction

    constructor(studentModel:Model<IStudent>){
        this.studentModel = studentModel //injecting dependency
    }
    
    async createStudent(studentData:IStudent):Promise<IStudent>{
        const student = new this.studentModel(studentData)
        return await student.save()
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return await this.studentModel.findOne({email})
    }
    
    async updatePassword(studentId: string, newPassword: string): Promise<IStudent | null> {
        const hashedPassword = await bcrypt.hash(newPassword,10)
        return await this.studentModel.findByIdAndUpdate(studentId,{password:hashedPassword},{new:true});
    }
}