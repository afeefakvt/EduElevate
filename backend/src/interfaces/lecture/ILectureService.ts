import mongoose from "mongoose";
import { ILecture } from "../../models/lectureModel";

export interface ILectureService{
    addLecture(lectureData:Partial<ILecture>,courseId:mongoose.Types.ObjectId):Promise<ILecture | null>
    addLectureToCourse(courseId:mongoose.Types.ObjectId,lectureId:mongoose.Types.ObjectId):Promise<void>;
    getLecturesByCourse(courseId:string):Promise<ILecture[]>;
    editLecture(lectureId:string,updatedData:Partial<ILecture>):Promise<ILecture | null>

}