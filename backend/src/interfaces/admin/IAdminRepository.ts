import { IStudent } from "../../models/studentModel";

export interface IAdminRepository{
    getAllStudents():Promise<IStudent[]>
    
}