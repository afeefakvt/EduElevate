import { ILectureRepository } from "../interfaces/lecture/ILectureRepository";
import { BaseRepository } from "./baseRepository";
import Lecture,{ ILecture } from "../models/lectureModel";


export class LectureRepository extends BaseRepository<ILecture> implements ILectureRepository{
    constructor(){
        super(Lecture)
    }
}