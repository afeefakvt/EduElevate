import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { StudentService } from "../services/studentService";
import { authenticateToken } from "../middlewares/authToken";
import { Student } from "../models/studentModel";
import { StudentRepository } from "../repositories/studentRepository";



const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService,studentRepository) 


const studentRouter = Router()

studentRouter.post('/register',studentController.createStudent.bind(studentController))
studentRouter.post('/verifyOtp',studentController.verifyOtp.bind(studentController))
studentRouter.post('/login',studentController.login.bind(studentController))
// studentRouter.post('/logout',studentController.logoutStudent.bind(studentController))



export default studentRouter