import { Model } from "mongoose";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";
import bcrypt from 'bcryptjs'
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";


export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository{

        constructor(){
            super(Tutor)
      }
    async registerTutor(tutorData: ITutor): Promise<ITutor> {
        return await this.create(tutorData)
    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return await this.findOne({email})
    }
     async updatePassword(studentId: string, newPassword: string): Promise<ITutor | null> {
            const hashedPassword = await bcrypt.hash(newPassword,10)
            return await this.findByIdAndUpdate(studentId,{password:hashedPassword});
        }
    async getTutorCourses(tutorId: string,search:string,category:string,sort:string,page:number,limit:number): Promise<{courses:ICourse[]; total:number}> {
        const filter:any = {
            tutorId,
            status: { $in: ["approved", "rejected"] }
          };
          if(search){
            filter.title = {$regex:search, $options:"i"};
        }
        if (category !== "all") {
            filter.categoryId = category;
          }
        
        let sortOption:any = {}
        switch(sort){
            case 'priceAsc':
                sortOption.price = 1;
                break;
            case "priceDesc":
                sortOption.price  =-1
                break;
            case "ratingAsc":
                sortOption.averageRating = 1
                break;
            case "ratingDesc":
                sortOption.averageRating = -1
                break;
            default:
                sortOption = {}
                break;
        }
        const skip = (page - 1) * limit;

        const total = await Course.countDocuments(filter)
        const courses = await Course.find(filter).populate('categoryId', 'name').populate('tutorId', 'name')
            .sort(sortOption).skip(skip).limit(limit).exec();

            
//   console.log("Filter being used:", filter);
//   console.log("Courses fetched:", courses);
            
        return {courses,total}


    }
    async getTutorCourseDetails(courseId: string): Promise<ICourse | null> {
        return await Course.findById(courseId).populate("lectures").populate("tutorId")
    }
    async getTutorByEmail(email: string): Promise<ITutor | null> {
        return await this.findByEmail(email)
    }

    async getTutorById(id: string): Promise<ITutor | null> {
        return await this.findById(id);    
    }
    async editTutorProfile(id: string, data: Partial<ITutor>): Promise<ITutor | null> {
        return await this.findByIdAndUpdate(id,data)
    }
    async changeTutorPassword(tutorId: string, data: { password: string; }): Promise<ITutor | null> {
        return await this.findByIdAndUpdate(tutorId,{password:data.password})
    }

    async getApprovedCount(tutorId: string): Promise<number> {
        const count = await Course.countDocuments({tutorId,status:"approved",isListed:true})
        return count
    }
    async getPendingCount(tutorId: string): Promise<number> {
        const count = await Course.countDocuments({tutorId,status:"pending"})
        return count
    }

}