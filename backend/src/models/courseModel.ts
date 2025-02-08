import mongoose,{Schema,Document} from "mongoose";

export interface ICourse extends Document{
    title:String,
    categoryId:mongoose.Types.ObjectId,
    tutorId:mongoose.Types.ObjectId,
    description:String,
    price:number,
    thumbnail:String,
    language:String,
    duration:number,
    level:String,
    status:String,
    isApproved:Boolean,
    // lectures:mongoose.Types.ObjectId[]
    createdAt:Date,
    updatedAt:Date

}

const CourseSchema:Schema = new Schema<ICourse>(
    {
        title:{
            type:String,
            required:true,
        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Category"

        },
        tutorId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Tutor'
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        thumbnail:{
            type:String,

        },
        language:{
            type:String,
            required:true
        },
        duration:{
            type:Number
        },
        level:{
            type:String,
            enum:["beginner","intermediate","advanced"],
            default:"intermediate"
        },
        status:{
            type:String,
            enum:["pending","approved","rejected"],
            default:"pending"
        },
        isApproved:{
            type:Boolean,
            default:false
        },
        // lectures:[
        //     {
        //         type:mongoose.Schema.Types.ObjectId,
        //         ref:"Lecture",
        //         default:[]
        //     }
        // ]

    },
    {
        timestamps:true
    }
)
const Course = mongoose.model<ICourse>('Course',CourseSchema)

export default Course