import { IRatingRepository } from "../interfaces/rating/IRatingRepository";
import { IRatingService } from "../interfaces/rating/IRatingService";
import { IRating } from "../models/ratingModel";
import { RatingRepository } from "../repositories/ratingRepository";


export class RatingService implements IRatingService{
    private ratingRepository:IRatingRepository

    constructor(ratingRepository:RatingRepository){
        this.ratingRepository = ratingRepository
    }

    async addRating(ratingData: Partial<IRating>): Promise<IRating | null> {
        return await this.ratingRepository.addRating(ratingData)
    }
    async getCourseRatings(courseId: string): Promise<{ ratings: IRating[], average: number }> {
        const ratings = await this.ratingRepository.getCourseRatings(courseId);
        
        const total = ratings.reduce((sum, r) => sum + r.rating, 0);
        const average = ratings.length > 0 ? total / ratings.length : 0;
    
        return { ratings, average };
    }
    
}