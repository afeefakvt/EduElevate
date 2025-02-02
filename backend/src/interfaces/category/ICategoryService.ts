import { ICategory } from "../../models/categoryModel";

export interface ICategoryService{
    getCategory():Promise<ICategory[]>;
    addCategory(name:string):Promise<{success:boolean; message?:string; category?:ICategory}>;
    listUnlistCategory(id:string,categoryData:Partial<ICategory>):Promise<ICategory | null> 
    editCategory(id:string,name:string):Promise<ICategory | null>
}