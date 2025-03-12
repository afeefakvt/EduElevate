import { Router } from "express";
import { CourseController } from "../controllers/courseController";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";
import { authenticateToken } from "../middlewares/authToken"
import { authorizeRoles } from "../middlewares/authRole";
import { upload } from "../config/cloudinary";


const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController  =  new CourseController(courseService);

const courseRoutes = Router();

courseRoutes.post('/tutor/addCourse',authenticateToken,authorizeRoles(["tutor"]),upload.single('thumbnail'),courseController.addCourse.bind(courseController));
courseRoutes.get('/courses',courseController.getCourses.bind(courseController));
courseRoutes.get('/courses/:courseId',courseController.getCourseDetails.bind(courseController));
courseRoutes.patch('/courses/deleteCourse/:courseId',authenticateToken,authorizeRoles(["tutor"]),courseController.listUnlistCourse.bind(courseController));
courseRoutes.put('/tutor/editCourse/:courseId',upload.single('thumbnail'),authenticateToken,authorizeRoles(["tutor"]),courseController.editCourse.bind(courseController));
courseRoutes.get('/bestSelling',courseController.bestSellingCourses.bind(courseController));
courseRoutes.get('/courses/status',authenticateToken,authorizeRoles(['admin']),courseController.fetchStatusCounts.bind(courseController));



export default courseRoutes;