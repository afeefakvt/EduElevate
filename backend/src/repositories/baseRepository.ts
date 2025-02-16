import { Model,Document, FilterQuery, QueryOptions } from "mongoose";
import { IBaseRepository } from "../interfaces/base/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T>{
    protected model:Model<T>;

    constructor(model:Model<T>){
        this.model = model
    }

    async create(data:Partial<T>):Promise<T>{        
        const newItem = new this.model(data)        
        return await newItem.save()
    }
     findById(id:string){
        return this.model.findById(id);
    }

    async findAll():Promise<T[]>{
        return await this.model.find()
    }
    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query)
    }
     find(filter:FilterQuery<T>,options?:QueryOptions){
        return this.model.find(filter,null,options)
    }
    async findByIdAndUpdate(id:string,data:Partial<T>):Promise<T | null>{
        return await this.model.findByIdAndUpdate(id,data,{new:true})
    }
    async findByIdAndDelete(id:string){
        return this.model.findByIdAndDelete(id);
    }
}