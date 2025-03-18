import mongoose,{Document,Schema} from "mongoose";

export interface IPayment extends Document{
    tutorId:mongoose.Types.ObjectId;
    courseId:mongoose.Types.ObjectId
    settlementPrice:number,
    settlementStatus:string,
    settlementDate:Date
    newEnrollments:number
}

const paymentSchema:Schema =new Schema(
    {
        tutorId:{
            type:Schema.Types.ObjectId,
            ref:"Tutor",
            required:true
        },
        courseId:{
            type:Schema.Types.ObjectId,
            ref:"Course",
            required:true
        },
        settlementPrice:{
            type:Number,
            required:true
        },
        settlementStatus:{
            type:String,
            enum:["pending","completed","failed"],
            default:"pending"
        },
        settlementDate:{
            type:Date,
            default:null
        },
        newEnrollments:{
            type:Number,
            default:0

        },
    },
    {timestamps:true}

) 
const Payment = mongoose.model<IPayment>("Payment",paymentSchema)

export default Payment