import { Model,Document, FilterQuery, QueryOptions } from "mongoose";
import { IBaseRepository } from "../interfaces/base/IBaseRepository";
import { log } from "console";

export class BaseRepository<T extends Document> implements IBaseRepository<T>{
    protected model:Model<T>;

    constructor(model:Model<T>){
        this.model = model
    }

    async create(data:Partial<T>):Promise<T>{        
        const newItem = new this.model(data)        
        return await newItem.save()
    }
    async findById(id:string):Promise<T | null>{
        return await this.model.findById(id);
    }

    async findAll():Promise<T[]>{
        return await this.model.find()
    }
    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query)
    }
    async find(filter:FilterQuery<T>,options?:QueryOptions):Promise<T[]>{
        return await this.model.find(filter,null,options)
    }
    async findByIdAndUpdate(id:string,data:Partial<T>):Promise<T | null>{
        return await this.model.findByIdAndUpdate(id,data,{new:true})
    }
}