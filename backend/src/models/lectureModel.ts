import mongoose ,{Schema,Document} from "mongoose";

export interface ILecture extends Document{
    title:string,
    description:string,
    videoUrl:string,
    duration:string,
    order:number,
    courseId:mongoose.Types.ObjectId,
    isListed:boolean
}

const LectureSchems:Schema = new Schema<ILecture>(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videoUrl:{
            type:String,
            required:true
        },
        duration:{
            type:String,
            required:true
        },
        order:{
            type:Number,
            required:true
        },
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
            required:true
        },
        isListed:{
            type:Boolean,
            default:true
        }
    },
    {timestamps:true}
)

const Lecture= mongoose.model<ILecture>("Lecture",LectureSchems)

export default Lecture;