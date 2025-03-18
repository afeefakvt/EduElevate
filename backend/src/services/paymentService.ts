import { IPaymentService } from "../interfaces/payment/IPaymentService";
import { IPaymentRepository } from "../interfaces/payment/IPaymentRepository";
import { IPayment } from "../models/paymentModel";

export class PaymentService implements IPaymentService{
    private paymentRepository:IPaymentRepository

    constructor(paymentRepository:IPaymentRepository){
        this.paymentRepository = paymentRepository
    }

    async getPendingPayments(): Promise<IPayment[]> {
        return await this.paymentRepository.getPendingPayments()
    }
    async settlePayment(paymentId: string): Promise<IPayment | null> {
        return await this.paymentRepository.settlePayment(paymentId,"completed")
    }
    async getPaymentHistory(): Promise<IPayment[]> {
        return await this.paymentRepository.getPaymentHistory()
    }
    async tutorsAmount(tutorId: string): Promise<IPayment[]> {
        return await this.paymentRepository.tutorsAmount(tutorId)
    }
    async tutorTotal(tutorId: string): Promise<number> {
        return await this.paymentRepository.tutorTotal(tutorId)
    }
}