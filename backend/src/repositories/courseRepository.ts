import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";

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
        return await this.findById(courseId).populate("lectures").populate("tutorId", "name").exec()

    }
    async listUnlistCourse(courseId: string,courseData:Partial<ICourse>): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,courseData)  
    }
    async editCourse(courseId: string, updatedData: Partial<ICourse>, status: string): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,{...updatedData,status})
    }

}