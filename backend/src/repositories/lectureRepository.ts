import { ILectureRepository } from "../interfaces/lecture/ILectureRepository";
import { BaseRepository } from "./baseRepository";
import Lecture,{ ILecture } from "../models/lectureModel";
import { Types } from "mongoose";
import Course from "../models/courseModel";


export class LectureRepository extends BaseRepository<ILecture> implements ILectureRepository{
    constructor(){
        super(Lecture)
    }

    async addLecture(lectureData: Partial<ILecture>): Promise<ILecture | null> {
        return await this.create(lectureData)
    }
    async addLectureToCourse(courseId: Types.ObjectId, lectureId: Types.ObjectId): Promise<void> {
        const updatedCourse = await Course.findByIdAndUpdate({_id:courseId},{$push:{lectures:lectureId}},{new:true})

        if(!updatedCourse){
            throw new Error(`Course with ID ${courseId} not found.`);
        }else{
            console.log(`Updated Course: `, updatedCourse);

        }
    }
}