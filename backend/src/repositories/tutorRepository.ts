import { Model } from "mongoose";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";

export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository{

        constructor(){
            super(Tutor)
      }
    async registerTutor(tutorData: ITutor): Promise<ITutor> {
        return await this.create(tutorData)
    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return await this.findOne({email})
    }
     async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
            const hashedPassword = await bcrypt.hash(newPassword,10)
            return await this.findByIdAndUpdate(studentId,{password:hashedPassword});
        }

}