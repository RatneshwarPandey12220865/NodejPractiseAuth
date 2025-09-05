const express = require('express');
const authmiddleware  = require("../middleware/auth-middleware");
const router = express.Router();
router.get("/home",authmiddleware,(req,res)=>{

  const {id,username,role} = req.userInfo;
  res.json({
    message:'Welcome to the home page',
    user:{
      userId:id,
      username:username,
      role:role
    }
  })
})

module.exports= router;