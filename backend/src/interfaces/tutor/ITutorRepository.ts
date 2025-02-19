import { ICourse } from "../../models/courseModel";
import { ITutor } from "../../models/tutorModel";

export interface ITutorRepository{
    registerTutor(tutorData:ITutor):Promise<ITutor>
    findTutorByEmail(email:string):Promise<ITutor | null>;
    updatePassword(studentId:string,newPassword:string):Promise<ITutor | null>;
    getTutorCourses(tutorId:string):Promise<ICourse[]>;
    getTutorCourseDetails(courseId:string):Promise<ICourse | null>
    getTutorByEmail(email:string):Promise<ITutor | null>
   

} 