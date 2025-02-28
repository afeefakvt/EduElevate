import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { ICourse } from "../models/courseModel";
import { IStudent } from "../models/studentModel";
import { ITutor } from "../models/tutorModel";

export class AdminService implements IAdminService {
    private adminRepository:IAdminRepository

    constructor(adminRepository:IAdminRepository){
        this.adminRepository = adminRepository
    }

    async getStudents():Promise<IStudent[]>{
        return this.adminRepository.getAllStudents();
    }
    async getTutors(): Promise<ITutor[]> {
        return this.adminRepository.getAllTutors();
        
    }
    async getTutorDetails(tutorId:string):Promise<ITutor>{
        const tutor =  await this.adminRepository.findTutorById(tutorId)
        if (!tutor) {
            throw new Error(`Tutor with ID ${tutorId} not found`);
          }
          return tutor
      
    }
    async findTutorById(tutorId:string):Promise<ITutor | null>{
         return this.adminRepository.findTutorById(tutorId)
    }

    async updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor | null>{
        return this.adminRepository.updateTutor(tutorId,tutorData)
    } 
    async updateStudent(studentId: string, studentData: Partial<IStudent>): Promise<IStudent | null> {
        return this.adminRepository.updateStudent(studentId,studentData)
    }
    async getAllCourseApplications(): Promise<ICourse[]> {
        return this.adminRepository.getAllCourseApplications()
    }
    async getCourseDetails(courseId: string): Promise<ICourse> {
        const course = await this.adminRepository.findCourseById(courseId)
        if(!course){
            throw new Error(`Course with ID ${courseId} not found`);
        }
        return course
    }
    async findCourseById(courseId: string): Promise<ICourse | null> {
        return this.adminRepository.findCourseById(courseId)
    }
    async getDashboardCounts(): Promise<{ courses: number; tutors: number; students: number; }> {
        return await this.adminRepository.getDashboardCounts()
    }
    
}