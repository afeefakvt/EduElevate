import { Request,Response } from "express";
import { ILectureService } from "../interfaces/lecture/ILectureService";
import mongoose from "mongoose";


interface LectureData{
    title:string,
    descrription:string,
    videoUrl:string,
    duration:number,
    order:number,
    courseId:mongoose.Types.ObjectId;
}

export class LectureController {
    constructor(
        private lectureService:ILectureService
    ){}

    async addLecture(req:Request,res:Response):Promise<void>{
        try {
            if(!req.files || !Array.isArray(req.files)){
                res.status(400).json({message:"video files are required for all lectures"});
                return;
            }
            const lectureData = JSON.parse(req.body.lectures) as LectureData[];

            if(!mongoose.Types.ObjectId.isValid(lectureData[0].courseId)){
                res.status(400).json({message:"Invalid courseId format"})
                return;
            }
            const videos= req.files as Express.Multer.File[];
            if(videos.length !== lectureData.length){
                res.status(400).json({message:"Each lecture must have corresponding video file "});
                return;
            }
            const createLectures = []
            const courseId = 
            
        } catch (error) {
            
        }
    }
}