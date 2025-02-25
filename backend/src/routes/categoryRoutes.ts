import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { CategoryRepository } from "../repositories/categoryRepository";
import { CategoryService } from "../services/categoryService";
import { authenticateToken } from "../middlewares/authToken";
import { authorizeRoles } from "../middlewares/authRole";



const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);


const categoryRouter = Router()




categoryRouter.get('/admin/category',authenticateToken,authorizeRoles(["admin"]),categoryController.getCategory.bind(categoryController));
categoryRouter.post('/admin/category/addCategory',authenticateToken,authorizeRoles(["admin"]),categoryController.addCategory.bind(categoryController));
categoryRouter.patch('/admin/category/:id/listUnlistCategory',authenticateToken,authorizeRoles(["admin"]),categoryController.listUnlistCategory.bind(categoryController));
categoryRouter.put('/admin/category/:id/editCategory',authenticateToken,authorizeRoles(["admin"]),categoryController.editCategory.bind(categoryController));
categoryRouter.get('/categories', categoryController.getCategory.bind(categoryController));




export default categoryRouter