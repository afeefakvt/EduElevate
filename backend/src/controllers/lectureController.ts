import { Request,Response } from "express";
import { ILectureService } from "../interfaces/lecture/ILectureService";
import mongoose from "mongoose";


interface LectureData{
    title:string,
    description:string,
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
            console.log("adddddlectureeeeeee");
            
            if(!req.files || !Array.isArray(req.files)){
                res.status(400).json({message:"video files are required for all lectures"});
                return;
            }
            const lectureDatas = JSON.parse(req.body.lectures) as LectureData[];
            console.log(lectureDatas,"khv hn")

            if(!lectureDatas.length || !mongoose.Types.ObjectId.isValid(lectureDatas[0].courseId)){
                res.status(400).json({message:"Invalid courseId format"})
                return;
            }
            const videos= req.files as Express.Multer.File[];
            if(videos.length !== lectureDatas.length){
                res.status(400).json({message:"Each lecture must have corresponding video file "});
                return;
            }
            const addedLectures = []
            const courseId = lectureDatas[0].courseId

            for(let i=0;i<lectureDatas.length;i++){
                const lectureData = {
                    title:lectureDatas[i].title,
                    description:lectureDatas[i].description,
                    duration:Number(lectureDatas[i].duration),
                    order:Number(lectureDatas[i].order),
                    courseId:lectureDatas[i].courseId,
                    videoUrl:videos[i].path
                };
                const newLecture = await this.lectureService.addLecture(lectureData,courseId);
                if(!newLecture){
                    res.status(400).json({message:`Failed to add lectures: ${lectureData.title}`});
                    return;

                }
                const lectureId : mongoose.Types.ObjectId = newLecture._id as mongoose.Types.ObjectId

                await this.lectureService.addLectureToCourse(lectureData.courseId,lectureId)
                addedLectures.push(newLecture)

             }
            res.status(201).json({message:"lectures added successfully",lectures:addedLectures})
        } catch (error) {
            res.status(500).json({message:(error as Error).message})
            console.error("error adding lectures",error);
            
        }
    }
}