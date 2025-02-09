import { ILectureService } from "../interfaces/lecture/ILectureService";
import { ILecture } from "../models/lectureModel";
import { ILectureRepository } from "../interfaces/lecture/ILectureRepository";
import Course from "../models/courseModel";
import mongoose from "mongoose";
import { log } from "console";

export class LectureService implements ILectureService{
    private lectureRepository:ILectureRepository

    constructor(lectureRepository:ILectureRepository){
        this.lectureRepository = lectureRepository
    }
    async addLecture(lectureData: Partial<ILecture>, courseId: mongoose.Types.ObjectId): Promise<ILecture | null> {
        try {

            // console.log("leeeeeeeeeeksfjn");
            
           if(lectureData){
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                {isApproved:"false"},
                {new:true}
            );
            if(!updatedCourse){
                throw new Error("course not found")
            } 
           }
           return await this.lectureRepository.addLecture(lectureData) 
        } catch (error) {
            throw new Error(`Error creating new Lecture ${(error as Error).message}`)
            
        }
    }
    async addLectureToCourse(courseId: mongoose.Types.ObjectId, lectureId: mongoose.Types.ObjectId): Promise<void> {
        await this.lectureRepository.addLectureToCourse(courseId,lectureId)
    }
}