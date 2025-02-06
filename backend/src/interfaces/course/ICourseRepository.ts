import { ICourse } from "../../models/courseModel";

export interface ICourseRepository{
    addCourse(courseData:Partial<ICourse>):Promise<ICourse | null>
}