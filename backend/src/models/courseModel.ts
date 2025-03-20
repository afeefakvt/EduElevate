import mongoose,{Schema,Document} from "mongoose";

export interface ICourse extends Document{
    title:string,
    categoryId:mongoose.Types.ObjectId,
    tutorId:mongoose.Types.ObjectId | {_id:mongoose.Types.ObjectId; email:string;}
    description:string,
    price:number,
    thumbnail:string,
    language:string,
    duration:string,
    level:string,
    status:string,
    isApproved:boolean,
    isListed:boolean,
    isRequestedToEdit:boolean,
    rejectReason:string,
    lectures:mongoose.Types.ObjectId[]
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
            required:true

        },
        language:{
            type:String,
            enum:["english","malayalam"],
            default:"english"
        },
        duration:{
            type:String
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
        isListed:{
            type:Boolean,
            default:true

        },
        isRequestedToEdit:{
            type:Boolean,
            default:false
        },
        rejectReason:{
            type:String,
            default:""
        },
        lectures:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Lecture",
                default:[]
            }
        ]

    },
    {
        timestamps:true
    }
)
const Course = mongoose.model<ICourse>('Course',CourseSchema)

export default Course