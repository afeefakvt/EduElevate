import { Router } from "express";
import { LectureRepository } from "../repositories/lectureRepository";
import { LectureService } from "../services/lectureService";
import { LectureController } from "../controllers/lectureController";
import { uploadVideo } from "../config/cloudinary";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";

const lectureRepository  = new LectureRepository();
const lectureService = new LectureService(lectureRepository);
const lectureController = new LectureController(lectureService);

const lectureRoutes = Router();

lectureRoutes.post('/tutor/addLecture/:courseId',uploadVideo.array('videoFiles'),authenticateToken,authorizeRoles(["tutor"]),lectureController.addLecture.bind(lectureController));
lectureRoutes.get('/tutor/:courseId/lectures',authenticateToken,authorizeRoles(["tutor"]),lectureController.getLecturesByCourse.bind(lectureController));
lectureRoutes.put('/tutor/editLecture/:lectureId',uploadVideo.single('videoFiles'),authenticateToken,authorizeRoles(["tutor"]),lectureController.editLecture.bind(lectureController));

export default lectureRoutes