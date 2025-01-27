import { Router } from "express";
import { TutorController } from "../controllers/tutorController";
import { TutorService } from "../services/tutorService";
import { TutorRepository } from "../repositories/tutorRepository";


const tutorepository = new TutorRepository()
const tutorService = new TutorService(tutorepository)
const tutorController  = new TutorController(tutorService,tutorepository)


const tutorRouter = Router()

tutorRouter.post('/tutor/register',tutorController.registerTutor.bind(tutorController))
tutorRouter.post('/tutor/verifyOtp',tutorController.verifyOtp.bind(tutorController))
tutorRouter.post('/tutor/login',tutorController.loginTutor.bind(tutorController))



export default tutorRouter