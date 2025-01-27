import mongoose,{Schema,Document} from "mongoose";

export interface ICourse extends Document{
    title:String,
    categoryId:mongoose.Types.ObjectId,
    tutorId:mongoose.Types.ObjectId,
    description:String,
    price:Number,
    thumbnail:String,
    language:String,
    duration:Number,
    level:String,
    status:String,
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
            required:true,
            enum:['web development','mobile development','game development',' AI and ML'],
            default:'web development'

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
        }

    },
    {
        timestamps:true
    }
)
const Course = mongoose.model<ICourse>('Course',CourseSchema)

export default Course