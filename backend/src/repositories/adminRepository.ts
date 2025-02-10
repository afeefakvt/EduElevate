import { Model } from "mongoose";
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IStudent, Student } from "../models/studentModel";
import Tutor, { ITutor } from "../models/tutorModel";
import { TutorRepository } from "./tutorRepository";
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";

export class AdminRepository  implements IAdminRepository{

    // private tutorRepository:BaseRepository<ITutor>
    // private  courseRepository:BaseRepository<ICourse>
    // constructor(){
    //     super(Student)
    //     this.tutorRepository = new  BaseRepository<ITutor>(Tutor) //injecting baserepository for tutors
    //     this.courseRepository   = new BaseRepository<ICourse>(Course)
        
    // }
    
    private studentRepository: BaseRepository<IStudent>;
    private tutorRepository: BaseRepository<ITutor>;
    private courseRepository: BaseRepository<ICourse>;

    constructor() {
        this.studentRepository = new BaseRepository<IStudent>(Student); 
        this.tutorRepository = new BaseRepository<ITutor>(Tutor);
        this.courseRepository = new BaseRepository<ICourse>(Course);
    }

    async getAllStudents():Promise<IStudent[]>{
        return await this.studentRepository.find({role:"student"})
    } 
    async getAllTutors():Promise<ITutor[]>{
        return await this.tutorRepository.find({})
    }
    async findTutorById(id: string): Promise<ITutor | null> {
        return await this.tutorRepository.findById(id)
    }
    async updateTutor(tutorId:string,tutorData:Partial<ITutor>):Promise<ITutor |null >{
        return await this.tutorRepository.findByIdAndUpdate(tutorId,tutorData);
    }
    async updateStudent(studentId: string, studentData: Partial<IStudent>): Promise<IStudent | null> {
        return await this.studentRepository.findByIdAndUpdate(studentId,studentData)
    }
    async getAllCourseApplications() {
        return this.courseRepository.find({}).populate("categoryId","name").populate("tutorId","name").exec();
    }
    async findCourseById(courseId: string): Promise<ICourse | null> {
        return await this.courseRepository.findById(courseId).populate("lectures").populate("tutorId","email").exec()
    }

}