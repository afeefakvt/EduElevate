import { ILectureService } from "../interfaces/lecture/ILectureService";
import { ILecture } from "../models/lectureModel";
import { ILectureRepository } from "../interfaces/lecture/ILectureRepository";
import Course from "../models/courseModel";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary";

export class LectureService implements ILectureService{
    private lectureRepository:ILectureRepository

    constructor(lectureRepository:ILectureRepository){
        this.lectureRepository = lectureRepository
    }
    async addLecture(lectureData: Partial<ILecture>, courseId: mongoose.Types.ObjectId): Promise<ILecture | null> {
        try {            
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

    async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
        try {
            const lecture = await this.lectureRepository.getLecturesByCourse(courseId)
            return lecture
        } catch (error) {
            throw new Error(
                `Error fetching lectures for course: ${(error as Error).message}`
              );  
        }
    }
    async editLecture(lectureId: string, updatedData: Partial<ILecture>): Promise<ILecture | null> {
        try {
            return await this.lectureRepository.editLecture(lectureId,updatedData)
        } catch (error) {
            throw new Error(`Error editing lecture: ${(error as Error).message}`);
        }
    }
    async listUnlistLecture(lectureId: string, lectureData: Partial<ILecture>): Promise<ILecture | null> {
        return await this.lectureRepository.listUnlistlecture(lectureId,lectureData)
    }
}