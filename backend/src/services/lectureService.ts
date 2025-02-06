import { ILectureService } from "../interfaces/lecture/ILectureService";
import { ILecture } from "../models/lectureModel";
import { ILectureRepository } from "../interfaces/lecture/ILectureRepository";

export class LectureService implements ILectureService{
    private lectureRepository:ILectureRepository

    constructor(lectureRepository:ILectureRepository){
        this.lectureRepository = lectureRepository
    }
}