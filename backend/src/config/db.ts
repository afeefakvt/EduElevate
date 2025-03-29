import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config()

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log('mongodb connected successfully');
        
        
    } catch (error) {
        console.log('error in connecting mongodb',error);
        process.exit(1); // Exit the application if the database connection fails
        
    }
}
export default connectDB