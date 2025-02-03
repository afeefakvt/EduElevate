import { Request,Response } from "express";
import { ICategoryService } from "../interfaces/category/ICategoryService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { CategoryService } from "../services/categoryService";


export class CategoryController{
    constructor(
        private categoryService:ICategoryService,
        private categoryRepository:ICategoryRepository
    ){}

    async getCategory(req:Request,res:Response):Promise<void>{
        try {
            const categories = await this.categoryService.getCategory()

            if(categories){
                res.status(200).json({success:true,categories:categories})
            }else{
                res.status(404).json({success:false,message:"no categories found"})
            }
            
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : error });

            
        }
    }

    async addCategory(req:Request,res:Response):Promise<void>{
                
        try {
            // console.log("categroy request");
            
            const {name} = req.body

            if(!name || typeof name !=='string'){
                res.status(400).json({success:false,message:"Category name is required"})
                return;
            }
            const result = await this.categoryService.addCategory(name);
    
            if(result.success){
                res.status(200).json({success:true,message:"category added successfully",category:result.category})
            }else{
                res.status(400).json({ success: false, message: result.message });
            }
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
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
                res.status(404).json({message:"category not found"})
                return;
            }

            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : error,
              });
            
        }
    }

    async editCategory(req:Request,res:Response):Promise<void>{
        try {
            const {id} = req.params;
            const {name} = req.body;
            const updatedCategory = await this.categoryService.editCategory(id,name)

            res.status(200).json({message:"Category updated sccessfully",updatedCategory})            
        } catch (error) {

            if (error instanceof Error && error.message === "category name already exists") {
                res.status(400).json({
                    success: false,
                    message: "Category name already exists",
                });
            } else if (error instanceof Error && error.message === "Category not found") {
                res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            } else{
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : error,
                  });

             }   
            
        }
    }

}