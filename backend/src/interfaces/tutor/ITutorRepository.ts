import { ICourse } from "../../models/courseModel";
import { ITutor } from "../../models/tutorModel";

export interface ITutorRepository{
    registerTutor(tutorData:ITutor):Promise<ITutor>
    findTutorByEmail(email:string):Promise<ITutor | null>;
    updatePassword(studentId:string,newPassword:string):Promise<ITutor | null>;
    getTutorCourses(tutorId:string,search:string,category:string,sort:string,page:number,limit:number):Promise<{courses:ICourse[]; total:number}>;
    getTutorCourseDetails(courseId:string):Promise<ICourse | null>
    getTutorByEmail(email:string):Promise<ITutor | null>;
    editTutorProfile(id:string,data:Partial<ITutor>):Promise<ITutor | null>
    getTutorById(id:string):Promise<ITutor | null>;
    changeTutorPassword(tutorId:string,data:{password:string}):Promise<ITutor | null>
    getApprovedCount(tutorId:string):Promise<number>
    getPendingCount(tutorId:string):Promise<number>
   

} 