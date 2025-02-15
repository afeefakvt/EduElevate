import { IRating } from "../../models/ratingModel";

export interface IRatingService{
    addRating(ratingData: Partial<IRating>):Promise<IRating | null>
    getCourseRatings(courseId:string):Promise<{ratings:IRating[],average:number}>
    
}