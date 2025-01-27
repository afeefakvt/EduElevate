import { IStudent } from "../../models/studentModel"
import { ITutor } from "../../models/tutorModel"


export interface IAdminService{
    getStudents():Promise<IStudent[]>
    getTutors():Promise<ITutor[]>

}