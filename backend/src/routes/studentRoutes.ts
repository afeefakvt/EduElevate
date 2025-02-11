import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { StudentService } from "../services/studentService";
import { authenticateToken } from "../middlewares/authToken";
import { Student } from "../models/studentModel";
import { StudentRepository } from "../repositories/studentRepository";
import { validateStudentRegistration,validateStudentLogin,validateForgotPassword } from "../middlewares/validationMiddleware";



const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService) 


const studentRouter = Router()

studentRouter.post('/register',validateStudentRegistration,studentController.createStudent.bind(studentController))
studentRouter.post('/verifyOtp',studentController.verifyOtp.bind(studentController))
studentRouter.post('/resendOtp',studentController.resendOtp.bind(studentController))
studentRouter.post('/login',validateStudentLogin,studentController.login.bind(studentController))
studentRouter.post('/auth/google',studentController.googleLogin.bind(studentController))
studentRouter.post('/forgotPassword',studentController.forgotPassword.bind(studentController))
studentRouter.post( '/resetPassword',validateForgotPassword,studentController.resetPassword.bind(studentController))
studentRouter.post( '/course/checkout/:courseId',authenticateToken,studentController.stripePayment.bind(studentController))

// studentRouter.post('/logout',studentController.logoutStudent.bind(studentController))



export default studentRouter