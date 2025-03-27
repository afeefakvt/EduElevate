import { ICategoryService } from "../interfaces/category/ICategoryService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { ICategory } from "../models/categoryModel";
import { MESSAGES } from "../constants/message";

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
            return {success:false,message:MESSAGES.CATEGORY_NAME_EXISTS};
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
           throw new Error(MESSAGES.CATEGORY_NAME_EXISTS);
        }
        
        const category = await this.categoryRepository.getCategoryById(id)
        if (!category) {
            throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
        }
        return this.categoryRepository.editCategory(id,name)
    }


}