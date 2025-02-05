import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { CategoryRepository } from "../repositories/categoryRepository";
import { CategoryService } from "../services/categoryService";
import Category from "../models/categoryModel";
import { authenticateToken } from "../middlewares/authToken";



const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);


const categoryRouter = Router()




categoryRouter.get('/admin/category',authenticateToken,categoryController.getCategory.bind(categoryController));
categoryRouter.post('/admin/category/addCategory',authenticateToken,categoryController.addCategory.bind(categoryController));
categoryRouter.patch('/admin/category/:id/listUnlistCategory',authenticateToken,categoryController.listUnlistCategory.bind(categoryController));
categoryRouter.put('/admin/category/:id/editCategory',authenticateToken,categoryController.editCategory.bind(categoryController));



export default categoryRouter