import { Request,Response } from "express";
import { IPaymentService } from "../interfaces/payment/IPaymentService";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { MESSAGES } from "../constants/message";


export class PaymentController{
    constructor(
        private paymentService:IPaymentService
    ){}

    async getPendingPayments(req:Request,res:Response){
        try {
            const payments = await this.paymentService.getPendingPayments();
            res.status(HTTP_STATUS.OK).json(payments)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
    
    async settlePayment(req:Request,res:Response){
        try {
           const {paymentId} = req.params
           const payment = await this.paymentService.settlePayment(paymentId)
           if(!payment){
            res.status(HTTP_STATUS.NOT_FOUND).json({success:false,message:MESSAGES.PAYMENT_NOT_FOUND})
            return;
           } 
           res.status(HTTP_STATUS.OK).json(payment)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
    async getPaymentHistory(req:Request,res:Response){
        try {            
            const payments = await this.paymentService.getPaymentHistory()            
            res.status(HTTP_STATUS.OK).json(payments)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
    async tutorAmount(req:Request,res:Response){
        try {
            const {tutorId} = req.params
            const tutorsAmount = await this.paymentService.tutorsAmount(tutorId)
            if(!tutorsAmount){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.TUTOR_AMOUNT_NOT_FOUND})
                return;
            } 
            res.status(HTTP_STATUS.OK).json(tutorsAmount)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR})

            
        }
    }
    async tutorTotal(req:Request,res:Response){
        try {
            const {tutorId} = req.params;
            const total = await this.paymentService.tutorTotal(tutorId)
            if(!total){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.TUTOR_TOTAL_NOT_FOUND})
                return;
            }
            
            res.status(HTTP_STATUS.OK).json(total) 
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({success:false,message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
}