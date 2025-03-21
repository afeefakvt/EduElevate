import { Request,Response } from "express";
import { ICategoryService } from "../interfaces/category/ICategoryService";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { MESSAGES } from "../constants/message";


export class CategoryController{
    constructor(
        private categoryService:ICategoryService,
    ){}

    async getCategory(req:Request,res:Response):Promise<void>{
        try {
            const categories = await this.categoryService.getCategory()

            if(categories.length){
                res.status(HTTP_STATUS.OK).json({success:true,categories:categories})
            }else{
                res.status(HTTP_STATUS.NOT_FOUND).json({success:false,message:MESSAGES.NO_CATEGORIES_FOUND})
            }
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR, error: error instanceof Error ? error.message : error });

            
        }
    }

    async addCategory(req:Request,res:Response):Promise<void>{
                
        try {
            // console.log("categroy request");
            
            const {name} = req.body

            if(!name || typeof name !=='string'){
                res.status(HTTP_STATUS.BAD_REQUEST).json({success:false,message:MESSAGES.VALID_CATEGORY_REQUIRED})
                return;
            }
            const result = await this.categoryService.addCategory(name);
    
            if(result.success){
                res.status(HTTP_STATUS.OK).json({success:true,message:MESSAGES.CATEGORY_ADDED_SUCCESS,category:result.category})
            }else{
                res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: result.message });
            }
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
            });
            
        }
    }

    async listUnlistCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params;
            const {isListed} = req.body
        try {
            const category = await this.categoryService.listUnlistCategory(id,{isListed});

            if(!category){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.CATEGORY_NOT_FOUND})
                return;
            }

            res.status(HTTP_STATUS.OK).json(category)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }

    async editCategory(req:Request,res:Response):Promise<void>{
        try {
            const {id} = req.params;
            const {name} = req.body;
            const updatedCategory = await this.categoryService.editCategory(id,name)

            res.status(HTTP_STATUS.OK).json({message:MESSAGES.CATEGORY_UPDATED_SUCCESS,updatedCategory})            
        } catch (error) {

            if (error instanceof Error && error.message === MESSAGES.CATEGORY_NAME_EXISTS) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "Category name already exists",
                });
            } else if (error instanceof Error && error.message === MESSAGES.CATEGORY_NOT_FOUND) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: MESSAGES.CATEGORY_NOT_FOUND,
                });
            } else{
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: MESSAGES.INTERNAL_SERVER_ERROR,
                    error: error instanceof Error ? error.message : error,
                  });

             }   
            
        }
    }

}