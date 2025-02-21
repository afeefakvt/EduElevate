import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { authenticateToken } from "../middlewares/authToken";


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)


const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService) 


const adminRouter = Router()

adminRouter.get('/admin/students',authenticateToken,adminController.getStudents.bind(adminController))
adminRouter.patch('/admin/students/:studentId/update',authenticateToken,adminController.updateStudent.bind(adminController))
adminRouter.get('/admin/tutors',authenticateToken,adminController.getTutors.bind(adminController))
adminRouter.get('/admin/tutors/:tutorId',authenticateToken,adminController.getTutorDetails.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/approve',authenticateToken,adminController.approveTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/reject',authenticateToken,adminController.rejectTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/update',authenticateToken,adminController.updateTutor.bind(adminController))
adminRouter.get('/admin/courseApplications',authenticateToken,adminController.getCourseApplications.bind(adminController))
adminRouter.get('/admin/courseApplications/:courseId',authenticateToken,adminController.getCourseDetails.bind(adminController))
adminRouter.patch('/admin/courseApplications/:courseId/approve',authenticateToken,adminController.approveCourse.bind(adminController))
adminRouter.patch('/admin/courseApplications/:courseId/reject',authenticateToken,adminController.rejectCourse.bind(adminController))
// adminRouter.get('/admin/courses',authenticateToken,adminController.getCourses.bind(adminController))



export default adminRouter