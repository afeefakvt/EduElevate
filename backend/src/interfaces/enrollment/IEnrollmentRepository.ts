import { IEnrollment } from "../../models/enrollmentModel";

export interface IEnrollmentRepository{
    getEnrolledCoursesByStudent(id:string):Promise<IEnrollment[] | null>
    getTutorEnrollments(tutorId:string):Promise<Record<string,number>>;
    getEnrolledCountPerCourse(courseId:string):Promise<number>
    getEnrolledStudents(tutorId:string):Promise<IEnrollment[] | null>

}