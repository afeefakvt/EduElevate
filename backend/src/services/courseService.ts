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
                const result = await cloudinary.v2.uploader.upload(file.path,{
                    folder:"course_thumbnails",
                    resource_type:"auto"
                })
                courseData.thumbnail= result.secure_url;
            }else{
                console.log("No file received for upload");
            }
            const newCourse = await this.courseRepository.addCourse(courseData);
            return newCourse
            
        } catch (error) {
            throw new Error("Failed to add course. Please try again..");            
        }
    }

    async getCourses(search: string, category: string, sort: string, page: number, limit: number): Promise<{courses:ICourse[]; total:number}> {
        return await this.courseRepository.getCourses(search,category,sort,page,limit)
    }
    async getCourseDetails(courseId: string): Promise<ICourse> {
        const course = await this.courseRepository.getCourseDetails(courseId)

        if(!course){
            throw new Error (`Course with ID ${courseId} not found`);
        }
        return course
    }
    async listUnlistCourse(courseId: string,courseData:Partial<ICourse>): Promise<ICourse | null> {
        return await this.courseRepository.listUnlistCourse(courseId,courseData);
    }
    async editCourse(courseId: string, updatedData: Partial<ICourse>, file?: Express.Multer.File): Promise<ICourse | null> {
        try {
            if(file){
                const result = await cloudinary.v2.uploader.upload(file.path,{
                    folder:"course_thumbnails",
                    resource_type:"auto"
                })
                updatedData.thumbnail=result.secure_url
            }
            updatedData.isRequestedToEdit = true;  

            return await this.courseRepository.editCourse(courseId,updatedData,"pending")

        } catch (error) {
            throw new Error(`Error editing course: ${(error as Error).message}`);            
        }
    }
    async getBestSellingCourses(): Promise<ICourse[]> {
        return await this.courseRepository.getBestSellingCourses()
    }
    async fetchStatusCounts(): Promise<Record<string, number>> {
        return this.courseRepository.countByStatus();

        
    }

  
}