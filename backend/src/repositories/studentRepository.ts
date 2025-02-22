import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";

export class StudentRepository extends BaseRepository<IStudent> implements IStudentRepository {
    constructor(){
        super(Student)
    }
   

    // private studentRepository:BaseRepository<IStudent>
    // private courseRepository:BaseRepository<ICourse>
    
    // constructor(){
    //     this.studentRepository = new BaseRepository<IStudent>(Student)
    //     this.courseRepository = new BaseRepository<ICourse>(Course)
    // }
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
     async getCourseById(courseId: string): Promise<IStudent | null> {
        return await Course.findById(courseId)
        
    }
    async getStudentByEmail(email: string): Promise<IStudent | null> {
        return await this.findByEmail(email)
        
    }

    async findStudentById(id: string): Promise<IStudent | null> {
        return await this.findById(id)
    }
    async editProfile(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
        return await this.findByIdAndUpdate(id,data)
    }
    async changePassword(studentId: string, data: { password: string; }): Promise<IStudent | null> {
        return await this.findByIdAndUpdate(studentId,{password:data.password});
    }
 
}