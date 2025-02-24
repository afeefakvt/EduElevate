import { Router } from "express";
import { RatingRepository } from "../repositories/ratingRepository";
import { RatingService } from "../services/ratingService";
import { RatingController } from "../controllers/ratingController";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";


const ratingRepository = new RatingRepository();
const ratingService = new RatingService(ratingRepository);
const ratingController = new RatingController(ratingService)

const ratingRoutes = Router()

ratingRoutes.post('/rating/addRating',authenticateToken,authorizeRoles(["student"]),ratingController.addRating.bind(ratingController))
ratingRoutes.get('/rating/:courseId',ratingController.getCourseRatings.bind(ratingController))

export default ratingRoutes