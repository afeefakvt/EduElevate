import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { Student } from "../models/studentModel";
import Tutor from "../models/tutorModel";
import { authenticateToken } from "../middlewares/authToken";


const adminRepository = new AdminRepository(Student,Tutor)
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService,adminRepository)


const studentRepository = new StudentRepository(Student)
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService,studentRepository) 


const adminRouter = Router()

adminRouter.post('/admin/login',studentController.adminLogin.bind(studentController))
adminRouter.get('/admin/students',authenticateToken,adminController.getStudents.bind(adminController))
adminRouter.patch('/admin/students/:studentId/update',authenticateToken,adminController.updateStudent.bind(adminController))
adminRouter.get('/admin/tutors',authenticateToken,adminController.getTutors.bind(adminController))
adminRouter.get('/admin/tutors/:tutorId',authenticateToken,adminController.getTutorDetails.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/approve',authenticateToken,adminController.approveTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/reject',authenticateToken,authenticateToken,adminController.rejectTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/update',authenticateToken,adminController.updateTutor.bind(adminController))



export default adminRouter