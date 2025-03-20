import mongoose, { Types } from "mongoose";
import  {IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import Course from "../models/courseModel";
import Enrollment,{IEnrollment} from "../models/enrollmentModel";
import { BaseRepository } from "./baseRepository";
import { ICourse } from "../models/courseModel";

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
    async  getFeaturedCourse(): Promise<ICourse[]> {
        return this.aggregate([
            {
                $group:{
                    _id:"$courseId",
                    count:{$sum:1}
                }
            },
            {
                $lookup:{
                    from:"courses",
                    localField:"_id",
                    foreignField:"_id",
                    as:"course"
                }
            },
            {
                $unwind:"$course"
            },
            {
                $lookup: {
                  from: "categories",
                  localField: "course.categoryId",
                  foreignField: "_id",
                  as: "category"
                }
              },
              {
                $unwind: "$category"
              },
            {

                $project:{
                    id:"$course._id",
                    title:"$course.title",
                    tutorId:"$course.tutorId",
                    price:"$course.price",
                    description:"$course.description",
                    categoryName:"$category.name",
                    thumbnail:"$course.thumbnail",
                    count:1
                }
            },
            {$sort:{count:-1}},
            {$limit:1}
        ])
        
    }

    async getSalesReport(timeRange: string, startDate?: string, endDate?: string): Promise<any> {
        const matchStage:any = {paymentStatus:"success"}
        const today =new Date()

        if(timeRange==='daily'){
            const thirtDaysAgo = new Date();
            thirtDaysAgo.setDate(today.getDate()-30)
            matchStage["createdAt"] = {$gte:thirtDaysAgo}
        }else if(timeRange==='monthly'){
            const startOfYear = new Date(today.getFullYear(),0,1)
            matchStage["createdAt"] = {$gte:startOfYear}
        }else if(timeRange==="yearly"){
            const startOfAllTime = new Date("2000-01-01")
            matchStage["createdAt"] = {$gte:startOfAllTime}
        }else if(timeRange==="custom" && startDate && endDate){
            matchStage["createdAt"] = {
                $gte:new Date(startDate),
                $lte:new Date(endDate)

            }
        }

        let dateFormat = "%Y-%m-%d";
        if(timeRange==="monthly") dateFormat = "%Y-%m";
        if(timeRange==="yearly") dateFormat = "%Y";

        return await this.aggregate([
            {$match:matchStage},
            {
                $group:{
                    _id:{$dateToString:{format:dateFormat, date:"$createdAt"}},
                    totalRevenue:{$sum:"$paymentAmount"}
                }
            },
            {$sort:{_id:1}}
        ])

    }
    async getTotalRevenue(): Promise<number> {
        const totalRevenue = await this.aggregate([
            {
                $match:{
                    paymentStatus:"success"
                },
            },
            {
                $group:{
                    _id:null,
                    totalAmount:{$sum:"$paymentAmount"}
                }
            }
        ]);
        return totalRevenue[0]?.totalAmount || 0
    }
}