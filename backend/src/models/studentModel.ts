import mongoose, {Schema,Document} from "mongoose";

export interface IStudent extends Document{
    name:string,
    email:string,
    password:string,
    role:string,
    isBlocked:Boolean,
    createdAt:Date,
    updatedAt:Date

}

const StudentSchema:Schema = new Schema<IStudent>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:['student','admin'],
            default:'student'
        },
        isBlocked:{
            type:Boolean,
            default:false
        }

    },{
        timestamps:true
    }
)
export const Student = mongoose.model<IStudent>("Student",StudentSchema);

