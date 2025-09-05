const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath)=>{
  try{
      const result = await cloudinary.uploader.upload(filePath);
      return{
        url:result.secure_url,
        publicId:result.public_id
      }
  }
  catch(e){
    console.error("Some error occured",e);
    throw new Error("Some error occured");
  }
}

module.exports ={
  uploadToCloudinary
}





// todo    - > cloudinary.uploader.upload functions returns an object with various fields we use url and publicId and store them in mongo db so they if we delete/ modify them from cloudinary we can them delete / modify from mongo also