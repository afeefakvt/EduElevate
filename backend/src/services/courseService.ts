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
            if(file && file.path){
                console.log("Uploading file to Cloudinary:", file.path);

                const result = await cloudinary.v2.uploader.upload(file.path,{
                    folder:"course_thumbnails",
                    resource_type:"auto"
                })
                courseData.thumbnail= result.secure_url;
            }else{
                console.log("No file received for upload");
            }
            const newCourse = await this.courseRepository.addCourse(courseData);

            // console.log(newCourse,"newwwwwwwww");
            return newCourse
            
        } catch (error) {
            throw new Error("Failed to add course. Please try again..");

            
        }
    }

    async getCourses(): Promise<ICourse[]> {
        return this.courseRepository.getCourses()
    }
    async getCourseDetails(courseId: string): Promise<ICourse> {
        const course = await this.courseRepository.getCourseDetails(courseId)

        if(!course){
            throw new Error (`Course with ID ${courseId} not found`);
        }
        return course
    }
    
  
}