import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollmentController";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";
import { EnrollmentRepository } from "../repositories/enrollmentRepository";
import { EnrollmentService } from "../services/enrollmentService";


const enrollmentRepository = new EnrollmentRepository()
const enrollmentService = new EnrollmentService(enrollmentRepository)
const enrollmentController = new EnrollmentController(enrollmentService)

const enrollmentRoutes = Router()

enrollmentRoutes.get('/enrollment/myCourses',authenticateToken,authorizeRoles(["student"]),enrollmentController.getEnrolledCoursesByStudent.bind(enrollmentController));
enrollmentRoutes.get('/tutor/stats',authenticateToken,authorizeRoles(["tutor"]),enrollmentController.getTotalEnrolledCount.bind(enrollmentController))
enrollmentRoutes.get('/enrollment/:courseId',authenticateToken,authorizeRoles(["tutor"]),enrollmentController.getEnrolledCountPerCourse.bind(enrollmentController))


export default enrollmentRoutes