import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";
import bcrypt from 'bcryptjs'

export class TutorRepository implements ITutorRepository{
    async registerTutor(tutorData: ITutor): Promise<ITutor> {
        const tutor = new Tutor(tutorData) 
        return await tutor.save()
    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return await Tutor.findOne({email})
    }
     async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
            const hashedPassword = await bcrypt.hash(newPassword,10)
            return await Tutor.findByIdAndUpdate(studentId,{password:hashedPassword},{new:true});
        }

}