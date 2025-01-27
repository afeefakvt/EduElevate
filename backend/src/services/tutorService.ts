import { ITutorRepository } from "../interfaces/tutor/ITutorRepository"
import { ITutorService } from "../interfaces/tutor/ITutorService"
import { ITutor } from "../models/tutorModel";
import { StudentRepository } from "../repositories/studentRepository";
import { validateOtp } from "../utils/otp";
import { hashPassword } from "../utils/password";
import { tutorLogin } from "./authService";



export class TutorService implements ITutorService{
    private tutorRepository: ITutorRepository;

    constructor(tutorRepository:ITutorRepository){
        this.tutorRepository = tutorRepository
    }

    async registerTutor(tutorData: ITutor): Promise<ITutor> {

        const existingTutor = await this.tutorRepository.findTutorByEmail(tutorData.email)
        if(existingTutor){
            throw new Error('email id already exists')

        }
        const hashedPassword = await hashPassword(tutorData.password as string)
        tutorData.password = hashedPassword
        return await this.tutorRepository.registerTutor(tutorData)
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        return validateOtp(email,otp)
    }

    async loginTutor(email: string, password: string): Promise<{ token: string; tutor: ITutor; }> {
        return await tutorLogin(email,password,this.tutorRepository)
    }
}