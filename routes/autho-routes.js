const express = require('express');
const {registerUser,loginUser,updatePassword}= require("../controllers/auth-controller");
const authmiddleware = require("../middleware/auth-middleware");
const router = express.Router();


  // * all the routes are related to authorisation 

  router.post("/register",registerUser);
  router.post("/login",loginUser);
  router.post("/update-password",authmiddleware,updatePassword);


module.exports = router;