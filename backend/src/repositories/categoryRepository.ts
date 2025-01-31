import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import Category, { ICategory } from "../models/categoryModel";


export class CategoryRepository implements ICategoryRepository{
    async getCategory(): Promise<ICategory[]> {
        return await Category.find()
    }

    async getCategoryByName(name: string): Promise<ICategory | null> {
        return await Category.findOne({name});
    }

    async addCategory(name: string): Promise<ICategory> {
        const newCategory = new Category({name});
        return await newCategory.save()
    } 

    async listUnlistCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(id,categoryData,{new:true});
    }

}