const User = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");


const registerUser = async (req,res)=>{
  try{
      //first extract user information from request .body
      const {username,email,password,role} = req.body;

      //first check if the user exist or not 

      const existsUser = await User.findOne({ $or :[{username}, {email}]});


      if(existsUser){
        return res.status(400).json({
          message: "User already exist either with the same name or same email.Please try with different email or name  ",
        })
      }


      //hash the user password 
      const salt =await  bcrypt.genSalt(10);
      const hashedPassword =await  bcrypt.hash(password,salt);

      //create a new user and save in your data base
      const newUser = new User({
        username,
        email,
        password:hashedPassword,
        role: role || 'user'
      });

      await newUser.save();

      if(newUser){
        res.status(201).json({
          success:true,
          message:"user created successfully"
        })
      }
      else{
        res.status(400).json({
          success:false,
          message:"user not created"})
      }





  }
  catch(err){
    console.log("eror")
    res.status(500).json({
      status:"fail",
      message:`Some error happened : ${err.message}`
    })
  }
}


//login controller

 // ! we can login with the field which is unique it can be either user or email but remeber the field must be unique normally email is used since it is always uniqye




 const loginUser = async(req,res)=>{
  try{
      const {username,password} = req.body;
      const existUser = await User.findOne({username});
      if(!existUser){
        return res.status(400).json({
          success:false,
          message:"Invalid credentials"
        })
      }

      //check if the password macthes or not

      const passwordMatch= await bcrypt.compare(password,existUser.password);
      if(!passwordMatch){
        return res.status(400).json({
          success:false,
          message:"Invalid credentials"
        })
      }


      const accessToken = jwt.sign({
        id:existUser._id,
        username:existUser.username,
        role:existUser.role

      },process.env.JWT_SECRET_KEY,{
        expiresIn:"1h"
      })

      res.status(200).json({
        success:true,
        message:"Logged in successfully",
        accessToken
      })



  }
  catch(err){
    console.log("eroor")
    res.status(500).json({
      status:"fail",
      message:`Some eror happened : ${err.message}`
    })
  }
 }


 const updatePassword = async (req,res)=>{

  try{
        //fetch the id from jwt token
        const userId = req.userInfo.id;
        
        
        
        // get the old pass wrod and new password
        const {oldPassword,newPassword} = req.body;
        
        
        //check if the user exits 
        const user = await User.findById(userId);
        
        
        if(!user){
          return res.status(404).json({
            success:false,
            message:"User not loged in please log in"
            })
        }


        //check if the oldpassword is correct or not
        const checkPass =await  bcrypt.compare(oldPassword,user.password);


        if(!checkPass){
          return res.status(400).json({
            success:false,
            message:"Invalid credentials: old password is wrong please give correct password"
          })
        }

        //hash the new password
        const salt =await  bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        //update the password
        user.password = hashedPassword;
        await user.save();

        //or
        // const updated = await User.findByIdAndUpdate(userId, {password:hashedPassword}, {new:true});

        return res.status(200).json({
          success:true,
          message:"Password updated successfully"
        });







  }
  catch(err){
    res.status(500).json({
      status:"fail",
      message:`Some eror happened : ${err.message}`
    })
  }
 }






    

 module.exports = {registerUser,loginUser,updatePassword};
