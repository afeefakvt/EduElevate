import { IStudent } from "../../models/studentModel"
import { ITutor } from "../../models/tutorModel"


export interface IAdminService{
    getStudents():Promise<IStudent[]>
    getTutors():Promise<ITutor[]>
    getTutorDetails(tutorId:string):Promise<ITutor>;
    updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor | null>;

}