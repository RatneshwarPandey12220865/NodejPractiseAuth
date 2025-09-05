const mongoose = require('mongoose');

const connection = async () =>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  }
  catch(e){
    console.log("Could not connect to MongoDB",e);
    process.exit(1);
  }
}

module.exports = connection;