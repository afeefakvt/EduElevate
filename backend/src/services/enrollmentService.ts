import { IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { IEnrollment } from "../models/enrollmentModel";

export class EnrollmentService implements IEnrollmentService{
    private enrollmentRepository:IEnrollmentRepository

    constructor(enrollmentRepository:IEnrollmentRepository){
        this.enrollmentRepository = enrollmentRepository
    }
    async getEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null> {
        const enrolledCourses = await this.enrollmentRepository.getEnrolledCoursesByStudent(id);
        if(!enrolledCourses || enrolledCourses.length===0){
            throw new Error("No courses enrolled");
        }
        return enrolledCourses
    }
}