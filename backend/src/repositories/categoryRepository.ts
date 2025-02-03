import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import Category, { ICategory } from "../models/categoryModel";
import { BaseRepository } from "./baseRepository";


export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
    constructor(){
        super(Category)
    }
    async getCategory(): Promise<ICategory[]> {
        return await this.find({})
    }

    async getCategoryByName(name: string): Promise<ICategory | null> {
        return await this.findOne({name});
    }

    async addCategory(name: string): Promise<ICategory> {
        return await this.create({name})
    } 

    async listUnlistCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        return await this.findByIdAndUpdate(id,categoryData);
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return await this.findById(id)
    }
    async editCategory(id: string, name:string): Promise<ICategory | null> {
        return await this.findByIdAndUpdate(id, {name})
    }

}