import { ICourse } from "../../models/courseModel";
import { ILecture } from "../../models/lectureModel";

export interface ICourseService{
    addCourse(courseData:Partial<ICourse>,file?:Express.Multer.File):Promise<ICourse | null>
    
}