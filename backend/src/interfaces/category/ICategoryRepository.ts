import { ICategory } from "../../models/categoryModel";

export interface ICategoryRepository{
    getCategory():Promise<ICategory[]>;
    getCategoryByName(name:string):Promise<ICategory | null>;
    addCategory(name:string):Promise<ICategory>;
    listUnlistCategory(id:string,categoryData:Partial<ICategory>):Promise<ICategory | null>
}