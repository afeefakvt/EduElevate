import { ICourseService } from "../interfaces/course/ICourseService";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { ICourse } from "../models/courseModel";
import { cloudinary } from "../config/cloudinary";

export class CourseService implements ICourseService{
    private courseRepository: ICourseRepository

    constructor(courseRepository:ICourseRepository){
        this.courseRepository = courseRepository
    }

    async addCourse(courseData: Partial<ICourse>, file?: Express.Multer.File): Promise<ICourse | null> {
        try {
            if(file){
                const result = await cloudinary.v2.uploader.upload(file.path,{
                    folder:"course_thumbnails",
                    resource_type:"auto"
                })
                courseData.thumbnail= result.secure_url;
            }
            const newCourse = await this.courseRepository.addCourse(courseData);
            return newCourse
            
        } catch (error) {
            throw new Error("Failed to add course. Please try again..");

            
        }
    }
  
}