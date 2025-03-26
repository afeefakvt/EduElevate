import { IPaymentRepository } from "../interfaces/payment/IPaymentRepository";
import  Payment,{IPayment } from "../models/paymentModel";
import { BaseRepository } from "./baseRepository";
import mongoose from "mongoose";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository{
    constructor(){
        super(Payment)
    }
    async getPendingPayments(): Promise<IPayment[]> {
        const result = await this.find({settlementStatus:"pending"})
        .populate({path:"tutorId",select:"name"})
        .populate({path:"courseId",select:"title price"})
        return result
        
    }
    async settlePayment(paymentId: string,settlementStatus:string): Promise<IPayment | null> {
        const updateFields:Partial<IPayment> = {settlementStatus}
        if(settlementStatus==="completed"){
            updateFields.settlementDate = new Date()

        }
        return await this.findByIdAndUpdate(paymentId,updateFields)
    }

    async getPaymentHistory(): Promise<IPayment[]> {
        
        const result = await this.find({settlementStatus:{$nin:"pending"}})
        .populate({path:"tutorId",select:"name"})
        .populate({path:"courseId",select:"title price"})        
        return result
        
    }
    async tutorsAmount(tutorId: string): Promise<IPayment[]> {
        return await this.find({tutorId}).populate({path:"courseId", select:"title price"})
    }
    async tutorTotal(tutorId: string): Promise<number> {
        const result = await this.aggregate([
                {
                    $match:{
                        tutorId:new mongoose.Types.ObjectId(tutorId),
                        settlementStatus:"completed"
                    },

                },
                {
                    $group: {
                      _id: null,
                      total: { $sum: "$settlementPrice" },
                    },
                  }
        ]);
        
        return result.length > 0 ? result[0].total : 0;

    }
}