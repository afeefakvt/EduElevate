import { IStudent}  from "../../models/studentModel";

export interface IStudentService{
    createStudent(studentData:Partial<IStudent>):Promise<IStudent>;
    verifyOtp(email:string,otp:string):Promise<boolean>;
    loginStudent(email:string,password:string):Promise<{
        token:string,
        student:IStudent
    }>;
    findStudentByEmail(email:string):Promise<IStudent | null>
}