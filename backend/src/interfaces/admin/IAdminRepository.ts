import { ICourse } from "../../models/courseModel";
import { IStudent } from "../../models/studentModel";
import { ITutor } from "../../models/tutorModel";

export interface IAdminRepository{
    getAllStudents():Promise<IStudent[]>
    getAllTutors():Promise<ITutor[]>;
    findTutorById(id:String):Promise<ITutor | null>
    updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor | null>
    updateStudent(studentId:string,studentData:Partial<IStudent>):Promise<IStudent | null>
    getAllCourseApplications():Promise<ICourse[]>
    findCourseById(courseId:string):Promise<ICourse | null>
    getDashboardCounts():Promise<{courses:number; tutors:number; students:number}>

    
    
}