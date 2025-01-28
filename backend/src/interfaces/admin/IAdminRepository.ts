import { IStudent } from "../../models/studentModel";
import { ITutor } from "../../models/tutorModel";

export interface IAdminRepository{
    getAllStudents():Promise<IStudent[]>
    getAllTutors():Promise<ITutor[]>;
    findTutorById(id:String):Promise<ITutor | null>
    
    
}