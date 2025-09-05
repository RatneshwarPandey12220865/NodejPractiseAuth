const isadmin = (req,res,next)=>{
  if(req.userInfo.role != 'admin'){
    return res.status(401).json({
      success: false,
      error: 'You are not authorized to access this route',
      message: "Unauthorized"
    })

  }
  next();
}
module.exports = isadmin;