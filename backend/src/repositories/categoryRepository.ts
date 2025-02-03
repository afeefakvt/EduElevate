import { Model } from "mongoose";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import Category, { ICategory } from "../models/categoryModel";
import { Mode } from "fs";


export class CategoryRepository implements ICategoryRepository{

    private categoryModel:Model<ICategory>
    constructor(categoryModel:Model<ICategory>){
        this.categoryModel = categoryModel
    }
    async getCategory(): Promise<ICategory[]> {
        return await this.categoryModel.find()
    }

    async getCategoryByName(name: string): Promise<ICategory | null> {
        return await this.categoryModel.findOne({name});
    }

    async addCategory(name: string): Promise<ICategory> {
        const newCategory = new this.categoryModel({name});
        return await newCategory.save()
    } 

    async listUnlistCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        return await this.categoryModel.findByIdAndUpdate(id,categoryData,{new:true});
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return await this.categoryModel.findById(id)
    }
    async editCategory(id: string, name:string): Promise<ICategory | null> {
        return await this.categoryModel.findByIdAndUpdate(id, {name} , {new:true})
    }

}