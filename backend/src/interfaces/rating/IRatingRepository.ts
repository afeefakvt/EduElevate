import { ICourse } from "../../models/courseModel";
import { IRating } from "../../models/ratingModel";

export interface IRatingRepository{
    addRating(ratingData:Partial<IRating>):Promise<IRating | null>;
    getCourseRatings(courseId:string):Promise<IRating[]>;
    getMostRatedCourse():Promise<ICourse | null>
    
    
}