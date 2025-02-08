import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { BaseRepository } from "./baseRepository";
import Course,{ICourse} from "../models/courseModel";

export class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository{
    constructor(){
        super(Course)
    }
    async addCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
        const aff =  await this.create(courseData)
        console.log(aff)
        return aff
    }
}