import { IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { IEnrollment } from "../models/enrollmentModel";
import { ICourse } from "../models/courseModel";

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
    async getTutorEnrollmentStats(tutorId: string): Promise<Record<string, number>> {
        return await this.enrollmentRepository.getTutorEnrollments(tutorId)
    }
    async getEnrolledCountPerCourse(courseId: string): Promise<number> {
        return await this.enrollmentRepository.getEnrolledCountPerCourse(courseId)
    }
    async getEnrolledStudents(tutorId: string): Promise<IEnrollment[] | null> {
        return await this.enrollmentRepository.getEnrolledStudents(tutorId)
    }
    async getFeaturedCourse(): Promise<ICourse[]> {
        return await this.enrollmentRepository.getFeaturedCourse()
    }
    async getSalesReport(timeRange: string, startDate?: string, endDate?: string): Promise<any> {
        return await this.enrollmentRepository.getSalesReport(timeRange,startDate,endDate)
    }
}