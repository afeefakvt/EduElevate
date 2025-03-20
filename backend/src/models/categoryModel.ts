import mongoose,{Schema,Document} from "mongoose";

export interface ICategory extends Document{
    name:string,
    isListed:boolean
}

const CategorySchema :Schema  = new Schema<ICategory>(
    {
        name:{
            type:String,
            required:true
        },
        isListed:{
            type:Boolean,
            default:true
        }
    }
)

const Category = mongoose.model<ICategory>("Category",CategorySchema);
export default Category;