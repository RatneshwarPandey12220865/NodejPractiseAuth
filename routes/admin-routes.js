let authmiddleware = require("../middleware/auth-middleware")
let adminmiddleware = require("../middleware/admin-middleware")
let express = require('express');
let router = express.Router();

router.get("/admin",authmiddleware,adminmiddleware,(req,res)=>{
  res.json({
    "message": "Welcome to the admin dashboard",
  })
})

module.exports = router;