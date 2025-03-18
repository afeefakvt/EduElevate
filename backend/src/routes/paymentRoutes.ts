import { Router } from "express";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";
import { PaymentRepository } from "../repositories/paymentRepository";
import { PaymentService } from "../services/paymentService";
import { PaymentController } from "../controllers/paymentController";
const paymentRoutes =   Router()


const paymentRepository = new PaymentRepository()
const paymentService = new PaymentService(paymentRepository)
const paymentController = new PaymentController(paymentService)


paymentRoutes.get('/payments/pending',authenticateToken,authorizeRoles(["admin"]),paymentController.getPendingPayments.bind(paymentController))
paymentRoutes.put('/payments/:paymentId',authenticateToken,authorizeRoles(["admin"]),paymentController.settlePayment.bind(paymentController))
paymentRoutes.get('/payments/history',authenticateToken,authorizeRoles(["admin"]),paymentController.getPaymentHistory.bind(paymentController))
paymentRoutes.get('/payments/tutors/:tutorId',authenticateToken,authorizeRoles(["tutor"]),paymentController.tutorAmount.bind(paymentController))
paymentRoutes.get('/payments/total/:tutorId',authenticateToken,authorizeRoles(["tutor"]),paymentController.tutorTotal.bind(paymentController))

export default paymentRoutes