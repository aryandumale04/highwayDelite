// importing the required things 

const express = require("express")
const cors = require("cors") 
require("dotenv").config();
const connectDB = require("./config/db")
const user =  require("./models/User")
const generateToken =  require("./utils/jwt")



// creating the app(Instance)
const app = express();



//middlewares 
app.use(cors());
app.use(express.json());
connectDB()


// default route 

app.get("/", (req, res) => {
  res.send("Helldvsdvfdvfvfo!");
});


//signup get otp route
app.post("/generate-otp-signup", async(req,res)=>{
  const {name ,email,dob} = req.body;
  if(!name){
   return  res.status(400).json({message: "Your name cannot be empty!!"});
  }
  if(!email){
    return res.status(400).json({message: "Email cannot be empty!!"});
  }
  if(!dob){
    return res.status(400).json({message: "Date-of-birth cannot be empty!!"});
  }

  try{
    const existingUser = await user.findOne({email});
    if(existingUser){
       return  res.status(400).json({message : "User with that email already exists !"});
    } else {
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
       // fixed math
       const newUser = await user.create({
        name,
        email,
        dob,
        otp,
        isVerified : false
      });
      res.status(200).json({
        message: "OTP generated successfully !",
        otp : otp
      });
    }
  } catch(err){
    res.status(500).json({message:"Server Error"});
    console.log(err);
  }
});

app.post("/generate-otp-signin", async (req,res)=>{
  const {email} = req.body;
  const existingUser = await user.findOne({email}); // added await
  try{
    if(!existingUser){
    return res.status(400).json({message: "User with that email does not exist !"});
  } else {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.otp = otp;
    await existingUser.save();
    return res.status(200).json({
      message: "OTP generated successfully !",
      otp : otp
    });
  }
  }catch(err){
    res.status(500).json({message:"Server Error"});
    console.log(err);

  }
});

app.post("/verify-otp-signup", async (req,res)=>{

  const{email,otp} = req.body;
  if(!otp) return res.status(400).json({message:"OTP cannot be empty"});


  const existingUser =  await user.findOne({
    email
  })
  try{
      if(existingUser.otp != otp){
   return  res.status(400).json({message:"Incorrect OTP"});
  }else{
    existingUser.otp=null;
    existingUser.isVerified=true;
    await existingUser.save();

    const token =  generateToken(existingUser._id);
    res.status(200).json({
      message:"OTP verified successfully",
      token,
      user:{
        name: existingUser.name,
        email: existingUser.email
      }
    
    })
    
     // generating the token 
     
  }
  }catch(err){
    res.status(500).json({message:"Server Error"});
    console.log(err);
  }

});

app.post("/verify-otp-signin", async(req,res) => {

  const{email,otp} = req.body;
  if(!otp) return res.status(400).json({message:"OTP cannot be empty"});

  const existingUser = await  user.findOne({email});
  try{
    if(!existingUser){
   return  res.status(400).json({
      message: "User with that email does not exist"
    })
  }
  else{
    // need to verify the otp 
    if(existingUser.otp != otp ){
     return  res.status(400).json({
        message : "Invalid OTP"
      })
    }else{
      existingUser.isVerified = true ;
      existingUser.otp=null;
      await existingUser.save();
      const token = generateToken(existingUser._id);

      res.status(200).json({
        message:"OTP verified.",
        token,
        user:{
          name: existingUser.name,
          email : existingUser.email
        }
      
      
      });
      

    }
  }
  }catch(err){
    res.status(500).json({message:"Server Error"});
    console.log(err);
  }


})





//listening
app.listen(5000, () => {
  console.log("Test server running on port 5000");
});
