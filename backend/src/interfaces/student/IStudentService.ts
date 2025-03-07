import { IStudent}  from "../../models/studentModel";

export interface IStudentService{
    createStudent(studentData:Partial<IStudent>):Promise<IStudent>;
    verifyOtp(email:string,otp:string):Promise<boolean>;
    loginStudent(email:string,password:string):Promise<{
        token:string,
        refreshToken:string,
        student:IStudent
    }>;
    findStudentByEmail(email:string):Promise<IStudent | null>;
    handleForgotPassword(email:string):Promise<string | null>;
    updatePassword(studentId:string,newPassword:string):Promise<IStudent | null>;
    getCourseById(courseId:string):Promise<IStudent | null>
    loginAdmin(email:string,password:string):Promise<{token:string,refreshToken:string,student:IStudent}>
    editProfile(id:string,data:Partial<IStudent>):Promise<IStudent | null>
    changePassword(studentId:string,currentPassword:string,newPassword:string):Promise<IStudent | null>
    getStudentById(studentId:string):Promise<IStudent | null>
}