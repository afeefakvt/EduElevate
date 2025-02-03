import { Model } from "mongoose";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";
import bcrypt from 'bcryptjs'

export class TutorRepository implements ITutorRepository{

    private tutorModel:Model<ITutor>

    constructor(tutorModel:Model<ITutor>){
        this.tutorModel= tutorModel
    }
    async registerTutor(tutorData: ITutor): Promise<ITutor> {
        const tutor = new this.tutorModel(tutorData) 
        return await tutor.save()
    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return await this.tutorModel.findOne({email})
    }
     async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
            const hashedPassword = await bcrypt.hash(newPassword,10)
            return await this.tutorModel.findByIdAndUpdate(studentId,{password:hashedPassword},{new:true});
        }

}