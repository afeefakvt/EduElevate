import { ICourse } from "../../models/courseModel";

export interface ICourseService{
    addCourse(courseData:Partial<ICourse>,file?:Express.Multer.File):Promise<ICourse | null>
    getCourses():Promise<ICourse[]>
    getCourseDetails(courseId:string):Promise<ICourse>;
    listUnlistCourse(courseId:string,courseData:Partial<ICourse>):Promise<ICourse | null>
    editCourse(courseId:string,updatedData:Partial<ICourse>,file?:Express.Multer.File):Promise<ICourse | null>
    getBestSellingCourses():Promise<ICourse[]>
    
    
}