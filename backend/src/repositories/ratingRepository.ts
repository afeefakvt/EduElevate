import { IRatingRepository } from "../interfaces/rating/IRatingRepository";
import { ICourse } from "../models/courseModel";
import Rating, { IRating } from "../models/ratingModel";
import { BaseRepository } from "./baseRepository";

export class RatingRepository extends BaseRepository<IRating> implements IRatingRepository{
    constructor(){
        super(Rating)
    }

    async addRating(ratingData: Partial<IRating>): Promise<IRating | null> {
        return await this.create(ratingData)
    }
    async getCourseRatings(courseId: string): Promise<IRating[]> {
        return await this.find({courseId}).populate("courseId").exec()
    }
    async getMostRatedCourse(): Promise<ICourse | null> {
        const mostRated = await this.model
        .findOne({})
        .sort({ rating: -1 })
        .populate<{ courseId: ICourse }>('courseId')
        .exec();
    
      if (!mostRated || !mostRated.courseId) {
        return null; 
      }
    
      return mostRated.courseId;
      
        
    }
  
}