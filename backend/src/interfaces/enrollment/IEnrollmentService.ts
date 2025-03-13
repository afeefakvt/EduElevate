import { IEnrollment } from "../../models/enrollmentModel";
import { ICourse } from "../../models/courseModel";

export interface IEnrollmentService{
    getEnrolledCoursesByStudent(id:string):Promise<IEnrollment[] | null>;
    getTutorEnrollmentStats(tutorId:string):Promise<Record<string,number>>;
    getEnrolledCountPerCourse(courseId:string):Promise<number>
    getEnrolledStudents(tutorId:string):Promise<IEnrollment[] | null>
    getFeaturedCourse():Promise<ICourse[]>
    getSalesReport(timeRange:string,startDate?:string,endDate?:string):Promise<any>
    
    
}