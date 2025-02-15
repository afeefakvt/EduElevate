import { ICourse } from "../../models/courseModel";
import { ITutor } from "../../models/tutorModel";

export interface ITutorService{
    registerTutor(tutorData:ITutor):Promise<ITutor>;
    verifyOtp(email:string,otp:string):Promise<boolean>;
    loginTutor(email:string,password:string):Promise<{
        token:string,
        tutor:ITutor
    }>;
    findTutorByEmail(email:string):Promise<ITutor | null>
    handleForgotPassword(email:string):Promise<string | null>;
    updatePassword(studentId:string,newPassword:string):Promise<ITutor | null>
    getTutorCourses(tutorId:string):Promise<ICourse[]>
    getTutorCourseDetails(courseId:string):Promise<ICourse | null>
}