import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IAdminService } from "../interfaces/admin/IAdminService";
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
}