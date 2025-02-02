import { StudentRepository } from "../repositories/studentRepository";
import { IStudent } from "../models/studentModel";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { hashPassword,comparePassword } from "../utils/password";
import { validateOtp } from "../utils/otp";
import { login } from "./authService";

export class StudentService  {
    private studentRepository: IStudentRepository;

    constructor(studentRepository:IStudentRepository){
        this.studentRepository = studentRepository
    }

    async createStudent(studentData:IStudent):Promise<IStudent>{
        const existingStudent = await this.studentRepository.findStudentByEmail(studentData.email);
        if(existingStudent){
            throw new Error("email id already exists")
        }
        const hashedPassword = await hashPassword(studentData.password as string);
        studentData.password = hashedPassword
        return await this.studentRepository.createStudent(studentData)
    }

    async verifyOtp(email:string,otp:string):Promise<boolean>{
        return validateOtp(email,otp)
    }

    async loginStudent(email:string,password:string):Promise<{token:string, student:IStudent}>{
        return await login(email,password,this.studentRepository)
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return this.studentRepository.findStudentByEmail(email);
    }

}