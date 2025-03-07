import mongoose from "mongoose";
import  {IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import Course from "../models/courseModel";
import Enrollment,{IEnrollment} from "../models/enrollmentModel";
import { BaseRepository } from "./baseRepository";

export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository{
    constructor(){
        super(Enrollment)
    }

    async getEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null> {
        return await this.find({studentId:id}).populate({path:"courseId",populate:
            [{path:"tutorId",select:"name"},
            {path:"categoryId",select:"name"}
            ]
        })
        .exec();
        
    }
    async getTutorEnrollments(tutorId: string): Promise<Record<string, number>> {
        try {
            const courses =await Course.find({tutorId})
            const courseIds = courses.map(course=>course._id)
            
            const enrollments = await this.aggregate([
                {$match:{courseId:{$in:courseIds}}},
                {$group:{_id:"$courseId",count:{$sum:1}}}

            ]);


    // Convert array to a record (courseId -> count)
            const enrollmentStats = enrollments.reduce((acc,curr)=>{
                acc[curr._id.toString()] = curr.count;
                return acc;
            },{} as Record<string,number>)

            return enrollmentStats
        } catch (error){
            console.error("Error fetching tutor enrollments:", error);
            throw error    
        }
    }
    async getEnrolledCountPerCourse(courseId: string): Promise<number> {
        return this.count({courseId})
    }

    async getEnrolledStudents(tutorId: string): Promise<IEnrollment[] | null> {
        const enrollments = await this.aggregate([
            {
               $lookup:{
                from:"courses",
                localField:"courseId",
                foreignField:"_id",
                as:"course"
               } 
            },
            {
                $unwind:"$course"
            },
            {
                $match:{
                    "course.tutorId": new mongoose.Types.ObjectId(tutorId)
                },
            },
            {
                $lookup:{
                    from:"students",
                    localField:"studentId",
                    foreignField:"_id",
                    as:"student"
                }
            },
            {
                $unwind:"$student"
            }
        ])
        return enrollments;  
    }
}