import { IStudent}  from "../../models/studentModel";

export interface IStudentService{
    createStudent(studentData:Partial<IStudent>):Promise<IStudent>
}