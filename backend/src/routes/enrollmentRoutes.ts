import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollmentController";
import { authenticateToken } from "../middlewares/authToken";
import { EnrollmentRepository } from "../repositories/enrollmentRepository";
import { EnrollmentService } from "../services/enrollmentService";


const enrollmentRepository = new EnrollmentRepository()
const enrollmentService = new EnrollmentService(enrollmentRepository)
const enrollmentContoller = new EnrollmentController(enrollmentService)

const enrollmentRoutes = Router()

export default enrollmentRoutes