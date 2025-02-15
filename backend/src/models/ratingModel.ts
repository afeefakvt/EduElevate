import mongoose,{Schema,Document, trusted} from "mongoose";

export interface IRating extends Document{
    courseId : mongoose.Types.ObjectId,
    studentId:mongoose.Types.ObjectId,
    rating:number,
    review:string
}

const RatingSchema:Schema = new Schema<IRating>(
    {
        courseId:{
            type:Schema.Types.ObjectId,
            ref:"Course",
            required:true
        },
        studentId:{
            type:Schema.Types.ObjectId,
            ref:"Student",
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        review:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

const Rating = mongoose.model<IRating>("Rating",RatingSchema);

export default Rating