import { ICourse } from "../../models/courseModel";
import { IStudent } from "../../models/studentModel";

export interface IStudentRepository{
    createStudent(studentData:Partial<IStudent>):Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null>;
    updatePassword(studentId:string,newPassword:string):Promise<IStudent | null>
    getCourseById(courseId:string):Promise<IStudent | null>
    getStudentByEmail(email:string):Promise<IStudent | null>
    editProfile(id:string,data:Partial<IStudent>):Promise<IStudent | null>
    findStudentById(id:string):Promise<IStudent | null>;
    changePassword(studentId:string,data:{password:string}):Promise<IStudent | null>

}