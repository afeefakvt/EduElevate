import { IRatingService } from "../interfaces/rating/IRatingService";
import { Request,Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../constants/httpStatusCode";





export class RatingController{
    constructor(
        private ratingService:IRatingService
    ){}

    async addRating(req:Request,res:Response):Promise<void>{
        try {
            const {courseId,rating,review} = req.body ;
            const {student} = req as AuthenticatedRequest; // Extract student from request

            if (!student || !student.id) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Student not found" });
                return;
            }

            const studentId = new mongoose.Types.ObjectId(student.id)

            const ratingData ={rating,review,courseId,studentId} 
            const newRating = await this.ratingService.addRating(ratingData)

            if(!newRating){
                res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Failed to add Ratings to the course"})
                return;
            
            }
            res.status(HTTP_STATUS.CREATED).json(newRating)
            return;
            
        } catch (error) {
            console.log("error adding ratings",error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error adding rating" });
            return;
        }
    }
    async getCourseRatings (req:Request,res:Response):Promise<void>{
        try {
            const {courseId} = req.params;
            const {ratings,average}= await this.ratingService.getCourseRatings(courseId)
            res.json({ratings,average})

        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching ratings" });
            
        }
    }
    async getMostRatedCourse(req:Request,res:Response):Promise<void>{
        try {
            // console.log("ppppppppppppppppp");
            
            const course = await this.ratingService.getMostRatedCourse()
            if(!course){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"No course found"});
                return;
            }
            res.status(HTTP_STATUS.OK).json(course)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
            
        }
    }
  
}