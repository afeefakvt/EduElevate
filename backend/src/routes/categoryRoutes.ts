import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { CategoryRepository } from "../repositories/categoryRepository";
import { CategoryService } from "../services/categoryService";



const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService,categoryRepository);


const categoryRouter = Router()




categoryRouter.get('/admin/category',categoryController.getCategory.bind(categoryController));
categoryRouter.post('/admin/category/addCategory',categoryController.addCategory.bind(categoryController));
categoryRouter.patch('/admin/category/:id/listUnlistCategory',categoryController.listUnlistCategory.bind(categoryController));
categoryRouter.put('/admin/category/:id/editCategory',categoryController.editCategory.bind(categoryController));



export default categoryRouter