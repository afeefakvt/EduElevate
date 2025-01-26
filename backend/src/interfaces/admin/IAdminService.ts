import { IStudent } from "../../models/studentModel"
export interface IAdminService{
    getStudents():Promise<IStudent[]>

}