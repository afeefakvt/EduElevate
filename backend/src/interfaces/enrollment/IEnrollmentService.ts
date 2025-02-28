import { IEnrollment } from "../../models/enrollmentModel";

export interface IEnrollmentService{
    getEnrolledCoursesByStudent(id:string):Promise<IEnrollment[] | null>;
    getTutorEnrollmentStats(tutorId:string):Promise<Record<string,number>>;
    getEnrolledCountPerCourse(courseId:string):Promise<number>
    
}