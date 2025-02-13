import { Schema,Document, mongo } from "mongoose";
import mongoose from "mongoose";


export interface IEnrollment extends Document {
    studentId:mongoose.Types.ObjectId;
    courseId:mongoose.Types.ObjectId;
    paymentStatus:string;
    paymentAmount:number;
}

const enrollmentSchema:Schema = new Schema<IEnrollment>(
    {
        studentId:{
            type:Schema.Types.ObjectId,
            ref:"Student",
            required:true
        },
        courseId:{
            type:Schema.Types.ObjectId,
            ref:"Course",
            required:true
        },
        paymentStatus:{
            type:String,
            enum:["pending","success","failed"],
            default:"pending"
        },
        paymentAmount:{
            type:Number,
            required:true

        }
    },
    {
        timestamps:true
    }
)

const Enrollment = mongoose.model<IEnrollment>('Enrollment',enrollmentSchema);
export default Enrollment;