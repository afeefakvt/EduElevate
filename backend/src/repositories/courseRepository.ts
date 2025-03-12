import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { BaseRepository } from "./baseRepository";
import Course, { ICourse } from "../models/courseModel";
import Enrollment from "../models/enrollmentModel";

export class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository {
    constructor() {
        super(Course)
    }
    async addCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
        return await this.create(courseData)

    }
    async getCourses(search:string,category:string,sort:string,page:number,limit:number): Promise<{courses:ICourse[]; total:number}> {
        const filter:any = {
            status:"approved",
            isListed:true,
        };
        if(search){
            filter.title = {$regex:search, $options:"i"};
        }
        if(category!=="all"){
            filter.categoryId = category
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
        const skip = (page-1)*limit
        const total = await this.count(filter)
        const courses = await this.find(filter).populate('categoryId', 'name').populate('tutorId', 'name')
            .sort(sortOption).skip(skip).limit(limit).exec();

        return {courses,total}

    }
    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        return await this.findById(courseId).populate("lectures").populate("tutorId").exec()

    }
    async listUnlistCourse(courseId: string,courseData:Partial<ICourse>): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,courseData)  
    }
    async editCourse(courseId: string, updatedData: Partial<ICourse>, status: string): Promise<ICourse | null> {
        return await this.findByIdAndUpdate(courseId,{...updatedData,status})
    }
    async getBestSellingCourses(): Promise<ICourse[]> {
        return Enrollment.aggregate([
            {
                $group:{
                    _id:"$courseId",
                    count:{$sum:1}
                }
            },
            {
                $lookup:{
                    from:"courses",
                    localField:"_id",
                    foreignField:"_id",
                    as:"course"
                }
            },
            {
                $unwind:"$course"
            },
            {
                $project:{
                    id:"$course._id",
                    title:"$course.title",
                    tutorId:"$course.tutorId",
                    price:"$course.price",
                    description:"$course.description",
                    thumbnail:"$course.thumbnail",
                    count:1
                }
            },
            {$sort:{count:-1}},
            {$limit:4}
        ])    
    }

    async countByStatus(): Promise<Record<string, number>> {
        const pipeline = [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ];
        const result: { _id: string; count: number }[] = await this.aggregate(pipeline);
        return result.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {} as Record<string, number>);
      }

}