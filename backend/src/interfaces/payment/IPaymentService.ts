import mongoose from "mongoose";
import { IPayment } from "../../models/paymentModel";

export interface IPaymentService{
    getPendingPayments():Promise<IPayment[]>
    settlePayment(paymentId:string):Promise<IPayment | null>;
    getPaymentHistory():Promise<IPayment[]>
    tutorsAmount(tutorId:string):Promise<IPayment[]>
    tutorTotal(tutorId:string):Promise<number>


}