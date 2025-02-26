import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";
import Enrollment from "../models/enrollmentModel";

export class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository {
    constructor() {
        super(Course)
    }
    async addCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
        return await this.create(courseData)

    }
    async getCourses(): Promise<ICourse[]> {
        return await this.find({}).populate("categoryId", "name").populate("tutorId", "name").exec();
    }
    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        return await this.findById(courseId).populate("lectures").populate("tutorId").exec()

    }
    async listUnlistCourse(courseId: string,courseData:Partial<ICourse>): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,courseData)  
    }
    async editCourse(courseId: string, updatedData: Partial<ICourse>, status: string): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,{...updatedData,status})
    }
    async getBestSellingCourses(): Promise<ICourse[]> {
        return Enrollment.aggregate([
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
                $project:{
                    id:"$course._id",
                    title:"$course.title",
                    tutorId:"$course.tutorId",
                    price:"$course.price",
                    description:"$course.description",
                    thumbnail:"$course.thumbnail",
                    count:1
                }
            },
            {$sort:{count:-1}},
            {$limit:4}
        ])    
    }

}