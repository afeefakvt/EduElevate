import { IEnrollment } from "../../models/enrollmentModel";
import { ICourse } from "../../models/courseModel";

export interface IEnrollmentRepository{
    getEnrolledCoursesByStudent(studentId:string):Promise<IEnrollment[] | null>
    getTutorEnrollments(tutorId:string):Promise<Record<string,number>>;
    getEnrolledCountPerCourse(courseId:string):Promise<number>
    getEnrolledStudents(tutorId:string):Promise<IEnrollment[] | null>
    getFeaturedCourse():Promise<ICourse[]>
    

}