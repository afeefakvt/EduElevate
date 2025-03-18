import { Request, Response } from "express";
import { ILectureService } from "../interfaces/lecture/ILectureService";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { cloudinary } from "../config/cloudinary";

interface LectureData {
    title: string,
    description: string,
    videoUrl: string,
    duration: string,
    order: number,
    courseId: mongoose.Types.ObjectId;
}

export class LectureController {
    constructor(
        private lectureService: ILectureService
    ) {}

    async addLecture(req: Request, res: Response): Promise<void> {
        try {
            // console.log("adddddlectureeeeeee");


            if (!req.files || !Array.isArray(req.files)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "video files are required for all lectures" });
                return;
            }
            const lectureDatas = JSON.parse(req.body.lectures) as LectureData[];
            // console.log(lectureDatas,"khv hn")

            if (!lectureDatas.length || !mongoose.Types.ObjectId.isValid(lectureDatas[0].courseId)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid courseId format" })
                return;
            }
            const videos = req.files as Express.Multer.File[];
            if (videos.length !== lectureDatas.length) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Each lecture must have corresponding video file " });
                return;
            }
            const addedLectures = []
            const courseId = lectureDatas[0].courseId

            for (let i = 0; i < lectureDatas.length; i++) {
                const lectureData = {
                    title: lectureDatas[i].title,
                    description: lectureDatas[i].description,
                    duration: lectureDatas[i].duration,
                    order: Number(lectureDatas[i].order),
                    courseId: lectureDatas[i].courseId,
                    videoUrl: videos[i].path
                };
                const newLecture = await this.lectureService.addLecture(lectureData, courseId);
                if (!newLecture) {
                    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: `Failed to add lectures: ${lectureData.title}` });
                    return;

                }
                const lectureId: mongoose.Types.ObjectId = newLecture._id as mongoose.Types.ObjectId

                await this.lectureService.addLectureToCourse(lectureData.courseId, lectureId)
                addedLectures.push(newLecture)

            }
            res.status(HTTP_STATUS.CREATED).json({ message: "lectures added successfully", lectures: addedLectures })
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message })
            console.error("error adding lectures", error);

        }
    }

    async getLecturesByCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const lectures = await this.lectureService.getLecturesByCourse(courseId);

            if (!lectures) {
                throw new Error('lecture cannot found');
            }
            res.status(HTTP_STATUS.OK).json({ lectures })

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message })


        }
    }

        async editLecture(req: Request, res: Response): Promise<void> {
            try {
                const { lectureId } = req.params;
                const updatedData = req.body;
                // console.log("edit requesttt",updatedData);

                // Check if a new video file is uploaded
                if (req.file) {
                    const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "lecture_videos",
                    resource_type: "auto",
                    });
                    updatedData.videoUrl = result.secure_url; // Replace old video URL with new one
                }
        
            
                // if (Array.isArray(req.files) && req.files.length > 0) {
                //     updatedData.videoUrls = req.files.map((file) => file.path);
                // } else if (req.files && Object.values(req.files).some((files) => files.length > 0)) {
                //     const videoFiles = Object.values(req.files).flat();
                //     updatedData.videoUrls = videoFiles.map((file) => file.path)
                // }

                const updatedLecture = await this.lectureService.editLecture(
                    lectureId, updatedData
                )
                if (!updatedLecture) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Lecture not found" });
                    return;
                }
                res.status(HTTP_STATUS.OK).json({success:true,message:"lecture updated successfully",lecture:updatedLecture})
            } catch (error) {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message })
            }
        }

    async listUnlistLecture (req:Request,res:Response):Promise<void>{
        try {
            const {lectureId} = req.params
            const {isListed} = req.body;
            const updatedLecture = await this.lectureService.listUnlistLecture(lectureId,{isListed});
            if(!updatedLecture){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Lecture not found"})
                return;
            }
            res.status(HTTP_STATUS.OK).json({success:true,message:`Lecture ${isListed ? "listed" : "unlisted"} successfully`,lecture:updatedLecture})
            
        } catch (error) {
            
        }
    }
}