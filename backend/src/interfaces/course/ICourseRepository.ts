import { ICourse } from "../../models/courseModel";

export interface ICourseRepository{
    addCourse(courseData:Partial<ICourse>):Promise<ICourse | null>
    getCourses():Promise<ICourse[]>
    getCourseDetails(courseId:string):Promise<ICourse | null>;
    deleteCourse(courseId:string):Promise<ICourse | null>;
    editCourse(courseId:string,updatedData:Partial<ICourse>,status:string):Promise<ICourse | null>

    
}