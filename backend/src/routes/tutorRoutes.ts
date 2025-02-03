import { Router } from "express";
import { TutorController } from "../controllers/tutorController";
import { TutorService } from "../services/tutorService";
import { TutorRepository } from "../repositories/tutorRepository";
import { validateTutorRegistration ,validateTutorLogin,validateForgotPassword} from "../middlewares/validationMiddleware";
import Tutor from "../models/tutorModel";


const tutorepository = new TutorRepository(Tutor)
const tutorService = new TutorService(tutorepository)
const tutorController  = new TutorController(tutorService,tutorepository)


const tutorRouter = Router()

tutorRouter.post('/tutor/register',validateTutorRegistration,tutorController.registerTutor.bind(tutorController))
tutorRouter.post('/tutor/verifyOtp',tutorController.verifyOtp.bind(tutorController))
tutorRouter.post('/tutor/resendOtp',tutorController.resendOtp.bind(tutorController))
tutorRouter.post('/tutor/login',validateTutorLogin,tutorController.loginTutor.bind(tutorController))
tutorRouter.post('/tutor/forgotPassword',tutorController.forgotPassword.bind(tutorController))
tutorRouter.post('/tutor/resetPassword',validateForgotPassword,tutorController.resetPassword.bind(tutorController))



export default tutorRouter