import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { IStudent } from "../models/studentModel";

export class AdminService implements IAdminService {
    private adminRepository:IAdminRepository

    constructor(adminRepository:IAdminRepository){
        this.adminRepository = adminRepository
    }

    async getStudents(){
        return this.adminRepository.getAllStudents();
    }
}