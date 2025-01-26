import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)


const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService,studentRepository) 


const adminRouter = Router()

adminRouter.post('/admin/login',studentController.adminLogin.bind(studentController))
// adminRouter.post('/admin/home',studentController.adminLogin.bind(studentController))
adminRouter.post('/admin/students',adminController.getStudents.bind(adminController))
adminRouter.post('/admin/tutors',adminController.getTutors.bind(adminController))



export default adminRouter