import  {IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import Enrollment,{IEnrollment} from "../models/enrollmentModel";
import { BaseRepository } from "./baseRepository";

export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository{
    constructor(){
        super(Enrollment)
    }

    async getEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null> {
        return await this.find({studentId:id}).populate({path:"courseId",populate:
            [{path:"tutorId",select:"name"},
            {path:"categoryId",select:"name"}
            ]
        })
        .exec();
        
    }
}