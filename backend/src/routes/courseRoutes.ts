import { Router } from "express";
import { CourseController } from "../controllers/courseController";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";
import { authenticateToken } from "../middlewares/tutorAuthToken";
import { upload } from "../config/cloudinary";


const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController  =  new CourseController(courseService);

const courseRoutes = Router();

courseRoutes.post('/tutor/addCourse',upload.single('thumbnail'),authenticateToken,courseController.addCourse.bind(courseController));


export default courseRoutes;