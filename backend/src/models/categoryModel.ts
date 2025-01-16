import mongoose,{Schema,Document} from "mongoose";

export interface ICategory extends Document{
    name:String,
    isListed:Boolean
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