import {Student,IStudent} from "../models/studentModel";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";

export class StudentRepository implements IStudentRepository {
    // constructor(){
    //     super(Student)
    // }

    private studentRepository:BaseRepository<IStudent>
    private courseRepository:BaseRepository<ICourse>
    
    constructor(){
        this.studentRepository = new BaseRepository<IStudent>(Student)
        this.courseRepository = new BaseRepository<ICourse>(Course)
    }
    async createStudent(studentData:IStudent):Promise<IStudent>{
        return await this.studentRepository.create(studentData)
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return await this.studentRepository.findOne({email})
    }
    
    async updatePassword(studentId: string, newPassword: string): Promise<IStudent | null> {
        const hashedPassword = await bcrypt.hash(newPassword,10)
        return await this.studentRepository.findByIdAndUpdate(studentId,{password:hashedPassword});
    }
    async  getCourses(): Promise<ICourse[]> {
        return await this.courseRepository.find({})
        
    }
}