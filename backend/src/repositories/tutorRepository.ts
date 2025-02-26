import { Model } from "mongoose";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";

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
    async getTutorCourses(tutorId: string): Promise<ICourse[]> {
        return await Course.find({tutorId:tutorId}).populate("categoryId")
    }
    async getTutorCourseDetails(courseId: string): Promise<ICourse | null> {
        return await Course.findById(courseId).populate("lectures").populate("tutorId")
    }
    async getTutorByEmail(email: string): Promise<ITutor | null> {
        return await this.findByEmail(email)
    }

    async getTutorById(id: string): Promise<ITutor | null> {
        return await this.findById(id);    
    }
    async editTutorProfile(id: string, data: Partial<ITutor>): Promise<ITutor | null> {
        return await this.findByIdAndUpdate(id,data)
    }
    async changeTutorPassword(tutorId: string, data: { password: string; }): Promise<ITutor | null> {
        return await this.findByIdAndUpdate(tutorId,{password:data.password})
    }

}