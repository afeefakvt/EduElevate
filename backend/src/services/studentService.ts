import { IStudent } from "../models/studentModel";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { hashPassword,comparePassword } from "../utils/password";
import { validateOtp } from "../utils/otp";
import { generatePasswordResetToken, generateRefreshToken, generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/resetPassword";
import { MESSAGES } from "../constants/message";


export class StudentService implements IStudentService  {
    private studentRepository: IStudentRepository; //abstarction

    constructor(studentRepository:IStudentRepository){
        this.studentRepository = studentRepository //injecting dependency
    }

    private async authenticateStudent(email:string,password:string):Promise<IStudent>{
        if(!email || !password){
            throw new Error(MESSAGES.EMPTY_CREDENTIALS)
        }

        const student = await this.studentRepository.getStudentByEmail(email)
        if(!student){
            throw new Error(MESSAGES.STUDENT_NOT_FOUND)
        }

        const isValidPassword = await comparePassword(password, student.password);
        if(!isValidPassword){
            throw new Error(MESSAGES.INVALID_PASSWORD)
        }
        if(student.isBlocked){
            throw new Error(MESSAGES.USER_BLOCKED);
        }
        return student

    }

    async createStudent(studentData:IStudent):Promise<IStudent>{
        const existingStudent = await this.studentRepository.findStudentByEmail(studentData.email);
        if(existingStudent){
            throw new Error(MESSAGES.EMAIL_ID_EXISTS)
        }
        const hashedPassword = await hashPassword(studentData.password as string);
        studentData.password = hashedPassword
        return await this.studentRepository.createStudent(studentData)
    }

    async verifyOtp(email:string,otp:string):Promise<boolean>{
        return validateOtp(email,otp)
    }

    async loginStudent(email:string,password:string):Promise<{token:string, refreshToken:string, student:IStudent}>{ 
        const student = await this.authenticateStudent(email,password);

        if(student.role!=="student"){
            throw new Error(MESSAGES.STUDENT_ACCESS_DENIED)
        }

        const token = generateToken({
            id:student._id,
            email:student.email,
            role:student.role,
            isBlocked:student.isBlocked 
        })

        const refreshToken = generateRefreshToken({id:student._id})
        return {token,refreshToken,student}
    }
    
    async loginAdmin(email: string, password: string): Promise<{ token: string; refreshToken: string; student: IStudent; }> {
        const student = await this.authenticateStudent(email,password);

        if(student.role!=="admin"){
            throw new Error(MESSAGES.ADMIN_ACCESS_DENIED)
        }

        const token = generateToken({
            id:student._id,
            email:student.email,
            role:student.role,
            isBlocked:student.isBlocked 
        })

        const refreshToken = generateRefreshToken({id:student._id})
        return {token,refreshToken,student}
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
        
        await sendEmail(email,resetToken)
        return resetToken

    }
    async updatePassword(studentId:string,newPassword:string):Promise<IStudent | null>{
        return this.studentRepository.updatePassword(studentId,newPassword)
    }
    async getCourseById(courseId: string): Promise<IStudent | null> {
        return this.studentRepository.getCourseById(courseId)
    }

    async editProfile(id:string,data: Partial<IStudent>): Promise<IStudent | null> {
        return this.studentRepository.editProfile(id,data)
        
    }
    async changePassword(studentId: string, currentPassword: string, newPassword: string): Promise<IStudent | null> {
        const student  = await this.studentRepository.findStudentById(studentId)
        if(!student){
            throw new Error(MESSAGES.STUDENT_NOT_FOUND)
        }
        const isMatch = await comparePassword(currentPassword,student.password)
        if(!isMatch){
            throw new Error(MESSAGES.INCORRECT_CURRENT_PASSWORD);
        }
        const hashedPassword = await hashPassword(newPassword);
        return this.studentRepository.changePassword(studentId,{password:hashedPassword})
    }

    async getStudentById(studentId: string): Promise<IStudent | null> {
        return await this.studentRepository.findStudentById(studentId)
    }

}