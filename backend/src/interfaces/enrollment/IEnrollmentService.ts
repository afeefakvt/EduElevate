import { IEnrollment } from "../../models/enrollmentModel";

export interface IEnrollmentService{
    getEnrolledCoursesByStudent(id:string):Promise<IEnrollment[] | null>
}