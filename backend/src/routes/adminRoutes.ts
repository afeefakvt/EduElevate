import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { StudentController } from "../controllers/studentController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { authenticateToken} from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)


const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService) 


const adminRouter = Router()

adminRouter.get('/admin/students',authenticateToken,authorizeRoles(["admin"]),adminController.getStudents.bind(adminController))
adminRouter.patch('/admin/students/:studentId/update',authenticateToken,authorizeRoles(["admin"]),adminController.updateStudent.bind(adminController))
adminRouter.get('/admin/tutors',authenticateToken,authorizeRoles(["admin"]), adminController.getTutors.bind(adminController))
adminRouter.get('/admin/tutors/:tutorId',authenticateToken,authorizeRoles(["admin"]),adminController.getTutorDetails.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/approve',authenticateToken,authorizeRoles(["admin"]),adminController.approveTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/reject',authenticateToken,authorizeRoles(["admin"]),adminController.rejectTutor.bind(adminController))
adminRouter.patch('/admin/tutors/:tutorId/update',authenticateToken,authorizeRoles(["admin"]),adminController.updateTutor.bind(adminController))
adminRouter.get('/admin/courseApplications',authenticateToken,authorizeRoles(["admin"]),adminController.getCourseApplications.bind(adminController))
adminRouter.get('/admin/courseApplications/:courseId',authenticateToken,authorizeRoles(["admin"]),adminController.getCourseDetails.bind(adminController))
adminRouter.patch('/admin/courseApplications/:courseId/approve',authenticateToken,authorizeRoles(["admin"]),adminController.approveCourse.bind(adminController))
adminRouter.patch('/admin/courseApplications/:courseId/reject',authenticateToken,authorizeRoles(["admin"]),adminController.rejectCourse.bind(adminController))
// adminRouter.get('/admin/courses',authenticateToken,adminController.getCourses.bind(adminController))



export default adminRouter