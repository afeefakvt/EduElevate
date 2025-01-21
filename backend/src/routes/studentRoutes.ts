import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { StudentService } from "../services/studentService";
import { authenticateToken } from "../middlewares/authToken";
import { Student } from "../models/studentModel";


const studentController = new StudentController() 


const studentRouter = Router()

studentRouter.post('/register',studentController.createStudent.bind(studentController))
studentRouter.post('/verifyOtp',studentController.verifyOtp.bind(studentController))
studentRouter.post('/login',studentController.login.bind(studentController))

export default studentRouter