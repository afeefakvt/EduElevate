import { ICourse } from "../../models/courseModel";

export interface ICourseRepository{
    addCourse(courseData:Partial<ICourse>):Promise<ICourse | null>
    getCourses():Promise<ICourse[]>
    getCourseDetails(courseId:string):Promise<ICourse | null>
    
}