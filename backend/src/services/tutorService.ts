import { ITutorRepository } from "../interfaces/tutor/ITutorRepository"
import { ITutorService } from "../interfaces/tutor/ITutorService"
import { ITutor } from "../models/tutorModel";
import { StudentRepository } from "../repositories/studentRepository";
import { validateOtp } from "../utils/otp";
import { hashPassword } from "../utils/password";
import { tutorLogin } from "./authService";
import { generatePasswordResetToken, generateRefreshToken, generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/resetTutorPassword";
import { ICourse } from "../models/courseModel";
import { comparePassword } from "../utils/password";



export class TutorService implements ITutorService {
    private tutorRepository: ITutorRepository;

    constructor(tutorRepository: ITutorRepository) {
        this.tutorRepository = tutorRepository
    }




    private async authenticateTutor(email:string,password:string):Promise<ITutor>{
        if(!email || !password){
            throw new Error("Email and password cannot be empty")
        }

        const tutor = await this.tutorRepository.getTutorByEmail(email)
        if(!tutor){
            throw new Error("student not found")
        }

        const isValidPassword = await comparePassword(password, tutor.password);
        if(!isValidPassword){
            throw new Error("Invalid password.Please enter a valid password")
        }
        if(tutor.isBlocked){
            throw new Error("You are blocked by admin. Can't login now");
        }
        return tutor

    }
    


    async registerTutor(tutorData: ITutor): Promise<ITutor> {

        const existingTutor = await this.tutorRepository.findTutorByEmail(tutorData.email)
        if (existingTutor) {
            throw new Error('email id already exists')

        }
        const hashedPassword = await hashPassword(tutorData.password as string)
        tutorData.password = hashedPassword
        return await this.tutorRepository.registerTutor(tutorData)
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        return validateOtp(email, otp)
    }

    async loginTutor(email: string, password: string): Promise<{ token: string; refreshToken:string; tutor: ITutor; }> {

        const tutor = await this.authenticateTutor(email,password)

        const token = generateToken({
            id:tutor._id,
            email:tutor.email,
            isBlocked:tutor.isBlocked 
        })

        const refreshToken = generateRefreshToken({id:tutor._id})
        return {token,refreshToken,tutor}

    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return this.tutorRepository.findTutorByEmail(email)
    }

    async handleForgotPassword(email: string): Promise<string | null> {
        const student = await this.tutorRepository.findTutorByEmail(email);

        if (!student) {
            return null
        }
        const resetToken = generatePasswordResetToken(student.id.toString());
        // console.log("reset token is", resetToken);

        await sendEmail(email, resetToken)
        return resetToken

    }
    async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
        return this.tutorRepository.updatePassword(studentId, newPassword)
    } 
    async  getTutorCourses(tutorId: string): Promise<ICourse[]> {
        return await this.tutorRepository.getTutorCourses(tutorId)
    }
    async getTutorCourseDetails(courseId: string): Promise<ICourse | null> {
        return await this.tutorRepository.getTutorCourseDetails(courseId)
    }
}