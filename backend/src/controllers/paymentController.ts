import { Request,Response } from "express";
import { IPaymentService } from "../interfaces/payment/IPaymentService";
import { HTTP_STATUS } from "../constants/httpStatusCode";


export class PaymentController{
    constructor(
        private paymentService:IPaymentService
    ){}

    async getPendingPayments(req:Request,res:Response){
        try {
            const payments = await this.paymentService.getPendingPayments();
            res.status(HTTP_STATUS.OK).json(payments)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"Internal server error"})
            
        }
    }
    
    async settlePayment(req:Request,res:Response){
        try {
           const {paymentId} = req.params
           const payment = await this.paymentService.settlePayment(paymentId)
           if(!payment){
            res.status(HTTP_STATUS.NOT_FOUND).json({success:false,message:"Payment not found"})
            return;
           } 
           res.status(HTTP_STATUS.OK).json(payment)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
            
        }
    }
    async getPaymentHistory(req:Request,res:Response){
        try {            
            const payments = await this.paymentService.getPaymentHistory()            
            res.status(HTTP_STATUS.OK).json(payments)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"Internal server error"})
            
        }
    }
    async tutorAmount(req:Request,res:Response){
        try {
            const {tutorId} = req.params
            const tutorsAmount = await this.paymentService.tutorsAmount(tutorId)
            if(!tutorsAmount){
                res.status(HTTP_STATUS.NOT_FOUND).json("Tutor's amount not found")
                return;
            } 
            res.status(HTTP_STATUS.OK).json(tutorsAmount)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"Internal server error"})

            
        }
    }
    async tutorTotal(req:Request,res:Response){
        try {
            const {tutorId} = req.params;
            const total = await this.paymentService.tutorTotal(tutorId)
            // console.log(total,"tot");
            if(!total){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Tutor total not found"})
                return;
            }
            
            res.status(HTTP_STATUS.OK).json(total) 
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:"Internal server error"})
            
        }
    }
}