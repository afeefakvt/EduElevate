import { IStudent } from "../../models/studentModel";

export interface IStudentRepository{
    createStudent(studentData:Partial<IStudent>):Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null>;
    updatePassword(studentId:string,newPassword:string):Promise<IStudent | null>

}