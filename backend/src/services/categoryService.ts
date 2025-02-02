import { ICategoryService } from "../interfaces/category/ICategoryService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { ICategory } from "../models/categoryModel";

export class CategoryService implements ICategoryService{
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository:ICategoryRepository){
        this.categoryRepository=categoryRepository

    }

    async getCategory(): Promise<ICategory[]> {
        return await this.categoryRepository.getCategory();
    }
    async addCategory(name: string): Promise<{ success: boolean; message?:string; category?:ICategory}> {
        const categoryName = name.trim().toLocaleLowerCase()
        const existingCategory = await this.categoryRepository.getCategoryByName(categoryName);

        if(existingCategory){
            return {success:false,message:"Category with this name already exists"};
        }
        
        const category = await this.categoryRepository.addCategory(categoryName);
        return {success:true,category}
    }
    async listUnlistCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        return this.categoryRepository.listUnlistCategory(id,categoryData);
    }


    async editCategory(id: string, name: string): Promise<ICategory | null> {

        const existingCategory = await this.categoryRepository.getCategoryByName(name);
        if (existingCategory) {
           throw new Error("category name already exists");
        }
        
        const category = await this.categoryRepository.getCategoryById(id)
        if (!category) {
            throw new Error("Category not found");
        }
        return this.categoryRepository.editCategory(id,name)
    }


}