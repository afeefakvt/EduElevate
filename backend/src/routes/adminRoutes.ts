import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService,adminRepository)


const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService,studentRepository) 


const adminRouter = Router()

adminRouter.post('/admin/login',studentController.adminLogin.bind(studentController))
// adminRouter.post('/admin/home',studentController.adminLogin.bind(studentController))
adminRouter.get('/admin/students',adminController.getStudents.bind(adminController))
adminRouter.patch('/admin/students/:studentId/block',adminController.blockStudent.bind(adminController))
adminRouter.get('/admin/students/:studentId/unblock',adminController.unblockStudent.bind(adminController))
adminRouter.get('/admin/tutors',adminController.getTutors.bind(adminController))
adminRouter.get('/admin/tutors/:tutorId',adminController.getTutorDetails.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/approve',adminController.approveTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/reject',adminController.rejectTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/block',adminController.blockTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/unblock',adminController.unblockTutor.bind(adminController))



export default adminRouter