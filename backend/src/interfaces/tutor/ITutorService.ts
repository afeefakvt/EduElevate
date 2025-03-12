import { ICourse } from "../../models/courseModel";
import { ITutor } from "../../models/tutorModel";

export interface ITutorService{
    registerTutor(tutorData:ITutor):Promise<ITutor>;
    verifyOtp(email:string,otp:string):Promise<boolean>;
    loginTutor(email:string,password:string):Promise<{
        token:string,
        refreshToken:string,
        tutor:ITutor
    }>;
    findTutorByEmail(email:string):Promise<ITutor | null>
    handleForgotPassword(email:string):Promise<string | null>;
    updatePassword(studentId:string,newPassword:string):Promise<ITutor | null>
    getTutorCourses(tutorId:string,search:string,category:string,sort:string,page:number,limit:number):Promise<{courses:ICourse[],total:number}>
    getTutorCourseDetails(courseId:string):Promise<ICourse | null>
    editTutorProfile(tutorId:string,data:Partial<ITutor>):Promise<ITutor | null>;
    changeTutorPassword(tutorId:string,currentPassword:string,newPassword:string):Promise<ITutor | null>
    getApprovedCount(tutorId:string):Promise<number>
    getPendingCount(tutorId:string):Promise<number>
}