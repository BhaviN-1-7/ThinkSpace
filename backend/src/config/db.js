import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected");
        //put the name you want before the ?
    }catch(error){
        console.log("MongoDB connection error:",error);
        process.exit(1)//exit with failure
    }
};