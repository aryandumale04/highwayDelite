const mongoose =  require("mongoose");
require("dotenv").config();

const connectDB = async ()=>{
    try{
         await mongoose.connect(process.env.MONGO_URI);
         console.log("MongoDB connected Successfully ");
    }catch(err){

        console.log("MongoDB connection failed : ", err);
        process.exit(1);

    }
}
module.exports = connectDB;