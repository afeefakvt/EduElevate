import { ICourse } from "../../models/courseModel";

export interface ICourseService{
    addCourse(courseData:Partial<ICourse>,file?:Express.Multer.File):Promise<ICourse | null>
    
}