let jwt = require("jsonwebtoken");

const authmiddleware = (req,res,next)=>{
  try{
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    // ? this is the token that we get from the client side
    if(token == null){
        return res.status(401).json({
            success:"false",
            error: 'You are not authenticated',
            message: "Unauthorized"
        })
    }

    // ? Decode the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // ? if the token is valid then we will add the user info to the request object

    console.log(decoded);
    req.userInfo = decoded;
    next();

    

    }
    catch(err){
      return res.status(500).json({
        success:"false",
        error: 'Error decoding token',
        message: `Internal server error ${err}`
      })
    }



    
}

module.exports = authmiddleware;