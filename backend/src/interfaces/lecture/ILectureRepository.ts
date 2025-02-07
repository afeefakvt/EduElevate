import mongoose from "mongoose";
import { ILecture } from "../../models/lectureModel";

export interface ILectureRepository{
    addLecture(lectureData:Partial<ILecture>):Promise<ILecture | null>;
    addLectureToCourse(courseId:mongoose.Types.ObjectId,lectureId:mongoose.Types.ObjectId):Promise<void>;
    
}