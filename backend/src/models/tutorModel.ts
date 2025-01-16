import mongoose,{Schema,Document} from "mongoose";

export interface ITutor extends Document{
    name:string,
    email:string,
    password:string,
    isBlocked:Boolean,
    title:string,
    bio:string
}

const TutorSchema:Schema  = new Schema<ITutor>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        bio:{
            type:String,
            required:true
        },
        isBlocked:{
            type:Boolean,
            default:false
        }
    }
)
const Tutor = mongoose.model<ITutor>('Tutor',TutorSchema)

export default Tutor