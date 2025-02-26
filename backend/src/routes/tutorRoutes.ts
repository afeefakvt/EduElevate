import { Router } from "express";
import { TutorController } from "../controllers/tutorController";
import { TutorService } from "../services/tutorService";
import { TutorRepository } from "../repositories/tutorRepository";
import { validateTutorRegistration ,validateTutorLogin,validateForgotPassword} from "../middlewares/validationMiddleware";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";


const tutorRepository = new TutorRepository()
const tutorService = new TutorService(tutorRepository)
const tutorController  = new TutorController(tutorService)


const tutorRouter = Router()

tutorRouter.post('/tutor/refreshToken',tutorController.refreshAccessToken.bind(tutorController));


tutorRouter.post('/tutor/register',validateTutorRegistration,tutorController.registerTutor.bind(tutorController))
tutorRouter.post('/tutor/verifyOtp',tutorController.verifyOtp.bind(tutorController))
tutorRouter.post('/tutor/resendOtp',tutorController.resendOtp.bind(tutorController))
tutorRouter.post('/tutor/login',validateTutorLogin,tutorController.loginTutor.bind(tutorController))
tutorRouter.post('/tutor/forgotPassword',tutorController.forgotPassword.bind(tutorController))
tutorRouter.post('/tutor/resetPassword',validateForgotPassword,tutorController.resetPassword.bind(tutorController))
tutorRouter.get('/tutor/myCourses',authenticateToken,authorizeRoles(["tutor"]),tutorController.getTutorCourses.bind(tutorController))
tutorRouter.get('/tutor/myCourses/:courseId',authenticateToken,authorizeRoles(["tutor"]),tutorController.getTutorCourseDetails.bind(tutorController))
tutorRouter.post('/tutor/logout',tutorController.logoutTutor.bind(tutorController))
tutorRouter.put('/tutor/editProfile/:tutorId',tutorController.editTutorProfile.bind(tutorController))
tutorRouter.put('/tutor/updatePassword/:tutorId',tutorController.changeTutorPassword.bind(tutorController))



export default tutorRouter