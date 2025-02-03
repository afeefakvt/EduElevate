import { FilterQuery, QueryOptions,Document } from "mongoose";

export interface IBaseRepository<T extends Document>{
    create(data:Partial<T>):Promise<T>;
    findById(id:string):Promise<T | null>;
    findAll():Promise<T[]>;
    findOne(filter:FilterQuery<T>):Promise<T | null>;
    find(filter:FilterQuery<T>,options?:QueryOptions):Promise<T[]>
    findByIdAndUpdate(id:string,data:Partial<T>):Promise<T | null>;
}