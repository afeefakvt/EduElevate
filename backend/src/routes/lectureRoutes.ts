import { Router } from "express";
import { LectureRepository } from "../repositories/lectureRepository";
import { LectureService } from "../services/lectureService";
import { LectureController } from "../controllers/lectureController";
import { uploadVideo } from "../config/cloudinary";


const lectureRepository  = new LectureRepository();
const lectureService = new LectureService(lectureRepository);
const lectureController = new LectureController(lectureService);

const lectureRoutes = Router();

lectureRoutes.post('/tutor/addLecture',uploadVideo.array('videoFiles'),lectureController.addLecture.bind(lectureController));

export default lectureRoutes