import { IStudent } from "../models/studentModel";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { hashPassword,comparePassword } from "../utils/password";
import { validateOtp } from "../utils/otp";
import { login } from "./authService";
import { generatePasswordResetToken } from "../utils/jwt";
import { sendEmail } from "../utils/resetPassword";


export class StudentService implements IStudentService  {
    private studentRepository: IStudentRepository; //abstarction

    constructor(studentRepository:IStudentRepository){
        this.studentRepository = studentRepository //injecting deendency
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

    async loginStudent(email:string,password:string):Promise<{token:string, student:IStudent,role:string}>{
        return await login(email,password,this.studentRepository)
    }
    async findStudentByEmail(email:string):Promise<IStudent | null>{
        return this.studentRepository.findStudentByEmail(email);
    }
    async handleForgotPassword(email:string):Promise<string | null>{
        const student = await this.studentRepository.findStudentByEmail(email);

        if(!student){
            return null
        }
        const resetToken = generatePasswordResetToken(student.id.toString());
        // console.log("reset token is", resetToken);

        await sendEmail(email,resetToken)
        return resetToken

    }
    async updatePassword(studentId:string,newPassword:string):Promise<IStudent | null>{
        return this.studentRepository.updatePassword(studentId,newPassword)
    }
    async getCourseById(courseId: string): Promise<IStudent | null> {
        return this.studentRepository.getCourseById(courseId)
    }

}