import { ITutorRepository } from "../interfaces/tutor/ITutorRepository"
import { ITutorService } from "../interfaces/tutor/ITutorService"
import { ITutor } from "../models/tutorModel";
import { validateOtp } from "../utils/otp";
import { hashPassword } from "../utils/password";
import { generatePasswordResetToken, generateRefreshToken, generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/resetTutorPassword";
import { ICourse } from "../models/courseModel";
import { comparePassword } from "../utils/password";
import { MESSAGES } from "../constants/message";



export class TutorService implements ITutorService {
    private tutorRepository: ITutorRepository;

    constructor(tutorRepository: ITutorRepository) {
        this.tutorRepository = tutorRepository
    }


    private async authenticateTutor(email:string,password:string):Promise<ITutor>{
        if(!email || !password){
            throw new Error(MESSAGES.EMPTY_CREDENTIALS)
        }

        const tutor = await this.tutorRepository.getTutorByEmail(email)
        if(!tutor){
            throw new Error(MESSAGES.TUTOR_NOT_FOUND)
        }

        const isValidPassword = await comparePassword(password, tutor.password);
        if(!isValidPassword){
            throw new Error(MESSAGES.INVALID_PASSWORD)
        }
        if(tutor.isBlocked){
            throw new Error(MESSAGES.USER_BLOCKED);
        }
        if (tutor.status==="pending") {
            throw new Error(MESSAGES.TUTOR_PENDING)
                    
        }
        if (tutor.status==='rejected') {
            throw new Error(MESSAGES.TUTOR_REJECTED)
        }
            
        return tutor

    }

    async registerTutor(tutorData: ITutor): Promise<ITutor> {

        const existingTutor = await this.tutorRepository.findTutorByEmail(tutorData.email)
        if (existingTutor) {
            throw new Error(MESSAGES.EMAIL_ID_EXISTS)

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
            role:tutor.role,
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

        await sendEmail(email, resetToken)
        return resetToken

    }
    async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
        return this.tutorRepository.updatePassword(studentId, newPassword)
    } 
    async  getTutorCourses(tutorId: string,search:string,category:string,sort:string,page:number,limit:number): Promise<{courses:ICourse[]; total:number}> {
        return await this.tutorRepository.getTutorCourses(tutorId,search,category,sort,page,limit)
    }
    async getTutorCourseDetails(courseId: string): Promise<ICourse | null> {
        return await this.tutorRepository.getTutorCourseDetails(courseId)
    }
    async editTutorProfile(tutorId: string, data: Partial<ITutor>): Promise<ITutor | null> {
        return this.tutorRepository.editTutorProfile(tutorId,data)
    }
    async changeTutorPassword(tutorId: string, currentPassword: string, newPassword: string): Promise<ITutor | null> {
        const tutor = await this.tutorRepository.getTutorById(tutorId)
        if(!tutor){
            throw new Error(MESSAGES.STUDENT_NOT_FOUND)
        }
        const isMatch = await comparePassword(currentPassword,tutor.password)
        if(!isMatch){
            throw new Error(MESSAGES.INCORRECT_CURRENT_PASSWORD);
        }
        const hashedPassword = await hashPassword(newPassword)
        return this.tutorRepository.changeTutorPassword(tutorId,{password:hashedPassword})

    }
    async getApprovedCount(tutorId: string): Promise<number> {
        return await this.tutorRepository.getApprovedCount(tutorId)    
    }
    async getPendingCount(tutorId: string): Promise<number> {
        return await this.tutorRepository.getPendingCount(tutorId)    
    }
}