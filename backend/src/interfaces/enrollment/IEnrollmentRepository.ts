import { IEnrollment } from "../../models/enrollmentModel";

export interface IEnrollmentRepository{
    getEnrolledCoursesByStudent(id:string):Promise<IEnrollment[] | null>
}