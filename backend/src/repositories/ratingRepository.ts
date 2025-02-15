import { IRatingRepository } from "../interfaces/rating/IRatingRepository";
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
        return await this.find({courseId});
    }
  
}